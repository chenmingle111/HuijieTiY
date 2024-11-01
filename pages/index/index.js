// index.js
Page({
  data: {},

  // 跳转到查看历史数据界面
  viewHistory() {
    wx.navigateTo({
      url: '/pages/chart-red/chart-red' // 确保路径指向正确的图表页面
    });
  },

  // 跳转到数据收集界面
  updateData() {
    wx.navigateTo({
      url: '/pages/data-collection/data-collection' // 确保路径指向正确的数据收集页面
    });
  }
});
