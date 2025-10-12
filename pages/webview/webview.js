Page({
  data: {
    url: ''
  },

  onLoad: function(options) {
    this.setData({
      url: decodeURIComponent(options.url) // 获取并解码链接
    });
  }
});
