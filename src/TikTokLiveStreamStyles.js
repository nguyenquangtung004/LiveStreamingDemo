import { StyleSheet, Dimensions, Platform } from 'react-native';

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

// Định nghĩa và export Colors để có thể dùng ở nơi khác (ví dụ: cho StatusBar)
export const Colors = {
  black: '#000000',
  white: '#ffffff',
  dark: '#161823',
  primary: '#FF0050', // TikTok pink
  secondary: '#25F4EE', // TikTok cyan
  background: '#000000',
  inputBg: 'rgba(255,255,255,0.1)',
  textLight: '#ffffff',
  textDark: '#161823',
  success: '#00D4AA',
  warning: '#FFB800',
  error: '#FF3040',
  disabled: 'rgba(255,255,255,0.3)'
};

// Tạo và export default đối tượng styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Home Screen Styles
  homeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    color: Colors.textLight,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  actionButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.textDark, // Thay đổi thành textDark để nổi bật trên nền sáng
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  infoText: {
    color: Colors.textLight,
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  // FEATURE: Footer styles (thêm mới)
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 5,
  },
  versionText: {
    color: Colors.primary,
    fontSize: 10,
    opacity: 0.8,
  },
  
  // Stream Screen Styles
  streamContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.black, // Thêm màu nền để tránh màn hình trắng lúc load
  },
  fullScreenVideo: {
    width: width,
    height: height,
  },
  overlayTop: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40, // Điều chỉnh cho tai thỏ
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomInfo: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexShrink: 1, // Để không bị nút end đẩy ra ngoài
  },
  roomIdText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewerCountText: {
    color: Colors.textLight,
    fontSize: 12,
    opacity: 0.8,
  },
  endButton: {
    backgroundColor: 'rgba(255,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endButtonText: {
    color: Colors.textLight,
    fontSize: 18,
  },
  
  // Chat Overlay Styles
  chatOverlay: {
    position: 'absolute',
    bottom: 200,
    left: 15,
    right: 80,
    maxHeight: 250, // Tăng chiều cao chat
  },
  chatMessage: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 8,
    alignSelf: 'flex-start', // Tin nhắn căn lề trái
    maxWidth: '100%',
  },
  systemMessage: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
  },
  reactionMessage: {
    backgroundColor: 'transparent', // Reaction không cần nền
    padding: 2,
    alignSelf: 'flex-end',
  },
  chatText: {
    color: Colors.textLight,
    fontSize: 14,
    lineHeight: 20,
  },
  chatUser: {
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  systemUser: {
    color: Colors.warning,
  },
  ownUser: {
    color: Colors.primary,
  },
  
  // Broadcaster Controls Styles
  broadcasterControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  primaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderColor: Colors.error,
  },
  activeButton: {
    backgroundColor: 'rgba(37,244,238,0.3)',
    borderColor: Colors.secondary,
  },
  controlIcon: {
    fontSize: 24,
  },
  
  // FEATURE: Beauty Panel Styles - ⭐ THÊM MỚI ⭐
  beautyPanel: {
    position: 'absolute',
    bottom: 120,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderRadius: 20,
    padding: 15,
    maxHeight: height * 0.6, // Tối đa 60% chiều cao màn hình
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  beautyPanelTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 10,
  },
  beautySliderContainer: {
    marginBottom: 20,
  },
  beautySliderLabel: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  beautySlider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sliderButton: {
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderValue: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  beautyCloseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  beautyCloseButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // FEATURE: Beauty Panel Container (cho BeautyPanel component)
  beautyPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    maxHeight: height * 0.7, // 70% chiều cao màn hình
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  beautyPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  beautyPanelHeaderTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  beautyPanelCloseButton: {
    padding: 8,
    backgroundColor: 'rgba(255,0,80,0.2)',
    borderRadius: 15,
  },
  beautyPanelCloseText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Viewer Controls Styles
  viewerControls: {
    position: 'absolute',
    right: 15,
    bottom: 220, // Nâng lên cao hơn một chút
    gap: 15,
  },
  reactionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionText: {
    fontSize: 24,
  },
  
  // FEATURE: Extended reactions cho viewer (thêm mới)
  extendedReactionsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 15,
    right: 15,
  },
  extendedReactions: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  extendedReactionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  extendedReactionText: {
    fontSize: 20,
  },
  
  // FEATURE: Viewer stats (thêm mới)
  viewerStatsContainer: {
    position: 'absolute',
    top: 120,
    right: 15,
    gap: 10,
  },
  viewerStat: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewerStatIcon: {
    fontSize: 14,
  },
  viewerStatText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // FEATURE: Floating actions cho viewer (thêm mới)
  floatingActions: {
    position: 'absolute',
    right: 15,
    bottom: 380,
    gap: 10,
  },
  floatingActionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingActionText: {
    fontSize: 18,
  },
  
  // FEATURE: Stream quality indicator (thêm mới)
  qualityIndicator: {
    position: 'absolute',
    top: 120,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  qualityText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Chat Input Styles
  chatInputContainer: {
    position: 'absolute',
    bottom: 0, // Dính sát đáy khi bàn phím hiện
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.dark,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    color: Colors.textLight,
    backgroundColor: Colors.inputBg,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
  sendButtonText: {
    fontSize: 24,
  },
  chatToggleButton: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatToggleText: {
    fontSize: 24,
  },
});

export default styles;