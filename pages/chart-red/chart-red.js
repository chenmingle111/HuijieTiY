import BaseChart from '../../utils/baseChart/baseChart';

Page({
  data: {
    startX: 0,  
    startY: 0,  
    currentGroup: 1,
    currentButton: 'j',
    history: [],
    currentDataKey: 'j',  // 默认数据键
    userInfo: '',
    displayText: ''
  },

  // 页面显示时请求数据
  onShow() {
    // 获取默认或上次显示的FieldKey
    const defaultFieldKey = this.data.currentDataKey ; // 设置一个默认的FieldKey
    this.gethistorydata(defaultFieldKey);  // 调用函数时传递参数
    
  },

  // 切换数据显示
  switchData(event) {
    const dataKey = event.currentTarget.dataset.key;
    this.setData({ currentDataKey: dataKey, currentButton: dataKey }, () => {
      // 每次切换数据时，重新请求服务器获取对应的历史数据
      this.gethistorydata(dataKey);  // 调用函数时传递参数
     
    });
  },

// 请求数据
gethistorydata(fieldKey) {
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
        history: res.data.record_set_0,  // 只提取 record_set_0 部分
        currentDataKey: fieldKey  // 同时保存当前数据键
      }, () => {
        // 数据更新后再打印日志和生成图表
        console.log('更新后的 history:', this.data.history);
        console.log('更新后的 currentDataKey:', this.data.currentDataKey);

        this.generateChart();  // 在数据更新后生成图表
        this.generateText();    // 同样处理文本
      });
    },
    fail: () => {
      console.error('数据获取失败');
    }
  });
},

// 生成图表
generateChart() {
  const { history, currentDataKey } = this.data;
  console.log('进入 generateChart:', history, currentDataKey);

  // 如果没有历史数据或当前数据键，返回空
  if (!currentDataKey || !history.length) {
    console.warn('没有历史数据或当前数据键');
    //return;
  }

  // 分别提取时间和与 currentDataKey 匹配的值
  const times = history.map(item => item.Time);  // 提取 time 字段
  const values = history.map(item => item.FieldValue);  // 提取对应的 FieldValue

  // 如果没有匹配的值，则返回空
  if (values.length === 0) {
    console.warn('没有匹配当前 FieldKey 的数据');
   // return;
  }

  const option = {
    title: { text: `Line Chart of ${currentDataKey.toUpperCase()}` },
    xAxis: { type: 'category', data: times },  // 设置 x 轴为时间数组
    yAxis: { type: 'value' },
    series: [{ name: currentDataKey, data: values, type: 'line' }]  // y 轴数据为值数组
  };

  const chart = new BaseChart(this, 'mychart-dom');
  chart.generateChart(option);
},
generateText() {
  const { history, currentDataKey } = this.data;

  // 确认当前数据键是否存在
  if (!currentDataKey) {
    console.warn('当前数据键不存在');
    return;
  }

  console.log('当前数据键:', currentDataKey);

  // 调用存储过程获取健康文本
  wx.request({
    url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',  // 替换为你的API地址
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'spName': 'ACML_GetHealthText'  // 指定存储过程名称
    },
    data: {
      UserID: 1,  // 假设前端传递的用户ID为1，替换为实际用户ID
      IndicatorKey: currentDataKey  // 当前的指标字段（如 'j', 'l' 等）
    },
    success: (res) => {
      // 打印完整的服务器响应
      console.log('Server Response:', res);

      // 检查响应状态码和数据内容
      if (res.statusCode === 200) {
        console.log('请求成功，返回数据:', res.data.record_set_0);

        if (res.data.record_set_0 && res.data.record_set_0.length > 0) {
          const result = res.data.record_set_0[0];  // 假设存储过程返回的结果在 data 数组中
          const { HealthText, LatestFieldValue, Time } = result;

          // 打印提取到的结果
          console.log('提取到的结果:', result);

          // 构建提示信息
          const message = `记录时间: ${Time || 'N/A'}\n` +
            `最新值: ${LatestFieldValue || 'N/A'}\n` +
            `建议: ${HealthText || 'N/A'}`;

          // 更新界面显示
          this.setData({ displayText: message });
        } else {
          console.warn('存储过程返回的数据为空或格式不正确');
          wx.showToast({ title: '无法获取数据', icon: 'none' });
        }
      } else {
        console.warn('请求返回了错误的状态码:', res.statusCode);
        wx.showToast({ title: `错误状态码: ${res.statusCode}`, icon: 'none' });
      }
    },
    fail: (error) => {
      // 打印请求失败的错误信息
      console.error('Request Failed:', error);
      wx.showToast({ title: '请求失败', icon: 'none' });
    }
  });
},









  change1() {this.setData({ currentGroup: 1, currentButton: 'j' }); this.switchData({ currentTarget: { dataset: { key: 'j' } } });},
  change2() {this.setData({ currentGroup: 2, currentButton: 'a' }); this.switchData({ currentTarget: { dataset: { key: 'a' } } });},
  change3() {this.setData({ currentGroup: 3, currentButton: 'r' }); this.switchData({ currentTarget: { dataset: { key: 'r' } } });},
  change4() {this.setData({ currentGroup: 4, currentButton: 'k' }); this.switchData({ currentTarget: { dataset: { key: 'k' } } });},

    // 记录手势开始的位置
    handleTouchStart(e) {
      this.setData({
        startX: e.touches[0].clientX,  // 记录触摸点的 X 轴坐标
        startY: e.touches[0].clientY   // 记录触摸点的 Y 轴坐标
      });
    },
    // 检测手势方向
    handleTouchMove(e) {
      const endX = e.touches[0].clientX;  // 滑动过程中触摸点的 X 坐标
      const endY = e.touches[0].clientY;  // 滑动过程中触摸点的 Y 坐标
  
      const diffX = endX - this.data.startX;  // X 轴滑动的距离
      const diffY = endY - this.data.startY;  // Y 轴滑动的距离
  
      // 如果 Y 轴的滑动距离大于 X 轴，说明是上下滑动
      if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 30) {
          // 如果 Y 轴滑动距离大于 30，表示上滑
          this.prevPage();
        }
      }
    },
    // 跳转到下一个页面（下滑时调用）
    prevPage() {
      wx.navigateBack({
        delta: 1  // 返回上一级页面
      });
    },
    // 手势结束时的处理函数（可以不做处理）
    handleTouchEnd(e) {
      // 手势结束逻辑（如果有需要）
    },
  });
  