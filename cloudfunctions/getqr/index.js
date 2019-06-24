// 云函数入口文件
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const bucketPrefix = 'cloud://idc-4d11a4.6964-idc-4d11a4-1257831628/qr/'; // env: 'idc-4d11a4'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const full_path = event.page + '?' + event.scene;
  const qr_name_hash = crypto.createHash('md5').update(full_path).digest('hex');
  const temp_id = bucketPrefix + qr_name_hash + '.jpg';
  // return {
  //   full_path,
  //   qr_name_hash,
  //   temp_id
  // }

  try {
    // 先尝试获取文件，存在就直接返回临时路径
    let getURLReault = await cloud.getTempFileURL({
      fileList: [temp_id]
    });
    // return getURLReault;
    let fileObj = getURLReault.fileList[0];
    if (fileObj.tempFileURL != '') {
      fileObj.fromCache = true;
      return fileObj;
    }

    // 生成小程序码
    const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene,
      page: event.page,
      width: 240
    })
    // return wxacodeResult;
    if (wxacodeResult.errCode != 0) {
      // 生成二维码失败，返回错误信息
      return wxacodeResult;
    }

    // 上传到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: 'qr/' + qr_name_hash + '.jpg',
      fileContent: wxacodeResult.buffer,
    });
    // return uploadResult;
    if (!uploadResult.fileID) {
      //上传失败，返回错误信息
      return uploadResult;
    }

    // 获取图片临时路径
    getURLReault = await cloud.getTempFileURL({
      fileList: [uploadResult.fileID]
    });
    fileObj = getURLReault.fileList[0];
    fileObj.fromCache = false;

    // 上传成功，获取文件临时url，返回临时路劲的查询结果
    return fileObj;

  } catch (err) {
    return err
  }

}