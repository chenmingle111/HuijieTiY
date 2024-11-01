import * as echarts from '../../ec-canvas/echarts';

let chart = null;

Page({
  data: {
    startX: 0,  // 记录触摸开始时的X轴位置
    startY: 0,  // 记录触摸开始时的Y轴位置
    userInfo: '',
    ec: {
      onInit: function (canvas, width, height, dpr) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        canvas.setChart(chart);
        return chart;
      }
    }
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
  
  initRadarChart() {
    const checkChartReady = () => {
      if (chart) {
        this.fetchDataAndSetChart();
      } else {
        setTimeout(checkChartReady, 100); // 等待 chart 初始化
      }
    };
    checkChartReady();
  },
  fetchDataAndSetChart() {
    // 从网络获取历史数据
    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Sp?sp_name=ACML_GetHistoryData&db_name=Sen', //
      method: 'GET',
      success: (res) => {
        if (!res.data || res.data.length === 0) {
          console.error('没有可用的历史数据。');
          return;
        }
  
        const latestData = res.data[res.data.length - 1] || {};
        if (latestData && latestData.time) {
          const latestTime = new Date(latestData.time).toLocaleString();
          this.processChartData(latestData, latestTime);
        } else {
          console.error('最新数据不可用。');
        }
      },
      fail: () => {
        console.error('从网络获取历史数据失败');
        wx.showToast({
          title: '获取历史数据失败',
          icon: 'none',
        });
      }
    });
  },
  
  processChartData(latestData, latestTime) {
    // 从网络获取用户信息
    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Sp?sp_name=ACML_GetHistoryData&db_name=Sen', 
      method: 'GET',
      success: (userRes) => {
        const { age, gender } = userRes.data;
  
        const { zeroValues, maxValues } = this.getValuesBasedOnAgeAndGender(age, gender);
        const values = [
          latestData.a,
          latestData.k,
          latestData.r,
          latestData.b,
          latestData.c,
          latestData.j
        ];
  
        if (values.some(value => value === null || value === undefined)) {
          console.warn('某些图表数据值缺失，正在重定向到 chart-red 页面。');
          wx.reLaunch({
            url: '/pages/chart-red/chart-red',
          });
          return;
        }
  
        console.log('雷达图值:', values);
        setRadarChartOption(values, zeroValues, maxValues, latestTime);
      },
      fail: () => {
        console.error('获取用户信息失败');
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none',
        });
      }
    });
  },

  getValuesBasedOnAgeAndGender(age, gender) {
    let zeroValues, maxValues;
    if (age >= 18) {
      if (gender === '男') {
        zeroValues = [4, 110, 108, 50, 1.5, 4.0];
        maxValues = [10, 160, 273, 70, 3.3, 5.5];
      } else {
        zeroValues = [4, 110, 148, 50, 1.5, 3.5];
        maxValues = [10, 160, 257, 70, 3.3, 5.0];
      }
    } else {
      if (gender === '男') {
        zeroValues = [5, 120, 108, 50, 1.5, 4.0];
        maxValues = [12, 140, 273, 70, 3.3, 5.5];
      } else {
        zeroValues = [5, 120, 148, 50, 1.5, 4.0];
        maxValues = [12, 140, 257, 70, 3.3, 5.5];
      }
    }
    return { zeroValues, maxValues };
  },

  getValuesBasedOnAgeAndGender(age, gender) {
    let zeroValues, maxValues;
    if (age >= 18) {
      if (gender === '男') {
        zeroValues = [4, 110, 108, 50, 1.5, 4.0];
        maxValues = [10, 160, 273, 70, 3.3, 5.5];
      } else {
        zeroValues = [4, 110, 148, 50, 1.5, 3.5];
        maxValues = [10, 160, 257, 70, 3.3, 5.0];
      }
    } else {
      if (gender === '男') {
        zeroValues = [5, 120, 108, 50, 1.5, 4.0];
        maxValues = [12, 140, 273, 70, 3.3, 5.5];
      } else {
        zeroValues = [5, 120, 148, 50, 1.5, 4.0];
        maxValues = [12, 140, 257, 70, 3.3, 5.5];
      }
    }
    return { zeroValues, maxValues };
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
 
});

// 更新设置雷达图的函数
function setRadarChartOption(values, zeroValues, maxValues, latestTime) {
  const maxIndicators = values.map((value, index) => Math.max(value, zeroValues[index], maxValues[index]));

  const option = {
    title: {
      text: `雷达图 - 最后记录时间: ${latestTime}`, // 加入格式化后的时间
      textStyle: {
        fontSize: 14
      }
    },
    //雷达图设置
    legend: {
      data: ['Actual', 'Low', 'High'],
      orient: 'horizontal',
      top: '10%'
    },
    //指标设置
    radar: {
      indicator: [
        { name: '白细胞计数', max: maxIndicators[0] },
        { name: '血红蛋白', max: maxIndicators[1] },
        { name: '血小板计数', max: maxIndicators[2] },
        { name: '中性粒细胞%', max: maxIndicators[3] },
        { name: '淋巴细胞', max: maxIndicators[4] },
        { name: '红细胞计数', max: maxIndicators[5] }
      ],
      center: ['50%', '50%'],
      radius: '65%'
    },
    series: [
      {
        name: 'Actual',
        type: 'radar',
        data: [{ value: values, name: 'Actual' }],
        areaStyle: {
          normal: {
            color: 'rgba(173, 216, 230, 0.5)', // 冰蓝色
          },
        },
      },
      {
        name: 'Low',
        type: 'radar',
        data: [{ value: zeroValues, name: 'Low' }],
        areaStyle: {
          normal: {
            color: 'rgba(255, 0, 0, 0.5)', // 红色
          },
        },
      },
      {
        name: 'High',
        type: 'radar',
        data: [{ value: maxValues, name: 'High' }],
        areaStyle: {
          normal: {
            color: 'rgba(0, 255, 0, 0.5)', // 绿色
          },
        },
      },
    ],
  };

  chart.setOption(option); // 设置图表选项

  // 调整图表大小
  chart.resize();

}
