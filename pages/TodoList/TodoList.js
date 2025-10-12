Page({
  data: {
    todolist_one: "",  // 输入框绑定数据
    todo: [],  // 任务列表
    showModalFlag: false,  // 控制添加任务的弹窗显示
    showDeleteModalFlag: false, // 控制删除确认弹窗显示
    deleteTask: null,  // 当前长按的任务
    isModalOpen: false,  // 控制是否弹窗打开
    selectedDate: '',  // 用于显示选择的日期
    HistoryList: [],
    work:'',
    total_day:'',
    continue_day:'',
  },

// 页面中的事件监听函数
onCallPageFunction: function(res) {
  this.getTdHistory(null,res.detail.time,true); // 调用页面中的函数
},
    
// 处理选中日期
onDateSelected(e) {
  const selectedDate = e.detail.data.date; // 获取选中的日期
  this.setData({
    selectedDate: selectedDate,
  });
  console.log("选中的日期：", selectedDate);
},
onLoad: function () {
},
//获取选择时间
showDatePicker() {
  const calendarComponent = this.selectComponent("#calenda");
  if (calendarComponent) {
    calendarComponent.show((res) => {
      if (res && res.date) {  // 直接检查 res.date
        this.setData({
          selectedDate: res.date, // 选择的日期
        });
        console.log("选中的日期：", res.date);
      } else {
        console.error("返回的数据不完整：", res);
      }
    });
  } else {
    console.error("未找到 calendar 组件，请检查组件路径和 ID 是否正确");
  }
},


// 页面方法：获取打卡历史
// 调用后端接口获取打卡历史并更新 HistoryList
getTdHistory: function (e, time1, fromCalenda = false) {
  const that = this;
  
  // 如果没有传入 time1，则自动使用今天的日期
  if (!time1) {
    const today = new Date();
    time1 = today.toISOString().split('T')[0];  // 获取格式为 "YYYY-MM-DD" 的日期字符串
    console.log("未检测到time", time1);
  }

  if (e) {
    that.setData({
      work: e.currentTarget.dataset.setwork
    });
  }
  
  console.log("这次的work", that.data.work);
  console.log("这次的time", time1);

  wx.request({
    url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',  // 替换成实际的接口地址
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'spName': 'ACML_GetTdHistory'
    },
    data: {
      userid: 1,
      userwork: that.data.work,
      time: time1,
    },
    success: function (res) {
      console.log("获得数据:", res);

      if (res.data.record_set_0) {
        // 获取到历史打卡日期
        const workDays = res.data.record_set_0;
        
        // 获取组件实例并更新组件中的 HistoryList
        const calendaComponent = that.selectComponent('#calenda');
        if (calendaComponent) {
          calendaComponent.updateHistoryList(workDays);  // 更新组件中的 HistoryList
          // 根据数据来源更新 ifnew 值
          calendaComponent.setData({
            ifnew: !fromCalenda // 如果数据来自 calenda，设置 ifnew 为 false，否则为 true
          });
        }
        that.getMathList();
        that.show();

      } else {
        // 更新页面数据
        that.setData({
          HistoryList: []
        });

        // 获取组件实例并更新组件中的 HistoryList
        const calendaComponent = that.selectComponent('#calenda');
        if (calendaComponent) {
          calendaComponent.updateHistoryList([]);  // 更新组件中的 HistoryList
          // 更新 ifnew 值
          calendaComponent.setData({
            ifnew: !fromCalenda
          });
        }
        
        console.log('数据为空');
      }
   
    },
    fail: function (err) {
      console.error('请求失败:', err);
    }
  });
},
getMathList: function () {
  const that = this;
  
  // 发送请求到后端，调用存储过程
  wx.request({
    url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',  // 替换为实际的接口地址
    method: 'POST',
     header: {
              'content-type': 'application/json',        
                'spName': 'ACML_getMathList'         
            },
    data: {
      userid: 1,
      userwork: that.data.work,
    },
    
    success: function (res) {
      if (res.statusCode === 200 && res.data) {
        // 假设返回的结果结构是这样的：
        // { accumulated_days: number, continuous_days: number }
        console.log("1111111111111111111111");
        console.log(res);
       // const { accumulated_days, continuous_days } = res.data.record_set_0[0];
        that.setData({
          total_day:res.data.record_set_0[0].accumulated_days,
          continue_day: res.data.record_set_0[0].continuous_days
        });
      } else {
        // 处理异常或空数据
        console.error('获取数据失败:', res);
      }
    },
    fail: function (err) {
      console.error('请求失败:', err);
    }
  });
},



onLoad: function() {
  // 这里可以传入参数调用函数
  //this.getTdHistory(e);
},

  // 显示添加打卡项弹窗
  showModal() {
    if (this.data.isModalOpen) return;  // 如果有弹窗正在打开，禁止操作
    this.setData({
      showModalFlag: true,
      isModalOpen: true // 标记弹窗已打开
    });
  },
  
  // 取消添加打卡项
  cancelAdd() {
    this.setData({
      showModalFlag: false,
      todolist_one: "",  // 取消时清空输入框
      isModalOpen: false // 关闭弹窗
    });
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
                isModalOpen: false // 设置标志为关闭
              });
              this.show(); // 刷新任务列表
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
  
  // 显示删除打卡项弹窗
  showDeleteModal(e) {
    const userWork = e.currentTarget.dataset.userwork;
        console.log("长按触发的任务:", userWork);
    if (this.data.isModalOpen) return;  // 如果有弹窗正在打开，禁止操作
    this.setData({
      showDeleteModalFlag: true,
      deleteTask: userWork,  // 存储当前需要删除的任务
      isModalOpen: true // 设置标志为弹窗打开
    });
  },
  
  
  // 取消删除打卡项
  cancelDelete() {
    this.setData({
      showDeleteModalFlag: false,
      deleteTask: null,
      isModalOpen: false // 关闭弹窗
    });
    this.show()
  },
  
  // 确认删除打卡项
  confirmDelete() {
    const task = this.data.deleteTask;
    console.log("删除任务请求数据:", {
      UserID: 1,
      UserWork: task
    });

    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'spName': 'ACML_DelTodo'
      },
      data: { 
        UserID: 1, 
        UserWork: task
      },
      success: (res) => {
        console.log("删除任务返回数据:", res.data);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          this.show(); // 刷新任务列表
        } else {
          wx.showToast({
            title: `删除失败：错误码 ${res.statusCode}`,
            icon: 'none'
          });
        }
        this.setData({
          showDeleteModalFlag: false,  // 关闭删除确认弹窗
          deleteTask: null, // 清空当前删除任务
          isModalOpen: false // 设置标志为关闭
        });
      },
      fail: () => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  // 打卡/取消打卡记录
  addlist(e) {
    const userWork = e.currentTarget.dataset.userwork;
    const currentChecked = e.currentTarget.dataset.checked;

    console.log("打卡/取消打卡请求数据:", {
      UserID: 1,
      UserWork: userWork,
      spName: currentChecked ? 'ACML_DelTodoList' : 'ACML_AddTodoList'
    });

    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'spName': currentChecked ? 'ACML_DelTodoList' : 'ACML_AddTodoList'
      },
      data: {
        UserID: 1,
        UserWork: userWork
      },
      success: (res) => {
        console.log("打卡/取消打卡返回数据:", res.data);
        if (res.statusCode === 200) {
          if (res.data.exec_result === "err") {
            wx.showToast({
              title: res.data.exec_error,
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: currentChecked ? '取消打卡成功' : '打卡成功',
              icon: 'success'
            });

            const updatedTodo = this.data.todo.map(item => {
              if (item.value === userWork) {
                item.checked = !currentChecked;
              }
              return item;
            });
            this.setData({
              todo: updatedTodo
            });
            this.show();
            
            this.getTdHistory(e);
            //this.getMathList();
          }
        } else {
          wx.showToast({
            title: `请求失败：错误码 ${res.statusCode}`,
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
  },

  // 页面加载时
  onShow() {
    this.show();
    wx.showToast({
      title: '长按可删除任务',
      icon: 'none', 
    })
  },

  // 刷新列表
  show() {
    console.log("刷新任务列表请求数据:", {
      UserID: 1
    });

    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'spName': 'ACML_GetTodoList'
      },
      data: { UserID: 1 },
      success: (res) => {
        console.log("刷新任务列表返回数据:", res.data);
        if (res.statusCode === 200) {
          this.setData({
            todo: res.data.record_set_0.map(item => ({
              value: item.UserWork,
              checked: item.CheckedToday
            }))
          });
        } else {
          wx.showToast({
            title: `加载失败：错误码 ${res.statusCode}`,
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
  },

 
});
