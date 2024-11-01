Page({
  data: {
    todolist_one: "",
    todo: []
  },
  
  bindKeyInput(e) {
    this.setData({
      todolist_one: e.detail.value
    });
  },

  add(e) {
    const todo = this.data.todo;
    const one = { value: '', checked: false };

    if (this.data.todolist_one !== '') {
      one.value = this.data.todolist_one;
      todo.unshift(one);
      this.setData({
        todolist_one: '', // 清空输入框
        todo: todo
      });

      // 网络请求保存到线上数据库
      wx.request({
        url: 'https://your-api-url.com/todo', // 替换为你的API URL
        method: 'POST',
        data: todo,
        success(res) {
          if (res.statusCode === 200) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'none'
            });
          }
        },
        fail() {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      });
    }
  },

  delete(e) {
    const index = e.currentTarget.dataset.index;
    const todo = this.data.todo;
    todo.splice(index, 1);
    this.setData({
      todo: todo
    });

    // 网络请求更新线上数据
    wx.request({
      url: `https://your-api-url.com/todo/${index}`, // 替换为你的API URL
      method: 'DELETE',
      success(res) {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },

  mark(e) {
    const todo = this.data.todo;
    const index = e.detail.value;

    // 清除所有的checked状态
    todo.forEach(item => item.checked = false);

    // 将选中的标记为checked
    index.forEach(i => {
      todo[i].checked = true;
    });

    this.setData({
      todo
    });

    // 网络请求更新线上数据
    wx.request({
      url: 'https://your-api-url.com/todo', // 替换为你的API URL
      method: 'PUT',
      data: todo,
      success(res) {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '更新状态失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },

  onLoad: function (options) {
    // 页面加载时从线上获取待办事项
    wx.request({
      url: 'https://your-api-url.com/todo', // 替换为你的API URL
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            todo: res.data
          });
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },
});