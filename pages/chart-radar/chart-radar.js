import * as echarts from '../../ec-canvas/echarts';

let chart = null;

Page({
  data: {
    startX: 0,  // 记录触摸开始时的X轴位置
    startY: 0,  // 记录触摸开始时的Y轴位置
    ec: {
      onInit: function (canvas, width, height, dpr) {
        try {
          chart = echarts.init(canvas, 'light', {  // 使用“light”主题
            width: width,
            height: height,
            devicePixelRatio: dpr
          });
          canvas.setChart(chart);
          return chart;
        } catch (err) {
          console.error('ECharts init error:', err);
        }
      }
    },
    namearry:{
      'a':'白细胞计数',
      'b':'中性粒细胞计数', 
      'r':'血小板计数',
       'c':'淋巴细胞计数', 
       'k':'血红蛋白计数',
       'j':'红细胞计数',
    },
  },

  onLoad() {
    // 不直接调用 initRadarChart，而是等待 onShow 中进行
  },

  onShow() {
    this.initRadarChart(); // 仅在显示时初始化图表
  },
  onUnload() {
   chart=null;
  },
  // 更新设置雷达图的函数
 fetchDataAndSetChart() {
  wx.request({
    url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'spName': 'ACML_GetRadar'
    },
    data: { UserID: 1 },
    success: (res) => {
      if (!res.data || !Array.isArray(res.data.record_set_0)) {
        console.error('Data format is incorrect');
        wx.showToast({
          title: '数据格式不正确',
          icon: 'none'
        });
        return;
      }

      const latestRecords = this.processRecords(res.data.record_set_0);
      const latestTime = latestRecords.latestTime;
      console.log('tim',latestTime)
      const age = latestRecords.age;
      const gender = latestRecords.gender;
      
      if (Object.keys(latestRecords.values).length === 0) {
        console.error('Missing or incomplete data');
        wx.showToast({
          title: '数据不完整',
          icon: 'none'
        });
        return;
      }
      
      this.processChartData(latestRecords, latestTime, age, gender);
    },
    fail: (err) => {
      console.error('Request failed:', err);
      wx.showToast({
        title: '数据请求失败',
        icon: 'none'
      });
    }
  });
},

setRadarChartOption(values, zeroValues, maxValues, latestTime) {
  console.log('雷达图数据为:', { values, zeroValues, maxValues });
  const maxIndicators = values.map((value, index) => Math.max(value, zeroValues[index], maxValues[index]));
  console.log('time', latestTime);

  const option = {
    title: {
      text: `雷达图 - 最后记录时间: ${latestTime}`,
      textStyle: {
        fontSize: 14
      },
      top: '8%', // 调整标题的位置，使整体下移并增大与图例的间距
    },
    legend: {
      data: ['你的记录', '健康标准下的最低值', '健康标准下的最高数值'],
      orient: 'vertical', // 设置为竖直排列
      left: 'center', // 水平居中
      top: '15%', // 调整图例的位置，使其整体下移，并增大与雷达图的间距
      itemGap: 20 // 图例项目之间的间隔，增加区分度
    },
    radar: {
      indicator: [
        { name: '白细胞计数', max: maxIndicators[0] },
        { name: '中性粒细胞', max: maxIndicators[1] },
        { name: '淋巴细胞', max: maxIndicators[2] },
        { name: '红细胞计数', max: maxIndicators[3] },
        { name: '血红蛋白', max: maxIndicators[4] },
        { name: '血小板计数', max: maxIndicators[5] }
      ],
      center: ['50%', '63%'], // 调整雷达图的垂直位置，确保与图例保持距离
      radius: '50%' // 仍可根据需要调整
    },
    series: [
      {
        name: '你的记录',
        type: 'radar',
        data: [{ value: values, name: '你的记录' }],
        areaStyle: {
          normal: {
            color: 'rgba(0, 102, 204, 0.7)', // 增加区分度，稍微减少透明度
          },
        },
      },
      {
        name: '健康标准下的最低值',
        type: 'radar',
        data: [{ value: zeroValues, name: '健康标准下的最低值' }],
        areaStyle: {
          normal: {
            color: 'rgba(173, 216, 230, 0.7)', // 增加区分度，稍微减少透明度
          },
        },
      },
      {
        name: '健康标准下的最高数值',
        type: 'radar',
        data: [{ value: maxValues, name: '健康标准下的最高数值' }],
        areaStyle: {
          normal: {
            color: 'rgba(0, 153, 255, 0.7)', // 增加区分度，稍微减少透明度
          },
        },
      },
    ],
  };

  console.log('图表选项:', option); // 查看 option 内容
  chart.setOption(option);
  chart.resize();
},




processRecords(records) {
  const values = {};
  let latestTime;
  let age = 18;
  let gender = '未知';
  
  records.forEach(record => {
    if (record.LatestTime && record.FieldKey && record.FieldValue !== undefined && record.Gender && record.Age) {
      const key = record.FieldKey.trim().toLowerCase(); // 清除空格，并转为小写保持一致性
      const value = record.FieldValue;
      //这里有盖亚，不要理他
      latestTime=record.LatestTime;
      age = record.Age; // 假设所有记录的年龄相同
      gender = record.Gender; // 假设所有记录的性别相同

      // 只处理雷达图需要的key
      if (['a', 'b', 'c', 'j', 'k', 'r'].includes(key)) {
        values[key] = value;
      }
    }
  });

  return { latestTime, age, gender, values };
},
initRadarChart() {
  const checkChartReady = () => {
    if (chart) {
      this.fetchDataAndSetChart();
    } else {
      setTimeout(checkChartReady, 50); // 等待 chart 初始化
    }
  };
  checkChartReady();
},

processChartData(latestRecords, latestTime, age, gender) {
  const chartKeys = ['a', 'b', 'c', 'j', 'k', 'r'];  // 对应于雷达图的轴
  const values = chartKeys.map(key => latestRecords.values[key] || 0);
  let zeroValues, maxValues;

  // 定义健康范围
  if (age >= 18) {
    zeroValues = (gender === '男') ? [4, 110, 108, 1.8, 1.5, 4.0] : [4, 110, 148, 1.9, 1.5, 4.0];
    maxValues = (gender === '男') ? [10, 160, 273, 8.3, 3.3, 5.5] : [10, 160, 257, 7.9, 3.3, 5.5];
  } else {
    zeroValues = (gender === '男') ? [5, 120, 108, 1.8, 1.5, 4.0] : [5, 120, 148, 1.9, 1.5, 4.0];
    maxValues = (gender === '男') ? [12, 140, 273, 8.3, 3.3, 5.5] : [12, 140, 257, 7.9, 3.3, 5.5];
  }

  // 检查每个指标是否超过了正常范围
  const issues = values.map((value, index) => {
    if (value < zeroValues[index]) {
      return `${this.data.namearry[chartKeys[index]]}（${value}）低于正常范围（${zeroValues[index]}）`;
    } else if (value > maxValues[index]) {
      return ` ${this.data.namearry[chartKeys[index]]}（${value}）高于正常范围（${maxValues[index]}）`;
    }
    return null; // 正常值不返回任何信息
  }).filter(issue => issue !== null); // 过滤掉正常值

  // 更新健康状态信息
  let healthStatus;
  if (issues.length > 0) {
    healthStatus = '注意:\n' + issues.join('\n');
  } else {
    healthStatus = '你的身体看起来很健康，请继续保持！';
  } 
  
  // 使用 setData 更新页面数据
  this.setData({
    healthStatus
  });

  this.setRadarChartOption(values, zeroValues, maxValues, latestTime); // 设置雷达图
},
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
      if (diffY < -30) {
        // 如果 Y 轴滑动距离大于 30，表示上滑
        this.nextPage();
      }
    }
  },

  // 跳转到下一个页面（上滑时调用）
  nextPage() {
    wx.navigateTo({
      url: '/pages/chart-red/chart-red'  // 正确的页面路径
    });
  },

  // 手势结束时的处理函数（可以不做处理）
  handleTouchEnd(e) {
    // 手势结束逻辑（如果有需要）
  },
 changered(){
  wx.redirectTo({
    url: '/pages/chart-red/chart-red'  // 正确的页面路径
  });
 }
});

