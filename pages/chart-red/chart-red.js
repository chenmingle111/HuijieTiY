import BaseChart from '../../utils/baseChart/baseChart';

Page({
  data: {
    yMin: null,
    yMax: null,
    isChartVisible: true,//图像可视
    todolist_one: "",  // 输入框绑定数据
    isModalOpen: false,  // 控制是否弹窗打开
    showModalFlag: false,  // 控制添加任务的弹窗显示
    startX: 0,
    startY: 0,
    currentGroup: 1,
    currentButton: 'j',
    history: [],
    currentDataKey: 'j', // 默认数据键
    userInfo: '',
    displayText: '',
    namearray: {
      'a': '白细胞计数',
      'b': '中性粒细胞计数',
      'c': '淋巴细胞计数',
      'd': '单核细胞计数',
      'e': '嗜酸性粒细胞计数',
      'f': '嗜碱性粒细胞计数',
      'g': '中性粒细胞%',
      'h': '淋巴细胞%',
      'i': '单核细胞%',
      'j': '红细胞计数',
      'k': '血红蛋白',
      'l': '红细胞压积',
      'm': '平均红细胞体积',
      'n': '平均红细胞血红蛋白量',
      'o': '平均红细胞血红蛋白浓度',
      'p': '红细胞分布宽度SD',
      'q': '红细胞分布宽度CV',
      'r': '血小板计数',
      's': '血小板分布宽度',
      't': '平均血小板体积',
      'u': '血小板压积',
      'v': '大型血小板比率'
    },
    isGeneratingChart: false  // 标志是否正在生成图表
  },

  // 页面显示时请求数据
  onShow() {
    const defaultFieldKey = this.data.currentDataKey;
    //this.getImageRange(defaultFieldKey,1);
    this.gethistorydata(defaultFieldKey);
   
  },

 
  // 切换数据显示
  switchData(event) {
    const dataKey = event.currentTarget.dataset.key;
    this.setData({ currentDataKey: dataKey, currentButton: dataKey }, () => {
     // this.getImageRange(dataKey,1);
      this.gethistorydata(dataKey);
      
    });
  },

  // 请求数据
  async gethistorydata(fieldKey) {
    try {
      // 等待 getImageRange 执行完成
      await this.getImageRange(fieldKey, 1);
  
      // 执行其他逻辑，比如发起另一个请求
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
          this.setData({
            history: res.data.record_set_0,
            currentDataKey: fieldKey
          }, () => {
            this.generateChart();
            this.generateText();
          });
        },
        fail: () => {
          console.error('数据获取失败');
        }
      });
    } catch (error) {
      console.error('getImageRange 执行失败', error);
    }
  },
  

  // 生成图表
  generateChart() {
    const { history, currentDataKey } = this.data;
  
    // 如果正在生成图表，直接返回
    /* 实际操作发现不需要
    if (this.data.isGeneratingChart) {
      wx.showToast({
        title: '操作过快',
        icon: 'none', 
      })
      //return;
    }
    */
  
    // 设置标志为正在生成图表
    this.setData({ isGeneratingChart: true });
  
    //console.log('进入 generateChart:', history, currentDataKey);
  
    if (!currentDataKey || !history.length) {
      //console.warn('没有历史数据或当前数据键');
      this.setData({ isGeneratingChart: false });
      return;
    }
  
    const times = history.map(item => item.Time);
    const values = history.map(item => item.FieldValue);
  
    if (values.length === 0) {
      console.warn('没有匹配当前 FieldKey 的数据');
      this.setData({ isGeneratingChart: false });
      return;
    }
    
    // 如果传入了 yMin 和 yMax，添加一个标记区域
    let markArea = null;
   
    if (this.data.yMin !== null && this.data.yMax !== null && this.data.yMin < this.data.yMax) {
      markArea = {
        silent: true, // 标记区域不响应鼠标事件
        data: [
          [{
            name: '健康范围',
            yAxis: this.data.yMin,
          }, {
            yAxis: this.data.yMax,
          }]
        ],
        itemStyle: {
          color: 'rgba(0,255,0,0.3)', // 设置为绿色透明色
        }
      };
      this.setData({
        yMax:null,
        yMax:null
      })
    }
  
    const option = {
      title: {
        text: `{name|${this.data.namearray[currentDataKey]}}指标变化情况`,
        textStyle: {
          rich: {
            name: {
              fontWeight: 'bold',
              color: '#0000FF',
              fontSize: 20
            }
          }
        }
      },
      xAxis: { type: 'category', data: times },
      yAxis: { type: 'value' },
      series: [{
        name: currentDataKey,
        data: values,
        type: 'line',
        markArea: markArea, // 将标记区域添加到系列中
      }]
    };
  
    const chart = new BaseChart(this, 'mychart-dom');
    chart.generateChart(option);
  
    // 图表生成完成后，设置标志为 false
    setTimeout(() => {
      this.setData({ isGeneratingChart: false });
    }, 1000);
  },
  
  

  // 生成文字
  generateText() {
    const { history, currentDataKey } = this.data;

    if (!currentDataKey) {
      //console.warn('当前数据键不存在');
      return;
    }

    console.log('当前数据键:', currentDataKey);

    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'spName': 'ACML_GetHealthText'
      },
      data: {
        UserID: 1,
        IndicatorKey: currentDataKey
      },
      success: (res) => {
        //console.log('Server Response:', res);

        if (res.statusCode === 200) {
          ///console.log('请求成功，返回数据:', res.data.record_set_0);

          if (res.data.record_set_0 && res.data.record_set_0.length > 0) {
            const result = res.data.record_set_0[0];
            const { HealthText, LatestFieldValue, Time } = result;
            this.setData({
              todolist_one:HealthText
            })
            //console.log('提取到的结果:', result);

            const message = `记录时间: ${Time || 'N/A'}\n` +
              `最新值: ${LatestFieldValue || 'N/A'}\n` +
              `建议: ${HealthText || 'N/A'}`;

            this.setData({ displayText: message });
          } else {
           // console.warn('存储过程返回的数据为空或格式不正确');
            wx.showToast({ title: '无法获取数据', icon: 'none' });
          }
        } else {
         // console.warn('请求返回了错误的状态码:', res.statusCode);
          wx.showToast({ title: `错误状态码: ${res.statusCode}`, icon: 'none' });
        }
      },
      fail: (error) => {
        //console.error('Request Failed:', error);
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  },

  // 切换组数据
  change1() {
    this.setData({ currentGroup: 1, currentButton: 'j' });
    this.switchData({ currentTarget: { dataset: { key: 'j' } } });
  },
  change2() {
    this.setData({ currentGroup: 2, currentButton: 'a' });
    this.switchData({ currentTarget: { dataset: { key: 'a' } } });
  },
  change3() {
    this.setData({ currentGroup: 3, currentButton: 'r' });
    this.switchData({ currentTarget: { dataset: { key: 'r' } } });
  },
  change4() {
    this.setData({ currentGroup: 4, currentButton: 'k' });
    this.switchData({ currentTarget: { dataset: { key: 'k' } } });
  },

  
  // 显示添加打卡项弹窗
  showModal() {
    //console.log("弹窗函数");
    if (this.data.isModalOpen) return;  // 如果有弹窗正在打开，禁止操作
    this.setData({
      showModalFlag: true,
      isModalOpen: true, // 标记弹窗已打开
      isChartVisible: false // 隐藏折线图
    });
  },
  
  // 取消添加打卡项
  cancelAdd() {
    this.setData({
      showModalFlag: false,
      todolist_one: "",  // 取消时清空输入框
      isModalOpen: false, // 关闭弹窗
      isChartVisible: true  // 重新显示折线图

    });
    this.gethistorydata( this.data.currentDataKey);
  },
  
  // 确认添加打卡项
  confirmAdd() {
    if (this.data.todolist_one !== '') {
      const newTodo = { UserWork: this.data.todolist_one, checked: false };
      console.log("添加任务请求数据:", {
        UserID: 1,
        UserWork: this.data.todolist_one
      });

      wx.request({
        url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'spName': 'ACML_AddTodo'
        },
        data: {
          UserID: 1, 
          UserWork: this.data.todolist_one
        },
        success: (res) => {
          console.log("添加任务返回数据:", res.data);
          if (res.statusCode === 200) {
            if (res.data.exec_result === "err") {
              wx.showToast({
                title: res.data.exec_error,
                icon: 'none'
              });
            } else {
              wx.showToast({
                title: '添加成功',
                icon: 'success'
              });
              this.setData({ 
                todolist_one: '',
                showModalFlag: false, // 关闭弹窗
                isModalOpen: false, // 设置标志为关闭
                isChartVisible: true  // 重新显示折线图
              });
              this.gethistorydata( this.data.currentDataKey);
            }
          } else {
            wx.showToast({
              title: `添加失败：错误码 ${res.statusCode}`,
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    }
  },
  
  // 输入打卡内容绑定
  bindKeyInput(e) {
    this.setData({

      todolist_one: e.detail.value
    });
  },
  getImageRange(indicatorKey, UserID) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',  // 后端接口URL
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'spName': 'ACML_GetImageRange'  // 存储过程名称
        },
        data: {
          UserID: UserID,
          FieldKey: indicatorKey  // 传递的参数
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log("请求成功");
            
            const { NormalFrom, NormalTo } = res.data.record_set_0[0];
            // 更新 data 值
            this.setData({
              yMin: NormalFrom,
              yMax: NormalTo
            });
            console.log(this.data.yMin, this.data.yMax);
  
            resolve(); // 请求成功时调用 resolve
          } else {
            console.error('请求失败，服务器返回错误');
            reject(new Error('服务器返回错误状态码')); // 非 200 状态码时调用 reject
          }
        },
        fail: (error) => {
          console.error('请求失败，网络错误');
          reject(error); // 网络请求失败时调用 reject
        }
      });
    });
  },
  



  //转跳
    // 页面跳转函数
    navigateToradar() {
      wx.redirectTo({
        url: '/pages/chart-radar/chart-radar', // 目标页面路径
        success: function(res) {
          console.log("成功跳转到目标页面");
        },
        fail: function(error) {
          console.error("跳转失败", error);
        }
      });
    }
  
  
});


