Component({
  properties: {},
  data: {
    showDialog: true,
    dialog_height: 615,
    dialog_width: 700,
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
    selectedDateId: null, // 新增属性用于存储选中日期的索引
    HistoryList: [], // 打卡记录日
    ifnew: false,//是否重新定位日历时间
    total_day: '',//累计打卡天数
    continue_day: '',//持续打卡天数
  },
  ready: function () {
    var that = this;
    this.initializePageData(that,null);  // 初始化页面数据，传入当前日期
  },

  methods: {
    triggerEventToPage: function(time1) {
      // 触发自定义事件 callPageFunction
      this.triggerEvent('callPageFunction',{time:time1});
    },
    // 切换时间
    doDay: function (e) {
      
      var that = this;
      var currentObj = that.data.currentObj;
    
      // 检查 currentObj 是否有效
      if (!(currentObj instanceof Date) || isNaN(currentObj)) {
        console.log("currentObj 不是有效的日期对象:", currentObj);
        return;
      }

      console.log("当前日期对象 currentObj:", currentObj);
    
      var Y = currentObj.getFullYear();
      var m = currentObj.getMonth() + 1; // 获取当前月份（1-12）
      var d = currentObj.getDate(); // 获取当前日期
      var str = '';
    
      // 获取点击的方向（left 或 right）
      var direction = e.currentTarget.dataset.key;
      console.log("点击的方向:", direction);
    
      if (direction == 'left') {
        m -= 1;
        if (m <= 0) {
          str = (Y - 1) + '/' + 12 + '/' + d; // 如果是左箭头，回到上一年12月
        } else {
          str = Y + '/' + m + '/' + d;
        }
      } else {
        m += 1;
        if (m <= 12) {
          str = Y + '/' + m + '/' + d;
        } else {
          str = (Y + 1) + '/' + 1 + '/' + d; // 如果是右箭头，回到下一年1月
        }
      }
    
      // 转换为新的日期对象
      currentObj = new Date(str);
      console.log("转换后的日期对象 currentObj:", currentObj);
      // 更新页面数据
      this.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
        currentObj: currentObj,
      });
    
     // 获取 formattedDate (yyyy-mm-dd 格式)
     var yyyy = currentObj.getFullYear(); // 获取四位年份
     var mm = ('0' + (currentObj.getMonth() + 1)).slice(-2); // 获取月份并确保两位数
     var dd = ('0' + currentObj.getDate()).slice(-2); // 获取日期并确保两位数
    
     var formattedDate = yyyy + '-' + mm + '-' + dd; // 拼接成 yyyy-mm-dd 格式
     console.log("格式化后的日期:", formattedDate);
    //that.getTdHistory( formattedDate); // 确保这里使用更新后的日期
    that.triggerEventToPage(formattedDate);
    
    
      // 生成图表（根据新的日期）
      this.setSchedule(currentObj); 
    },

    // 封装的初始化方法
    initializePageData: function (that, inputDate) {
      // 获取系统信息
      
    
      // 如果没有传入日期，则默认使用今天的日期
      var currentObj = inputDate || new Date();  // 如果没有传入 inputDate，则使用当前日期
    
      // 获取今天的日期
      var today = new Date();
    
      // 设置数据
      that.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
        currentDay: currentObj.getDate(),
        today_year: today.getFullYear(),
        today_month: today.getMonth() + 1,
        today_day: today.getDate(),
        currentObj: currentObj,
      });
    
      console.log("初始化页面数据，当前日期:", currentObj);
    
      // 调用设置日程的函数
      that.setSchedule(currentObj);
    },
    


    // 更新组件中的 HistoryList 数据并重新加载日程
    updateHistoryList: function (workDays) {
      this.setData({
        HistoryList: workDays.map(item => item.WorkDay)
      }, () => {
        // 在更新 HistoryList 后，回调执行 setSchedule
        console.log('组件中历史打卡日期:', this.data.HistoryList);

        // 在这里确保 HistoryList 已经更新
       // this.setSchedule(this.data.currentObj); // 重新加载日程
       
        var that = this;
        if(that.data.ifnew){
          this.initializePageData(that,); 
        }else{
          this.initializePageData(that,that.data.currentObj); 
        }
        
        //this.setSchedule(that.data.currentObj);
      });
    },
     // 遍历生成日
     setSchedule: function (currentObj) {
      var that = this;
      var m = currentObj.getMonth() + 1;
      var Y = currentObj.getFullYear();
      var d = currentObj.getDate();
      var dayString = Y + '/' + m + '/' + currentObj.getDate();
      var currentDayNum = new Date(Y, m, 0).getDate();
      var currentDayWeek = currentObj.getUTCDay() + 1;
      var result = currentDayWeek - (d % 7 - 1);
      var firstKey = result <= 0 ? 7 + result : result;
      var currentDayList = [];
      var f = 0;
      for (var i = 0; i < 42; i++) {
        let data = [];
        currentDayList[i] = new Object;

        if (i < firstKey - 1) {
          currentDayList[i].day = '';
        } else {
          if (f < currentDayNum) {
            currentDayList[i].day = f + 1;
            f = currentDayList[i].day;
          } else if (f >= currentDayNum) {
            currentDayList[i].day = '';
          }
        }
        // 判断标记打卡日
        //console.log("真正的arry", this.data.HistoryList);
        if (this.data.HistoryList.includes(currentDayList[i].day)) {
          //if (1==1) {
          currentDayList[i].isHistory = true;
        }
      }
      that.setData({
        currentDayList: currentDayList,
        cur_year: Y,
        cur_month: m,
      });
    },
 
    // 获取今天时间
    getCurrentDayString: function () {
      var objDate = this.data.currentObj;
      if (objDate != '') {
        return objDate;
      } else {
        var c_obj = new Date();
        var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate();
        return new Date(a);
      }
    },
   
     // 设置点击事件补打卡 (待处理)
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
    },
  },

   
});
