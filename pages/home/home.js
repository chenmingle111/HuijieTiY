import BaseChart from '../../utils/baseChart/baseChart';

Page({
  data: {
    showOptions: false,
    history: [], // 存储记录
    DataKeyAll: [ 'a', 'b', 'r', 'c', 'k','j',], // 6项指标
    currentDataKey: '',
    intervalId: null, // 用于存储定时器ID，以便后续清除
    index: 1, // 当前索引位置
    startX: 0, // 用于记录手势起始点
    isProcessing: false ,// 用于控制是否正在处理
    namearry:{
      'a':'白细胞计数',
      'b':'中性粒细胞计数', 
      'r':'血小板计数',
       'c':'淋巴细胞计数', 
       'k':'血红蛋白计数',
       'j':'红细胞计数',
    }
  },

  // 页面显示时调用
  onShow() {
    this.gethistorydata(this.data.DataKeyAll[0])
    this.switchData(); // 页面显示时开始切换数据
  },

  // 每5秒切换一次数据显示
  switchData() {
    // 设置定时器，每5秒切换一次数据
    const intervalId = setInterval(() => {
      this.changeDataKey(1); // 每次递增切换
    }, 5000);

    // 保存定时器ID，以便后续清除
    this.setData({ intervalId });
  },

  // 改变currentDataKey并调用gethistorydata
  changeDataKey(step) {
    if (this.data.isProcessing) return; // 如果正在处理则直接返回

    // 计算新的索引位置
    let newIndex = (this.data.index + step + this.data.DataKeyAll.length) % this.data.DataKeyAll.length;
    
    // 更新currentDataKey和索引
    this.setData({
      currentDataKey: this.data.DataKeyAll[newIndex],
      index: newIndex
    });

    // 调用gethistorydata方法并传入新的dataKey
    this.gethistorydata(this.data.DataKeyAll[newIndex]);
  },

  // 手势开始触摸
  touchStart(event) {
    this.setData({ startX: event.changedTouches[0].pageX });
  },

  // 手势结束触摸
  touchEnd(event) {
    const endX = event.changedTouches[0].pageX;
    const diffX = endX - this.data.startX;

    if (diffX > 35) {
      this.changeDataKey(-1); // 向右滑动
    } else if (diffX < -50) {
      this.changeDataKey(1); // 向左滑动
    }
  },

  // 页面隐藏或卸载时，清除定时器，防止内存泄漏
  onHide() {
    clearInterval(this.data.intervalId);
  },

  onUnload() {
    clearInterval(this.data.intervalId);
  },

  // 请求数据
  gethistorydata(fieldKey) {
    this.setData({ isProcessing: true }); // 开始处理

    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'spName': 'ACML_GetHistoryData'
      },
      data: {
        UserID: 1,
        FieldKey: fieldKey
      },
      success: (res) => {
        console.log('服务器返回的数据:', res.data.record_set_0);
        console.log('FieldKey: ', fieldKey);

        // 将 record_set_0 作为 history 保存到 data 中
        this.setData({ 
          history: res.data.record_set_0,
          currentDataKey: fieldKey
        }, () => {
          console.log('更新后的 history:', this.data.history);
          console.log('更新后的 currentDataKey:', this.data.currentDataKey);

          this.generateChart(); // 在数据更新后生成图表
        });
      },
      fail: () => {
        console.error('数据获取失败');
        this.setData({ isProcessing: false }); // 请求失败也要重置
      }
    });
  },

  // 生成图表
  generateChart() {
    const { history, currentDataKey } = this.data;
    console.log('进入 generateChart:', history, currentDataKey);

    if (!currentDataKey || !history.length) {
      console.warn('没有历史数据或当前数据键');
      this.setData({ isProcessing: false }); // 没有数据直接完成
      return;
    }

    const times = history.map(item => item.Time);
    const values = history.map(item => item.FieldValue);

    if (values.length === 0) {
      console.warn('没有匹配当前 FieldKey 的数据');
      this.setData({ isProcessing: false }); // 没有匹配的数据直接完成
      return;
    }

    const option = {
      title: { 
        text: `{name|${this.data.namearry[currentDataKey]}}指标情况`, // 使用富文本标签
        textStyle: {
          rich: {
            name: {
              fontWeight: 'bold', // 设置字体加粗
              color: '#0000FF',  // 设置字体颜色
              fontSize: 16        // 设置字体大小
            }
          },
          fontSize: 14 // 设置其他文本的字体大小
        }
      },
      xAxis: { type: 'category', data: times },
      yAxis: { type: 'value' },
      series: [{ name: this.data.currentDataKey, data: values, type: 'line' }]
    };
    
    const chart = new BaseChart(this, 'mychart-dom');
    chart.generateChart(option);

    // 图表生成完成后标记处理结束
    //setTimeout(() => {
      this.setData({ isProcessing: false });
    //}, 1500);
  },

 
  
});
