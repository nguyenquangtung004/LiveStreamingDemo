//IMPORTANT: Cấu hình thông tin ứng dụng Zego
export const ZEGO_CONFIG = {
  GET_LICENSE_CGI: 'https://aieffects-api.zego.im?Action=DescribeEffectsLicense',
  appID: 1359832122,
  appSign: '5b11b51bd04571706a6ce9d42a7758de13dee90cb6959b09dc46076d1c068c30',
};
// CONFIG: Cấu hình beauty effects mặc định
export const BEAUTY_CONFIG = {
  defaultSmoothIntensity: 70,
  defaultWhiteningIntensity: 60,
  defaultFaceLiftingIntensity: 50,
  defaultBeautyIntensity: 80,
};

// FUNCTIONALITY: Các loại tin nhắn trong chat
export const MESSAGE_TYPES = {
  MESSAGE: 'message',
  SYSTEM: 'system',
  REACTION: 'reaction'
};

// UI/UX: Các màn hình trong ứng dụng
export const SCREENS = {
  HOME: 'home',
  BROADCASTER: 'broadcaster',
  VIEWER: 'viewer'
};

// FEATURE: Danh sách emoji reactions
export const QUICK_REACTIONS = ['❤️', '👏', '🔥', '😍', '🥰', '👍', '🎉', '💯'];

// PERFORMANCE: Cấu hình hiển thị chat
export const CHAT_CONFIG = {
  maxVisibleMessages: 10,
  messageTimeout: 300000 // 5 phút
};