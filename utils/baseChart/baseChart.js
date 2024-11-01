import * as echarts from '../../ec-canvas/echarts';

export default class BaseChart {
  constructor(component, canvasId) {
    this.component = component;
    this.canvasId = canvasId;
    this.chart = null; // 保存图表实例
  }

  initChart(callback) {
    this.component.selectComponent(`#${this.canvasId}`).init((canvas, width, height, dpr) => {
      this.chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(this.chart);

      // 初始化完成后调用回调
      if (typeof callback === 'function') {
        callback(this.chart);
      }

      return this.chart;
    });
  }

  generateChart(option) {
    // 如果图表尚未初始化，先进行初始化
    if (!this.chart) {
      this.initChart((chart) => {
        chart.setOption(option); // 确保在初始化完成后调用 setOption
      });
    } else {
      this.chart.setOption(option); // 图表已经初始化，直接设置选项
    }
  }
}
