// DEPENDENCY: Import constants
import { MESSAGE_TYPES, CHAT_CONFIG } from './contants';

class ChatManager {
  constructor() {
    this.messages = [];
    this.messageListeners = [];
  }

  // FUNCTIONALITY: Thêm listener cho messages
  addMessageListener(listener) {
    this.messageListeners.push(listener);
  }

  // FUNCTIONALITY: Xóa listener
  removeMessageListener(listener) {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }

  // FUNCTIONALITY: Thông báo cho tất cả listeners
  notifyListeners() {
    this.messageListeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(this.messages);
      }
    });
  }

  // FUNCTIONALITY: Thêm tin nhắn mới
  addMessage(messageData) {
    const newMessage = {
      id: messageData.id || Date.now(),
      text: messageData.text || '',
      user: messageData.user || 'Ẩn danh',
      time: messageData.time || new Date().toLocaleTimeString(),
      type: messageData.type || MESSAGE_TYPES.MESSAGE,
      isOwn: messageData.isOwn || false,
      ...messageData
    };

    this.messages.push(newMessage);

    // PERFORMANCE: Giới hạn số lượng tin nhắn để tối ưu hiệu suất
    if (this.messages.length > CHAT_CONFIG.maxVisibleMessages * 2) {
      this.messages = this.messages.slice(-CHAT_CONFIG.maxVisibleMessages);
    }

    this.notifyListeners();
    return newMessage;
  }

  // FUNCTIONALITY: Thêm tin nhắn từ broadcast message
  addBroadcastMessage(messageList) {
    messageList.forEach(msg => {
      this.addMessage({
        id: msg.messageID,
        text: msg.message,
        user: msg.fromUser.userName,
        time: new Date().toLocaleTimeString(),
        type: MESSAGE_TYPES.MESSAGE,
        isOwn: false
      });
    });
  }

  // FUNCTIONALITY: Thêm tin nhắn hệ thống
  addSystemMessage(text) {
    return this.addMessage({
      text,
      user: 'Hệ thống',
      type: MESSAGE_TYPES.SYSTEM,
      isOwn: false
    });
  }

  // FUNCTIONALITY: Thêm reaction
  addReaction(emoji, userName, isOwn = false) {
    return this.addMessage({
      text: emoji,
      user: userName,
      type: MESSAGE_TYPES.REACTION,
      isOwn
    });
  }

  // FUNCTIONALITY: Thêm tin nhắn của chính mình
  addOwnMessage(text, userName) {
    return this.addMessage({
      text,
      user: userName,
      type: MESSAGE_TYPES.MESSAGE,
      isOwn: true
    });
  }

  // FUNCTIONALITY: Lấy tin nhắn hiển thị (giới hạn số lượng)
  getVisibleMessages() {
    return this.messages.slice(-CHAT_CONFIG.maxVisibleMessages);
  }

  // FUNCTIONALITY: Lấy tất cả tin nhắn
  getAllMessages() {
    return [...this.messages];
  }

  // FUNCTIONALITY: Xóa tất cả tin nhắn
  clearMessages() {
    this.messages = [];
    this.notifyListeners();
  }

  // FUNCTIONALITY: Tìm kiếm tin nhắn
  searchMessages(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    return this.messages.filter(msg => 
      msg.text.toLowerCase().includes(searchTerm) ||
      msg.user.toLowerCase().includes(searchTerm)
    );
  }

  // FUNCTIONALITY: Lấy tin nhắn theo loại
  getMessagesByType(type) {
    return this.messages.filter(msg => msg.type === type);
  }

  // FUNCTIONALITY: Đếm tin nhắn theo user
  getMessageCountByUser(userName) {
    return this.messages.filter(msg => msg.user === userName).length;
  }

  // FUNCTIONALITY: Lấy user hoạt động nhiều nhất
  getMostActiveUsers(limit = 5) {
    const userCounts = {};
    
    this.messages.forEach(msg => {
      if (msg.type === MESSAGE_TYPES.MESSAGE && msg.user !== 'Hệ thống') {
        userCounts[msg.user] = (userCounts[msg.user] || 0) + 1;
      }
    });

    return Object.entries(userCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([user, count]) => ({ user, count }));
  }

  // FUNCTIONALITY: Lọc tin nhắn spam hoặc không phù hợp
  filterInappropriateContent(text) {
    // NOTE: Danh sách từ khóa không phù hợp cơ bản
    const inappropriateWords = ['spam', 'quảng cáo', 'hack', 'cheat'];
    
    const lowerText = text.toLowerCase();
    const hasInappropriate = inappropriateWords.some(word => 
      lowerText.includes(word)
    );

    return !hasInappropriate;
  }

  // FUNCTIONALITY: Validate tin nhắn trước khi thêm
  validateMessage(text, userName) {
    // SECURITY: Kiểm tra độ dài tin nhắn
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Tin nhắn không được để trống' };
    }

    if (text.length > 500) {
      return { valid: false, error: 'Tin nhắn quá dài (tối đa 500 ký tự)' };
    }

    // SECURITY: Kiểm tra nội dung
    if (!this.filterInappropriateContent(text)) {
      return { valid: false, error: 'Tin nhắn chứa nội dung không phù hợp' };
    }

    // SECURITY: Kiểm tra tên user
    if (!userName || userName.trim().length === 0) {
      return { valid: false, error: 'Tên người dùng không hợp lệ' };
    }

    return { valid: true };
  }

  // FUNCTIONALITY: Cleanup old messages
  cleanupOldMessages() {
    const now = Date.now();
    const timeLimit = CHAT_CONFIG.messageTimeout;

    this.messages = this.messages.filter(msg => {
      const messageTime = new Date(msg.time).getTime();
      return (now - messageTime) < timeLimit;
    });

    this.notifyListeners();
  }

  // FUNCTIONALITY: Export messages cho debug hoặc backup
  exportMessages() {
    return {
      messages: this.messages,
      exportTime: new Date().toISOString(),
      totalMessages: this.messages.length
    };
  }

  // FUNCTIONALITY: Import messages từ backup
  importMessages(data) {
    if (data && Array.isArray(data.messages)) {
      this.messages = data.messages;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // FUNCTIONALITY: Reset chat manager
  reset() {
    this.messages = [];
    this.messageListeners = [];
  }
}

// NOTE: Export singleton instance
export default new ChatManager();