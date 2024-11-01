var utils = require('../../utils/util.js');
var callback;
Component({
  /**
   * 组件的属性列表
   */

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false,
    dialog_height: 300,
    dialog_width: 300,
    cur_year: '',
    cur_month: '',
    today_year: '',
    today_month: '',
    today_day: '',
    currentDate: "",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentMonth: '',
    currentClickKey: '',
    time:[],
    selectedDateId: null, // 新增属性用于存储选中日期的索引
  },

  ready: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.windowWidth = res.windowWidth;
        that.windowHeight = res.windowHeight;
        that.setData({
          dialog_height: 350,
          dialog_width: that.windowWidth ,
        })
      }
    });
    var currentObj = this.getCurrentDayString()
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
      currentDay: currentObj.getDate(),
      today_year: currentObj.getFullYear(),
      today_month: currentObj.getMonth() + 1,
      today_day: currentObj.getDate(),
      currentObj: currentObj
    })
    this.setSchedule(currentObj)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show(callback) {
      this.callback = callback;
      this.setData({
        showDialog: true
      })
    },
    hide() {
      this.setData({
        showDialog: false
      })
    },
    doDay: function (e) {
      var that = this
      var currentObj = that.data.currentObj
      var Y = currentObj.getFullYear();
      var m = currentObj.getMonth() + 1;
      var d = currentObj.getDate();
      var str = ''
      if (e.currentTarget.dataset.key == 'left') {
        m -= 1
        if (m <= 0) {
          str = (Y - 1) + '/' + 12 + '/' + d
        } else {
          str = Y + '/' + m + '/' + d
        }
      } else {
        m += 1
        if (m <= 12) {
          str = Y + '/' + m + '/' + d
        } else {
          str = (Y + 1) + '/' + 1 + '/' + d
        }
      }
      currentObj = new Date(str)
      this.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
        currentObj: currentObj,
      })
      this.setSchedule(currentObj);
    },
    getCurrentDayString: function () {
      var objDate = this.data.currentObj
      if (objDate != '') {
        return objDate
      } else {
        var c_obj = new Date()
        var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
        return new Date(a)
      }
    },
    setSchedule: function (currentObj) {
      var that = this
      var m = currentObj.getMonth() + 1
      var Y = currentObj.getFullYear()
      var d = currentObj.getDate();
      var dayString = Y + '/' + m + '/' + currentObj.getDate()
      var currentDayNum = new Date(Y, m, 0).getDate()
      var currentDayWeek = currentObj.getUTCDay() + 1
      var result = currentDayWeek - (d % 7 - 1);
      var firstKey = result <= 0 ? 7 + result : result;
      var currentDayList = []
      var f = 0
      for (var i = 0; i < 42; i++) {
        let data = []
        if (i < firstKey - 1) {
          currentDayList[i] = ''
        } else {
          if (f < currentDayNum) {
            currentDayList[i] = f + 1
            f = currentDayList[i]
          } else if (f >= currentDayNum) {
            currentDayList[i] = ''
          }
        }
      }
      that.setData({
        currentDayList: currentDayList,
        cur_year: Y,
        cur_month: m,
      })
    },

    // 设置点击事件
    onClickItem: function (e) {
      var that = this;
      if (that.data.currentDayList[e.currentTarget.id] != '') {
        var res = new Object();
        res.what = "date";
        res.data = new Object();
        res.data.date = that.data.cur_year + '-' + that.data.cur_month + '-' + that.data.currentDayList[e.currentTarget.id];
    
        // 更新为选中的日期 ID
        const selectedKey = e.currentTarget.id;
    
        // 取消其他日期的选中效果
        that.setData({
          currentClickKey: selectedKey, // 仅将当前选中日期 ID 设置为 currentClickKey
        });
    
        // 这里可以添加短暂的延迟，以显示选中效果
        setTimeout(() => {
          if (that.callback != undefined) {
            that.hide();
            that.callback(res.data);
          } else {
            this.triggerEvent('doSelect', res);
            that.hide();
          }
        }, 250); // 暂停0.5秒
      }
    }
    
    
    
    
  }
})
