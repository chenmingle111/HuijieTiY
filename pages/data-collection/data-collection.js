Page({
  data: {
    age: '',
    gender: '',
    groups: [
      {
        label: '特别关注',
        items: [
          { placeholder: '白细胞计数', key: 'inputA' },
          { placeholder: '中性粒细胞', key: 'inputB' },
          { placeholder: '淋巴细胞', key: 'inputC' },
          { placeholder: '红细胞计数', key: 'inputJ' },
          { placeholder: '血小板计数', key: 'inputR' },
          { placeholder: '血红蛋白', key: 'inputK' }
        ],
        showRange: true , // 第一个label下的range默认展开
        labelColor: 'blue' // 默认label颜色
      },
      {
        label: '全血细胞计数（CBC）',
        items: [
          { placeholder: '白细胞计数', key: 'inputA' },
          { placeholder: '中性粒细胞', key: 'inputB' },
          { placeholder: '淋巴细胞', key: 'inputC' },
          { placeholder: '单核细胞', key: 'inputD' },
          { placeholder: '嗜酸性粒细胞', key: 'inputE' },
          { placeholder: '嗜碱性粒细胞', key: 'inputF' },
          { placeholder: '中性粒细胞%', key: 'inputG' },
          { placeholder: '淋巴细胞%', key: 'inputH' },
          { placeholder: '单核细胞%', key: 'inputI' },
          { placeholder: '红细胞计数', key: 'inputJ' },
          { placeholder: '红细胞压积', key: 'inputL' },
          { placeholder: '平均红细胞体积', key: 'inputM' },
          { placeholder: '平均红细胞血红蛋白量', key: 'inputN' },
          { placeholder: '平均红细胞血红蛋白浓度', key: 'inputO' },
          { placeholder: '红细胞分布宽度SD', key: 'inputP' },
          { placeholder: '红细胞分布宽度CV', key: 'inputQ' },
          { placeholder: '血小板计数', key: 'inputR' },
          { placeholder: '血小板分布宽度', key: 'inputS' },
          { placeholder: '平均血小板体积', key: 'inputT' },
          { placeholder: '血小板压积', key: 'inputU' },
          { placeholder: '大型血小板比率', key: 'inputV' },
          { placeholder: '血红蛋白', key: 'inputK' },
        ],
        showRange: false ,
        labelColor: 'green' // 默认label颜色
      },
      {
        label: ' 过敏反应检测',
        items: [
          { placeholder: '中性粒细胞', key: 'inputB' },
          { placeholder: '嗜酸性粒细胞', key: 'inputE' },
          { placeholder: '嗜碱性粒细胞', key: 'inputF' },
          { placeholder: '红细胞分布宽度SD', key: 'inputP' },
          { placeholder: '红细胞分布宽度CV', key: 'inputQ' },

        ],
        showRange: false ,
        labelColor: 'green' // 默认label颜色
      },
      {
        label: '骨髓相关疾病检查',
        items: [
          { placeholder: '白细胞计数', key: 'inputA' },
          { placeholder: '中性粒细胞', key: 'inputB' },
          { placeholder: '红细胞计数', key: 'inputJ' },
          { placeholder: '血红蛋白', key: 'inputK' },
          { placeholder: '血小板计数', key: 'inputR' },
        ],
        showRange: false ,
        labelColor: 'green' // 默认label颜色
      },
      {
        label: '炎症/感染状态',
        items: [
          { placeholder: '白细胞计数', key: 'inputA' },
          { placeholder: '中性粒细胞', key: 'inputB' }, 
          { placeholder: '红细胞分布宽度SD', key: 'inputP' },
          { placeholder: '红细胞分布宽度CV', key: 'inputQ' },
          { placeholder: '血小板计数', key: 'inputR' },
        ],
        showRange: false ,
        labelColor: 'green' // 默认label颜色
      },
      {
        label: '贫血类型的区分',
        items: [
         
          { placeholder: '红细胞计数', key: 'inputJ' },
          { placeholder: '单核细胞%', key: 'inputI' },
          { placeholder: '平均红细胞体积', key: 'inputM' },
          { placeholder: '红细胞分布宽度SD', key: 'inputP' },
          { placeholder: '红细胞分布宽度CV', key: 'inputQ' },
          { placeholder: '血红蛋白', key: 'inputK' },
        ],
        showRange: false ,
        labelColor: 'green' // 默认label颜色
      },
      {
        label: '白细胞计数及相关检查',
        items: [
          { placeholder: '白细胞计数', key: 'inputA' },
          { placeholder: '中性粒细胞', key: 'inputB' },
          { placeholder: '淋巴细胞', key: 'inputC' },
          { placeholder: '单核细胞', key: 'inputD' },
          { placeholder: '嗜酸性粒细胞', key: 'inputE' },
          { placeholder: '嗜碱性粒细胞', key: 'inputF' },
          { placeholder: '中性粒细胞%', key: 'inputG' },
          { placeholder: '淋巴细胞%', key: 'inputH' },
          { placeholder: '单核细胞%', key: 'inputI' }
        ],
        showRange: false  
      },
      {
        label: '红细胞计数及相关检查',
        items: [
          { placeholder: '红细胞计数', key: 'inputJ' },
          { placeholder: '红细胞压积', key: 'inputL' },
          { placeholder: '平均红细胞体积', key: 'inputM' },
          { placeholder: '平均红细胞血红蛋白量', key: 'inputN' },
          { placeholder: '平均红细胞血红蛋白浓度', key: 'inputO' },
          { placeholder: '红细胞分布宽度SD', key: 'inputP' },
          { placeholder: '红细胞分布宽度CV', key: 'inputQ' }
        ],
        showRange: false 
      },
      {
        label: '血小板计数及相关检查',
        items: [
          { placeholder: '血小板计数', key: 'inputR' },
          { placeholder: '血小板分布宽度', key: 'inputS' },
          { placeholder: '平均血小板体积', key: 'inputT' },
          { placeholder: '血小板压积', key: 'inputU' },
          { placeholder: '大型血小板比率', key: 'inputV' }
        ],
        showRange: false 
      },
      {
        label: '血红蛋白计数及相关检查',
        items: [
          { placeholder: '血红蛋白', key: 'inputK' }
        ],
        showRange: false 
      },
    ],
    selectedDate: '',  // 用于显示选择的日期
  },

// 调用日期选择组件
onDateSelected(e) {
  const selectedDate = e.detail.data.date; // 获取选中的日期
  this.setData({
    selectedDate: selectedDate,
  });
  console.log("选中的日期：", selectedDate);
},

onLoad: function () {
  //获取现在时间
 // const currentDate = new Date();
  this.setData({
    selectedDate: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`, // 格式化为 'YYYY-MM-DD'
  });
},

// 获取选择时间
showDatePicker() {
  const calendarComponent = this.selectComponent("#calenda");
  if (calendarComponent) {
    calendarComponent.show((res) => {
      if (res && res.date) {  // 直接检查 res.date
        const selectedDate = new Date(res.date); // 将选择的日期转换为 Date 对象
        const currentDate = new Date(); // 获取当前时间

        // 比较选择的日期是否大于当前时间
        if (selectedDate > currentDate) {
          wx.showToast({
            title: '选择日期不能大于当前时间哦~',
            icon: 'none',
            duration: 2500
          });
        } else {
          this.setData({
            selectedDate: res.date, // 选择的日期
          });
          console.log("选中的日期：", res.date);
        }
      } else {
        console.error("返回的数据不完整：", res);
      }
    });
  } else {
    console.error("未找到 calendar 组件，请检查组件路径和 ID 是否正确");
  }
},



 // 输入监听事件
onInput(event) {
  const key = event.currentTarget.dataset.key;  // 获取当前输入框的key
  const value = event.detail.value;  // 获取输入框的输入值
  this.setData({ [key]: event.detail.value });
  // 获取所有组的数据
  const groups = this.data.groups;

  // 遍历groups，找到所有相同key的项并更新它们的值
  const updatedGroups = groups.map(group => {
    return {
      ...group,
      items: group.items.map(item => {
        if (item.key === key) {
          // 如果key匹配，则更新该输入框的值
          return { ...item, value };
        }
        return item;
      })
    };
  });

  // 更新数据
  this.setData({
    groups: updatedGroups
  });
  
},

 // 点击label切换range显示与隐藏
 onLabelClick(event) {
  const index = event.currentTarget.dataset.index;  // 获取点击的label索引
  const groups = this.data.groups;

  // 切换点击的group的showRange值
  groups[index].showRange = !groups[index].showRange;

  // 更新数据
  this.setData({
    groups: groups
  });
},

  // 性别选择事件
  onGenderToggle() {
    this.setData({
      gender: this.data.gender === '男' ? '女' : '男',
    });
  },


// 保存数据
saveData() {
  let hasData = false;
  const gender = this.data.gender;

  // 验证性别
  if (!gender || (gender !== '男' && gender !== '女')) {
    wx.showToast({ title: '请选择性别', icon: 'none' });
    return;
  }

  // 验证年龄
  const age = this.data.age;
  if (!age || isNaN(age) || age <= 0||age>=120) {
    wx.showToast({ title: '请输入有效的年龄', icon: 'none' });
    return;
  }

  const currentTime = this.data.selectedDate+` ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;

  const inputKeys = [
    'inputA', 'inputB', 'inputC', 'inputD', 'inputE', 'inputF', 'inputG', 'inputH', 'inputI', 'inputJ', 
    'inputK', 'inputL', 'inputM', 'inputN', 'inputO', 'inputP', 'inputQ', 'inputR', 'inputS', 'inputT', 
    'inputU', 'inputV'
  ];

  // 初始化存储键值对的数组
  let fieldString = '';

  // 遍历输入字段，检查是否有值并打包数据为字符串
  inputKeys.forEach((key, index) => {
    const fieldValue = this.data[key];
    if (fieldValue) {
      const fieldKey = String.fromCharCode(97 + index); // 生成 a 至 v 的字段名
      fieldString += `${fieldKey}:${parseFloat(fieldValue)} `; // 拼接键值对
      hasData = true;
    }
  });

  fieldString = fieldString.trim(); // 移除最后一个空格
  console.log('Packed Data String:', fieldString); // 打印打包好的字符串

  if (hasData) {
    // 发送数据到服务器的 POST 请求
    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Xp', // 实际服务器地址
      method: 'POST',
      header: {
        'content-type': 'application/json', // 设置为 JSON 格式
        'spName': 'ACML_SaveData' // 替换为实际存储过程名称
        
      },
      data: {
        Age: age,
        Gender: gender,
        Time: currentTime,
        DataString: fieldString // 以字符串形式上传数据
      },
      success: (res) => {
        console.log('Server Response:', res.data); // 打印完整的响应数据
        if (res.statusCode == 200) {
          if (res.data.exec_result === 'ok') {
            wx.showToast({ title: '数据保存成功', icon: 'success' });
            setTimeout(() => {
              wx.reLaunch({ url: '/pages/chart-radar/chart-radar' });
            }, 1500);
          } else {
            console.log('Error: Server returned failure', res.data); // 打印错误详细信息
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        } else {
          console.log('Error: Status code not 200', res); // 打印错误状态码信息
        }
      },
      
      fail: (error) => {
        console.log('Request Failed:', error); // 打印请求失败的信息
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  } else {
    console.log('No valid data to send'); // 打印没有有效数据的日志
    wx.showToast({ title: '请至少填写一个字段', icon: 'none' });
  }
},

  // 页面展示时加载数据
  onShow() {
    this.checkIfHomePageAndCloseOthers();

    // GET 请求获取历史数据
    wx.request({
      url: 'https://zb-29.zicp.fun/ZbApi-LeLe/Sp?sp_name=ACML_GetHistoryData&db_name=Sen', // 实际服务器地址
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ history: res.data || [] });
        } else {
          wx.showToast({ title: '获取历史数据失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });

    const userID = 1; // 确保 userID 被正确传递
wx.request({
  url: `https://zb-29.zicp.fun/ZbApi-LeLe/Sp?sp_name=ACML_GetUserInfo&user_id=${userID}&db_name=Sen`,
  method: 'GET',
  success: (res) => {
    // 打印整个响应数据，调试时使用
    //console.log('Response Data:', res.data);
    if (res.statusCode === 200 ) {
        //console.log(res.data); 
      const { Age: age, Gender: gender } = res.data.record_set_0[0]; // 获取年龄和性别
      //console.log(`Received age: ${age}, gender: ${gender}`); // 打印 age 和 gender
      this.setData({ age, gender });
    
    } else {
      console.error('record_set 不存在或为空');
      wx.showToast({ title: '获取用户信息失败', icon: 'none' });
    }
  },
  fail: (error) => {
    console.error('请求失败:', error);
    wx.showToast({ title: '网络请求失败', icon: 'none' });
  }
  
});

    
    
    
  },

  // 跳转至其他页面
  goToChart() {
    wx.navigateTo({ url: '/pages/chart-red/chart-red' });
  },

  goTorad() {
    wx.navigateTo({ url: '/pages/chart-radar/chart-radar' });
  },

  // 检查是否为首页并关闭其他页面
  checkIfHomePageAndCloseOthers() {
    const pages = getCurrentPages(); // 获取当前页面栈
    const currentPage = pages[pages.length - 1].route; // 当前页面路径
    const homePage = '/pages/home/home'; // 首页路径

    if (currentPage === homePage) {
      wx.reLaunch({
        url: '/pages/home/home', // 确保跳转到首页
      });
    }
  },


  showCalenda() {
    const calendaComponent = this.selectComponent('#calenda');
    if (calendaComponent) {
      calendaComponent.show((selectedDate) => {
        console.log('选中的日期:', selectedDate);
        // 在这里处理选中的日期
        // 例如：更新状态、显示在页面等
      });
    }
  },

  onDateSelected(event) {
    const selectedDate = event.detail.data.date; // 获取选中的日期
    console.log('通过事件选择的日期:', selectedDate);
    // 处理选中的日期，例如更新页面状态
  }
});
