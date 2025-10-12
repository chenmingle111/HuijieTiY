// user.js
Page({
  data: {
    loggedIn: false,
    canLogin: false,
    userName: '',
    userPhone: '',
    phone: '',
    password: ''
  },

  inputPhone(e) {
    this.setData({
      phone: e.detail.value,
      canLogin: this.data.password.length > 0 && e.detail.value.length > 0
    });
  },

  inputPassword(e) {
    this.setData({
      password: e.detail.value,
      canLogin: this.data.phone.length > 0 && e.detail.value.length > 0
    });
  },

  login() {
    // 登录逻辑，这里假设登录成功
    this.setData({
      loggedIn: true,
      userName: '用户姓名',
      userPhone: this.data.phone,
      phone: '',
      password: ''
    });
  },

  logout() {
    this.setData({
      loggedIn: false,
      userName: '',
      userPhone: '',
      phone: '',
      password: ''
    });
  }
});
