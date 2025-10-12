// pages/aichat/aichat.js
const apiUrl = 'http://47.92.90.228:3009/api/chat';

Page({
  data: {
    messages: [], // 消息列表
    inputValue: '', // 输入框内容
    isSending: false // 是否正在发送
  },

  // 发送消息
  sendMessage() {
    if (!this.data.inputValue.trim() || this.data.isSending) return;

    const userMessage = this.data.inputValue;
    const newMessage = {
      content: userMessage,
      isUser: true
    };

    this.setData({
      messages: [...this.data.messages, newMessage],
      inputValue: '',
      isSending: true
    });

    const requestData = {
      model: "lite",
      user: "unique_user_id",
      messages: [
        {
          role: "system",
          content: "你仅负责解答有关健康方面的问题"
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.5,
      top_k: 4,
      stream: false,
      max_tokens: 1024,
      presence_penalty: 1,
      frequency_penalty: 1
    };

    wx.request({
      url: apiUrl,
      method: 'POST',
      data: requestData,
      header: {
        'Authorization': 'Bearer gOLsBVKCNPoLeDdnJtfo:quCaqUMNpyuGplhzAyqG',
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.code === 0) {
          const aiMessage = res.data.choices[0].message.content || 'AI response not available.';
          this.setData({
            messages: [...this.data.messages, {
              content: aiMessage,
              isUser: false
            }]
          });
        } else {
          this.setData({
            messages: [...this.data.messages, {
              content: `Error: ${res.data.message}`,
              isUser: false
            }]
          });
        }
      },
      fail: (err) => {
        this.setData({
          messages: [...this.data.messages, {
            content: `Error: ${err.errMsg}`,
            isUser: false
          }]
        });
      },
      complete: () => {
        this.setData({
          isSending: false
        });
      }
    });
  },

  // 输入框内容改变
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

});
