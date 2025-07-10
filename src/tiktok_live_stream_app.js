// FIXME: Ứng dụng Live Stream được refactor thành nhiều component nhỏ
import React, { Component, createRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';

// DEPENDENCY: Import các services và components
import ZegoService from './Services/ZegoService';
import EffectsService from './Services/EffectsService';
import ChatManager from './chat_message';
import HomeScreen from './home_screen';
import BroadcasterScreen from './broadcaster_screen';
import ViewerScreen from './viewer_screen';

// DEPENDENCY: Import constants và styles
import { SCREENS, BEAUTY_CONFIG, MESSAGE_TYPES } from './contants';
import styles, { Colors } from './TikTokLiveStreamStyles';

export default class TikTokLiveStreamApp extends Component {

  constructor(props) {
    super(props);
    
    // NOTE: Khởi tạo state cho ứng dụng
    this.state = {
      currentScreen: SCREENS.HOME,
      roomID: '',
      userID: `user_${Date.now()}`,
      userName: '',
      isStreaming: false,
      isWatching: false,
      viewerCount: 0,
      messages: [],
      
      // FEATURE: Điều khiển mic và camera
      isMicEnabled: true,
      isCameraEnabled: true,
      isFrontCamera: true,
      
      // FEATURE: Chat input
      chatInput: '',
      showChatInput: false,
      
      // FEATURE: Beauty effects
      isBeautyFilterOn: false,
      showBeautyPanel: false,
      beautySettings: {
        smoothIntensity: BEAUTY_CONFIG.defaultSmoothIntensity,
        whiteningIntensity: BEAUTY_CONFIG.defaultWhiteningIntensity,
        faceLiftingIntensity: BEAUTY_CONFIG.defaultFaceLiftingIntensity
      }
    };
    
    // FIXME: Sử dụng createRef() cho video views
    this.broadcasterViewRef = createRef();
    this.viewerStreamRef = createRef();
    
    // NOTE: Bind các methods
    this.setupChatManager();
  }

  // FUNCTIONALITY: Thiết lập ChatManager
  setupChatManager = () => {
    ChatManager.addMessageListener((messages) => {
      this.setState({ messages });
    });
  };

  // FUNCTIONALITY: Tạo phòng phát sóng mới
  createLiveRoom = () => {
    if (!this.state.userName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn');
      return;
    }

    // CONFIG: Tạo roomID ngẫu nhiên
    const newRoomID = Math.floor(100000 + Math.random() * 900000).toString();
    
    this.setState({ 
      roomID: newRoomID, 
      currentScreen: SCREENS.BROADCASTER 
    }, () => {
      this.setupBroadcaster();
    });
  };

  // FUNCTIONALITY: Tham gia phòng để xem stream
  joinLiveRoom = () => {
    if (!this.state.roomID.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập ID phòng');
      return;
    }
    
    if (!this.state.userName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn');
      return;
    }

    this.setState({ currentScreen: SCREENS.VIEWER }, () => {
      this.setupViewer();
    });
  };

  // FUNCTIONALITY: Thiết lập cho người phát sóng
  setupBroadcaster = async () => {
    try {
      // NOTE: Khởi tạo ZegoEngine
      await ZegoService.initializeEngine();
      
      // NOTE: Thiết lập event listeners
      this.setupZegoEventListeners();
      
      // FEATURE: Set engine cho EffectsService và khởi tạo
      EffectsService.setEngine(ZegoService.getEngine());
      await EffectsService.initializeEffects();

      // NOTE: Đăng nhập vào phòng
      await ZegoService.loginRoom(this.state.roomID, {
        userID: this.state.userID,
        userName: this.state.userName
      });

      // UI/UX: Bắt đầu preview và publish stream
      setTimeout(async () => {
        if (this.broadcasterViewRef.current) {
          await ZegoService.startPreview(this.broadcasterViewRef.current);
        }
        
        const streamID = `stream_${this.state.roomID}`;
        await ZegoService.startPublishing(streamID);
        
        this.setState({ isStreaming: true });
        ChatManager.addSystemMessage('🎥 Đã bắt đầu phát sóng trực tiếp');
      }, 500);
    } catch (error) {
      console.error('Lỗi setup broadcaster:', error);
      Alert.alert('Lỗi', 'Không thể khởi tạo phát sóng');
    }
  };

  // FUNCTIONALITY: Thiết lập cho người xem
  setupViewer = async () => {
    try {
      // NOTE: Khởi tạo ZegoEngine
      await ZegoService.initializeEngine();
      
      // NOTE: Thiết lập event listeners
      this.setupZegoEventListeners();

      // NOTE: Đăng nhập vào phòng
      await ZegoService.loginRoom(this.state.roomID, {
        userID: this.state.userID,
        userName: this.state.userName
      });

      // UI/UX: Bắt đầu xem stream
      setTimeout(async () => {
        const streamID = `stream_${this.state.roomID}`;
        
        if (this.viewerStreamRef.current) {
          await ZegoService.startPlaying(streamID, this.viewerStreamRef.current);
        }
        
        this.setState({ isWatching: true });
        ChatManager.addSystemMessage('👁️ Đã tham gia phòng xem');
      }, 500);
    } catch (error) {
      console.error('Lỗi setup viewer:', error);
      Alert.alert('Lỗi', 'Không thể tham gia phòng');
    }
  };

  // FUNCTIONALITY: Thiết lập Zego event listeners
  setupZegoEventListeners = () => {
    ZegoService.setupEventListeners({
      onRoomStateUpdate: (roomID, state, errorCode, extendedData) => {
        console.log(`Trạng thái phòng ${roomID}: ${state}, lỗi: ${errorCode}`);
      },

      onReceiveMessage: (roomID, messageList) => {
        ChatManager.addBroadcastMessage(messageList);
      },

      onPublisherStateUpdate: (streamID, state, errorCode, extendedData) => {
        console.log(`Publisher ${streamID}: ${state}, lỗi: ${errorCode}`);
      },

      onPlayerStateUpdate: (streamID, state, errorCode, extendedData) => {
        console.log(`Player ${streamID}: ${state}, lỗi: ${errorCode}`);
      },

      onUserUpdate: (roomID, updateType, userList) => {
        if (updateType === 0) { // User joined
          this.setState(prevState => ({
            viewerCount: prevState.viewerCount + userList.length
          }));
        } else if (updateType === 1) { // User left
          this.setState(prevState => ({
            viewerCount: Math.max(0, prevState.viewerCount - userList.length)
          }));
        }
      }
    });
  };

  // FUNCTIONALITY: Bật/tắt microphone
  toggleMicrophone = async () => {
    const newMicState = !this.state.isMicEnabled;
    await ZegoService.toggleMicrophone(newMicState);
    this.setState({ isMicEnabled: newMicState });
    
    const message = newMicState ? '🎤 Đã bật mic' : '🔇 Đã tắt mic';
    ChatManager.addSystemMessage(message);
  };

  // FUNCTIONALITY: Bật/tắt camera
  toggleCamera = async () => {
    const newCameraState = !this.state.isCameraEnabled;
    await ZegoService.toggleCamera(newCameraState);
    this.setState({ isCameraEnabled: newCameraState });
    
    const message = newCameraState ? '📷 Đã bật camera' : '📷 Đã tắt camera';
    ChatManager.addSystemMessage(message);
  };

  // FUNCTIONALITY: Chuyển đổi camera trước/sau
  switchCamera = async () => {
    const newFrontCameraState = !this.state.isFrontCamera;
    await ZegoService.switchCamera(newFrontCameraState);
    this.setState({ isFrontCamera: newFrontCameraState });
  };

  // FUNCTIONALITY: Bật/tắt beauty filter
  toggleBeautyFilter = async () => {
    const result = await EffectsService.toggleBeautyEffects(this.state.beautySettings);
    
    if (result.success) {
      this.setState({ isBeautyFilterOn: result.enabled });
      ChatManager.addSystemMessage(result.message);
    } else {
      Alert.alert('Thông báo', result.message);
    }
  };

  // FUNCTIONALITY: Toggle beauty panel
  toggleBeautyPanel = () => {
    this.setState(prevState => ({ 
      showBeautyPanel: !prevState.showBeautyPanel 
    }));
  };

  // FEATURE: Xử lý khi chọn beauty effect từ BeautyPanel
  handleBeautyEffectSelected = async (groupItem, beautyItem) => {
    try {
      console.log('Applying beauty effect:', groupItem.name, '->', beautyItem.name);
      
      // FEATURE: Sử dụng EffectsHelper để áp dụng effect
      const effectsHelper = EffectsService.getEffectsHelper();
      if (effectsHelper && effectsHelper.isReady()) {
        const intensity = beautyItem.intensity || groupItem.intensity || 50;
        await effectsHelper.updateEffects(groupItem, beautyItem, intensity);
        
        // NOTE: Thêm system message
        ChatManager.addSystemMessage(`✨ Đã áp dụng: ${beautyItem.name}`);
      } else {
        console.warn('EffectsHelper not ready');
        Alert.alert('Thông báo', 'Effects chưa sẵn sàng');
      }
    } catch (error) {
      console.error('Error applying beauty effect:', error);
      Alert.alert('Lỗi', 'Không thể áp dụng hiệu ứng');
    }
  };

  // FEATURE: Xử lý khi thay đổi cường độ beauty effect
  handleBeautyIntensityChanged = async (groupItem, beautyItem, intensity) => {
    try {
      console.log('Changing beauty intensity:', beautyItem.name, 'to', intensity);
      
      // FEATURE: Sử dụng EffectsHelper để thay đổi cường độ
      const effectsHelper = EffectsService.getEffectsHelper();
      if (effectsHelper && effectsHelper.isReady()) {
        await effectsHelper.updateEffects(groupItem, beautyItem, intensity);
        
        // NOTE: Cập nhật local state nếu cần (cho legacy settings)
        this.updateLegacyBeautySettings(beautyItem.type, intensity);
      } else {
        console.warn('EffectsHelper not ready');
      }
    } catch (error) {
      console.error('Error changing beauty intensity:', error);
    }
  };

  // FUNCTIONALITY: Cập nhật legacy beauty settings (backward compatibility)
  updateLegacyBeautySettings = (effectType, intensity) => {
    this.setState(prevState => {
      const newSettings = { ...prevState.beautySettings };
      
      // NOTE: Map effect types to legacy settings
      switch (effectType) {
        case 3: // Beauty_Face
          newSettings.smoothIntensity = intensity;
          break;
        case 1: // Face_Whitening
          newSettings.whiteningIntensity = intensity;
          break;
        case 9: // Face_Lifting
          newSettings.faceLiftingIntensity = intensity;
          break;
      }
      
      return { beautySettings: newSettings };
    });
  };

  // FEATURE: Điều chỉnh cường độ beauty effects (legacy method)
  adjustBeautyIntensity = async (effectType, intensity) => {
    let success = false;
    
    switch (effectType) {
      case 'smooth':
        success = await EffectsService.setSmoothIntensity(intensity);
        if (success) {
          this.setState(prevState => ({
            beautySettings: {
              ...prevState.beautySettings,
              smoothIntensity: intensity
            }
          }));
        }
        break;
      case 'whitening':
        success = await EffectsService.setWhiteningIntensity(intensity);
        if (success) {
          this.setState(prevState => ({
            beautySettings: {
              ...prevState.beautySettings,
              whiteningIntensity: intensity
            }
          }));
        }
        break;
      case 'faceLifting':
        success = await EffectsService.setFaceLiftingIntensity(intensity);
        if (success) {
          this.setState(prevState => ({
            beautySettings: {
              ...prevState.beautySettings,
              faceLiftingIntensity: intensity
            }
          }));
        }
        break;
    }
  };

  // FUNCTIONALITY: Toggle chat input
  toggleChatInput = () => {
    this.setState(prevState => ({ 
      showChatInput: !prevState.showChatInput 
    }));
  };

  // FUNCTIONALITY: Xử lý thay đổi chat input
  handleChatInputChange = (text) => {
    this.setState({ chatInput: text });
  };

  // FUNCTIONALITY: Gửi tin nhắn chat
  sendMessage = async (message = null) => {
    const messageToSend = message || this.state.chatInput.trim();
    
    if (!messageToSend) return;

    // SECURITY: Validate tin nhắn
    const validation = ChatManager.validateMessage(messageToSend, this.state.userName);
    if (!validation.valid) {
      Alert.alert('Lỗi', validation.error);
      return;
    }

    try {
      await ZegoService.sendBroadcastMessage(this.state.roomID, messageToSend);
      
      // NOTE: Thêm tin nhắn vào local chat
      ChatManager.addOwnMessage(messageToSend, this.state.userName);
      
      this.setState({ 
        chatInput: '', 
        showChatInput: false 
      });
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn');
    }
  };

  // FUNCTIONALITY: Gửi reaction nhanh
  sendQuickReaction = async (emoji) => {
    await this.sendMessage(emoji);
    ChatManager.addReaction(emoji, this.state.userName, true);
  };

  // FUNCTIONALITY: Kết thúc stream hoặc rời phòng
  endStream = () => {
    const title = this.state.isStreaming ? 'Kết thúc livestream' : 'Rời khỏi phòng';
    const message = this.state.isStreaming ? 
      'Bạn có muốn kết thúc livestream?' : 
      'Bạn có muốn rời khỏi phòng?';

    Alert.alert(title, message, [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Đồng ý', 
        onPress: this.performEndStream
      }
    ]);
  };

  // FUNCTIONALITY: Thực hiện kết thúc stream
  performEndStream = async () => {
    try {
      // NOTE: Logout từ room
      await ZegoService.logoutRoom(this.state.roomID);
      
      if (this.state.isStreaming) {
        await ZegoService.stopPreview();
        await ZegoService.stopPublishing();
      }
      
      if (this.state.isWatching) {
        await ZegoService.stopPlaying(`stream_${this.state.roomID}`);
      }
      
      // NOTE: Reset state
      this.setState({
        currentScreen: SCREENS.HOME,
        isStreaming: false,
        isWatching: false,
        viewerCount: 0,
        isMicEnabled: true,
        isCameraEnabled: true,
        showChatInput: false,
        chatInput: '',
        isBeautyFilterOn: false,
        showBeautyPanel: false
      });

      // NOTE: Clear chat messages
      ChatManager.clearMessages();
    } catch (error) {
      console.error('Lỗi kết thúc stream:', error);
    }
  };

  // FUNCTIONALITY: Handle các thay đổi input
  handleUserNameChange = (text) => {
    this.setState({ userName: text });
  };

  handleRoomIDChange = (text) => {
    this.setState({ roomID: text });
  };

  // FUNCTIONALITY: Cleanup khi component unmount
  componentWillUnmount() {
    this.performCleanup();
  }

  performCleanup = async () => {
    try {
      // FEATURE: Cleanup Effects Service
      await EffectsService.cleanup();
      
      // NOTE: Cleanup Zego Service
      await ZegoService.destroyEngine();
      
      // NOTE: Reset Chat Manager
      ChatManager.reset();
      
      console.log('App cleanup completed');
    } catch (error) {
      console.error('Lỗi cleanup app:', error);
    }
  };

  // UI/UX: Render màn hình hiện tại
  renderCurrentScreen = () => {
    switch (this.state.currentScreen) {
      case SCREENS.HOME:
        return (
          <HomeScreen
            userName={this.state.userName}
            roomID={this.state.roomID}
            onUserNameChange={this.handleUserNameChange}
            onRoomIDChange={this.handleRoomIDChange}
            onCreateRoom={this.createLiveRoom}
            onJoinRoom={this.joinLiveRoom}
          />
        );

      case SCREENS.BROADCASTER:
        return (
          <BroadcasterScreen
            roomID={this.state.roomID}
            viewerCount={this.state.viewerCount}
            messages={this.state.messages}
            isMicEnabled={this.state.isMicEnabled}
            isCameraEnabled={this.state.isCameraEnabled}
            isBeautyFilterOn={this.state.isBeautyFilterOn}
            showBeautyPanel={this.state.showBeautyPanel}
            showChatInput={this.state.showChatInput}
            chatInput={this.state.chatInput}
            beautySettings={this.state.beautySettings}
            onToggleMicrophone={this.toggleMicrophone}
            onToggleCamera={this.toggleCamera}
            onSwitchCamera={this.switchCamera}
            onToggleBeautyFilter={this.toggleBeautyFilter}
            onToggleBeautyPanel={this.toggleBeautyPanel}
            onToggleChatInput={this.toggleChatInput}
            onChatInputChange={this.handleChatInputChange}
            onSendMessage={this.sendMessage}
            onAdjustBeauty={this.adjustBeautyIntensity}
            onEndStream={this.endStream}
            broadcasterViewRef={this.broadcasterViewRef}
            // FEATURE: Callbacks mới cho BeautyPanel
            onBeautyEffectSelected={this.handleBeautyEffectSelected}
            onBeautyIntensityChanged={this.handleBeautyIntensityChanged}
          />
        );

      case SCREENS.VIEWER:
        return (
          <ViewerScreen
            roomID={this.state.roomID}
            viewerCount={this.state.viewerCount}
            messages={this.state.messages}
            showChatInput={this.state.showChatInput}
            chatInput={this.state.chatInput}
            onToggleChatInput={this.toggleChatInput}
            onChatInputChange={this.handleChatInputChange}
            onSendMessage={this.sendMessage}
            onSendQuickReaction={this.sendQuickReaction}
            onEndStream={this.endStream}
            viewerStreamRef={this.viewerStreamRef}
          />
        );

      default:
        return null;
    }
  };

  // UI/UX: Render giao diện chính
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        {this.renderCurrentScreen()}
      </SafeAreaView>
    );
  }
}