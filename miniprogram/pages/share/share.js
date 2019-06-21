// miniprogram/pages/share/share.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qr_url:null,
    opener:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    let _this = this;
    const queryPage = options.page;// 开头不需要“/”
    const queryScene = Object.keys(options).reduce(function (result, key) {
      if (key != 'page') {
        result.push(key + '=' + options[key]);
      }
      return result;
    }, []).join('&');

    console.log({
      page: queryPage,
      scene: queryScene,
    });

    wx.cloud.callFunction({
      name: 'getqr',
      data: {
        page: queryPage,
        scene: queryScene,
      }
    }).then(res => {
      console.log(res.result);
      if (res.result.status == 0) {
        _this.setData({
          qr_url: res.result.tempFileURL,
          opener: queryPage + '&' + queryScene,
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
      }
    }).catch(err => {
      // handle error
      console.error(err);
      wx.showToast({
        icon: 'none',
        title: '调用失败',
      })
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _this = this;

    let ret_obj = {
      title: '云开发·云调用生成小程序码Demo',
      path: `/${_this.data.opener}`,
      imageUrl: _this.data.share_img,
    };
    if (_this.data.qr_url) {
      ret_obj.imageUrl = _this.data.qr_url
    }
    return ret_obj;
  }
})