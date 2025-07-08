// FUNCTIONALITY: Các hàm tiện ích cho ứng dụng Live Stream

// FUNCTIONALITY: Tạo ID ngẫu nhiên
export const generateRandomID = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

// FUNCTIONALITY: Tạo user ID duy nhất
export const generateUserID = (prefix = 'user') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}`;
};

// FUNCTIONALITY: Validate tên người dùng
export const validateUserName = (userName) => {
  if (!userName || typeof userName !== 'string') {
    return { valid: false, error: 'Tên người dùng không được để trống' };
  }

  const trimmed = userName.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Tên người dùng phải có ít nhất 2 ký tự' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: 'Tên người dùng không được quá 20 ký tự' };
  }

  // SECURITY: Kiểm tra ký tự đặc biệt
  const specialChars = /[<>\"'&\\/]/;
  if (specialChars.test(trimmed)) {
    return { valid: false, error: 'Tên người dùng chứa ký tự không hợp lệ' };
  }

  return { valid: true, userName: trimmed };
};

// FUNCTIONALITY: Validate room ID
export const validateRoomID = (roomID) => {
  if (!roomID || typeof roomID !== 'string') {
    return { valid: false, error: 'ID phòng không được để trống' };
  }

  const trimmed = roomID.trim();
  
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, error: 'ID phòng phải là 6 chữ số' };
  }

  return { valid: true, roomID: trimmed };
};

// FUNCTIONALITY: Format thời gian hiển thị
export const formatTime = (date = new Date()) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// FUNCTIONALITY: Format số lượng viewer
export const formatViewerCount = (count) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return `${(count / 1000000).toFixed(1)}M`;
  }
};

// FUNCTIONALITY: Debounce function để tối ưu hiệu suất
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// FUNCTIONALITY: Throttle function để giới hạn tần suất gọi hàm
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// FUNCTIONALITY: Kiểm tra định dạng emoji
export const isEmoji = (str) => {
  const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u;
  return emojiRegex.test(str);
};

// FUNCTIONALITY: Làm sạch tin nhắn
export const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // NOTE: Loại bỏ các ký tự đặc biệt nguy hiểm
  return message
    .replace(/[<>\"'&\\/]/g, '')
    .trim()
    .substring(0, 500); // Giới hạn độ dài
};

// FUNCTIONALITY: Tạo màu ngẫu nhiên cho user
export const generateUserColor = (userName) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];
  
  let hash = 0;
  for (let i = 0; i < userName.length; i++) {
    hash = userName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// PERFORMANCE: Tối ưu hóa array operations
export const optimizedSlice = (array, start, end) => {
  if (!Array.isArray(array)) return [];
  
  const actualStart = Math.max(0, start || 0);
  const actualEnd = Math.min(array.length, end || array.length);
  
  return array.slice(actualStart, actualEnd);
};

// FUNCTIONALITY: Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

// FUNCTIONALITY: Kiểm tra kết nối mạng (basic)
export const checkNetworkConnection = () => {
  // NOTE: Đây là implementation cơ bản
  // TODO: Implement proper network checking với NetInfo
  return navigator.onLine !== false;
};

// FUNCTIONALITY: Tạo stream ID
export const generateStreamID = (roomID, userID) => {
  return `stream_${roomID}_${userID}`;
};

// LOGGING: Log với timestamp
export const logWithTimestamp = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  switch (level) {
    case 'error':
      console.error(logMessage);
      break;
    case 'warn':
      console.warn(logMessage);
      break;
    case 'debug':
      console.debug(logMessage);
      break;
    default:
      console.log(logMessage);
  }
};

// FUNCTIONALITY: Retry function với exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      logWithTimestamp(`Retry attempt ${i + 1} after ${delay}ms`, 'warn');
    }
  }
};

// SECURITY: Escape HTML để tránh XSS
export const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// FUNCTIONALITY: Tính toán kích thước file
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

