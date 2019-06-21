// miniprogram/pages/demo/demo.js

/*
 * 查询字符串转换成对象
 * 
 * a=1&b=2
 * 
 * {
 *  a:1,
 *  b:2
 * }
 */
function paramsToObject(str) {
  return str.split("&").reduce(function (prev, curr, i, arr) {
    var p = curr.split("=");
    prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
    return prev;
  }, {});
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1,

    pageOptions:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageOptions = options;
    if (options.scene) {
      pageOptions = paramsToObject(decodeURIComponent(options.scene));
    }

    console.log(options, pageOptions);
    let option_id = pageOptions.id || 1;
    this.setData({
      id: option_id,
      pageOptions:JSON.stringify(pageOptions),
    })
  },

  /**
   * 跳转到制作小程序码的页面
   */
  gotoShare: function () {
    wx.navigateTo({
      url: '/pages/share/share?page=pages/demo/demo&id=' + this.data.id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _this = this;
    return {
      title: '云开发·云调用生成小程序码Demo',
      path: '/pages/demo/demo?id=' + _this.data.id
    }
  }
})