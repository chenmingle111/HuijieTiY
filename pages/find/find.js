Page({
  data: {
    newsList: [
      {
        title: '人为什么会生病',
        description: '《中华人民共和国医师法》明确规定：每年8月19日为中国医师节。2024年8月19日是第七个“中国医师节”',
        time: '22分钟前',
        image: 'https://s2.loli.net/2024/11/14/DRZPT6b8JKgVIGk.png',
        url: 'https://mp.weixin.qq.com/s/-EBonPqmttIKS7lDbeEnkA' // 添加链接
      },
      {
        title: '【养生】秋季如何养生？这份健康指南请收好→',
        description: '炎热的夏季转眼过去，迎来了金风送爽、天朗气清的秋季。秋季，指农历8、9、10月，包括立秋、处暑、白露',
        time: '1小时前',
        image: 'https://s2.loli.net/2024/11/14/uxYZtoULDONQ6m2.png',
        url: 'https://mp.weixin.qq.com/s/9krkmnVAx2I3rrwJogs0jw' // 添加链接
      },
      {
        title: '手把手教你解读体检报告单',
        description: '之前和大家科普过关于如何选择体检项目，教大家如何“有效体检，但体检完后，新的问题又来了',
        time: '22分钟前',
        image: 'https://s2.loli.net/2024/11/14/sZ3pNryK6QX4GOo.png',
        url: 'https://mp.weixin.qq.com/s/X075zQHqFCXvYT2DjtC8LA' // 添加链接
      },
      {
        title: '体检报告看不懂？教你三招看懂所有体检报告单！',
        description: '很多人年年都体检，但拿到体检报告后却一头雾水看不懂体检报告，体检就失去了意义。',
        time: '25分钟前',
        image: 'https://s2.loli.net/2024/11/14/lg2HtrkfBdAJG4o.png',
        url: 'https://mp.weixin.qq.com/s/53R-rPPmP1YWELJ3XYJZ8Q' // 添加链接
      }
    ],
    isRefreshing: false
  },

  //事件处理函数
  bindViewTap: function(event) {
    const url = event.currentTarget.dataset.url; // 获取链接
    wx.navigateTo({
      url: '../webview/webview?url=' + encodeURIComponent(url) // 传递链接
    });
  },

  onLoad: function () {
    // 页面初始化时的逻辑
  },

  onPullDownRefresh: async function () {
    this.setData({ isRefreshing: true });

    // 模拟异步请求数据
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItems = [
      {
        title: '新内容：广州市城市轨道交通第四期建设规划！',
        description: '新的环境影响评估第一次信息公示...',
        time: '刚刚',
        image: 'https://example.com/path/to/image.png',
        url: 'https://example.com/path/to/new-content' // 添加新内容的链接
      },
      // 添加更多新数据...
    ];

    this.setData({
      newsList: newItems.concat(this.data.newsList),
      isRefreshing: false
    });
  },
});
