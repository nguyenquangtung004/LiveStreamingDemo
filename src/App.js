// FIXME: Xây dựng giao diện Live Stream đầy đủ tính năng
import React, { Component, createRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  findNodeHandle,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import styles, { Colors } from './TikTokLiveStreamStyles'; 

// NOTE: Import ZegoExpressEngine và các components cần thiết
import ZegoExpressEngine, {
  ZegoTextureView, 
  ZegoMixerTask, 
  ZegoAudioConfig, 
  ZegoAudioConfigPreset, 
  ZegoMixerInputContentType, 
  ZegoScenario
} from 'zego-express-engine-reactnative';

// CONFIG: Cấu hình quyền cho Android
const granted = (Platform.OS == 'android' ? PermissionsAndroid.check(
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.RECORD_AUDIO) : undefined);

// CONFIG: Cấu hình thông tin ứng dụng Zego
const appID = 1359832122;
const appSign = '5b11b51bd04571706a6ce9d42a7758de13dee90cb6959b09dc46076d1c068c30';

// UI/UX: Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');
export default class TikTokLiveStreamApp extends Component {

  constructor(props) {
    super(props);
    
    // NOTE: Khởi tạo state cho ứng dụng
    this.state = {
      currentScreen: 'home', // 'home', 'broadcaster', 'viewer'
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
      
      // FEATURE: Chat input
      chatInput: '',
      showChatInput: false,
      
      // FEATURE: Filters và Effects
      isBeautyFilterOn: false,
      currentFilter: 'none'
    };
    
    // FIXME: Sử dụng createRef() cho video views
    this.broadcasterViewRef = createRef();
    this.viewerStreamRef = createRef();
    this.chatInputRef = createRef();
    this.mediaPlayer = null;
  }

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
      currentScreen: 'broadcaster' 
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

    this.setState({ currentScreen: 'viewer' }, () => {
      this.setupViewer();
    });
  };

  // FUNCTIONALITY: Thiết lập cho người phát sóng
  setupBroadcaster = () => {
    this.setupZegoEngine().then(() => {
      // NOTE: Đăng nhập vào phòng với vai trò broadcaster
      ZegoExpressEngine.instance().loginRoom(this.state.roomID, {
        "userID": this.state.userID, 
        "userName": this.state.userName
      });

      // UI/UX: Bắt đầu preview và publish stream
      setTimeout(() => {
        if (this.broadcasterViewRef.current) {
          ZegoExpressEngine.instance().startPreview({
            "reactTag": findNodeHandle(this.broadcasterViewRef.current), 
            "viewMode": 0, 
            "backgroundColor": 0
          });
        }
        
        const streamID = `stream_${this.state.roomID}`;
        ZegoExpressEngine.instance().startPublishingStream(streamID);
        
        this.setState({ isStreaming: true });
      }, 500);
    });
  };

  // FUNCTIONALITY: Thiết lập cho người xem
  setupViewer = () => {
    this.setupZegoEngine().then(() => {
      // NOTE: Đăng nhập vào phòng với vai trò viewer
      ZegoExpressEngine.instance().loginRoom(this.state.roomID, {
        "userID": this.state.userID, 
        "userName": this.state.userName
      });

      // UI/UX: Bắt đầu xem stream
      setTimeout(() => {
        const streamID = `stream_${this.state.roomID}`;
        
        if (this.viewerStreamRef.current) {
          ZegoExpressEngine.instance().startPlayingStream(streamID, {
            "reactTag": findNodeHandle(this.viewerStreamRef.current), 
            "viewMode": 0, 
            "backgroundColor": 0
          });
        }
        
        this.setState({ isWatching: true });
      }, 500);
    });
  };

  // FUNCTIONALITY: Thiết lập ZegoExpressEngine
  setupZegoEngine = async () => {
    try {
      // CONFIG: Cấu hình profile cho engine
      let profile = {appID: appID, appSign: appSign, scenario: ZegoScenario.General};
      
      const engine = await ZegoExpressEngine.createEngineWithProfile(profile);
      
      // NOTE: Đăng ký các event listeners
      this.setupEventListeners();
      
      // SECURITY: Yêu cầu quyền cho Android
      if(Platform.OS == 'android') {
        const hasPermission = await granted;
        if(!hasPermission) {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA
          ];
          await PermissionsAndroid.requestMultiple(permissions);
        }
      }
      
      return engine;
    } catch (error) {
      console.log('Lỗi khởi tạo engine: ', error);
    }
  };

  // FUNCTIONALITY: Thiết lập các event listeners
  setupEventListeners = () => {
    // DATABASE: Theo dõi trạng thái phòng
    ZegoExpressEngine.instance().on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
      console.log(`Trạng thái phòng ${roomID}: ${state}, lỗi: ${errorCode}`);
    });

    // FUNCTIONALITY: Xử lý tin nhắn chat
    ZegoExpressEngine.instance().on('IMRecvBroadcastMessage', (roomID, messageList) => {
      messageList.forEach(msg => {
        this.setState(prevState => ({
          messages: [...prevState.messages, {
            id: msg.messageID,
            text: msg.message,
            user: msg.fromUser.userName,
            time: new Date().toLocaleTimeString(),
            type: 'message'
          }]
        }));
      });
    });

    // PERFORMANCE: Theo dõi trạng thái streaming
    ZegoExpressEngine.instance().on('publisherStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log(`Publisher ${streamID}: ${state}, lỗi: ${errorCode}`);
    });

    ZegoExpressEngine.instance().on('playerStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log(`Player ${streamID}: ${state}, lỗi: ${errorCode}`);
    });

    // FEATURE: Theo dõi số lượng người trong phòng
    ZegoExpressEngine.instance().on('roomUserUpdate', (roomID, updateType, userList) => {
      if (updateType === 0) { // User joined
        this.setState(prevState => ({
          viewerCount: prevState.viewerCount + userList.length
        }));
      } else if (updateType === 1) { // User left
        this.setState(prevState => ({
          viewerCount: Math.max(0, prevState.viewerCount - userList.length)
        }));
      }
    });
  };

  // FUNCTIONALITY: Bật/tắt microphone
  toggleMicrophone = () => {
    const newMicState = !this.state.isMicEnabled;
    ZegoExpressEngine.instance().muteMicrophone(!newMicState);
    this.setState({ isMicEnabled: newMicState });
    
    // NOTE: Gửi thông báo cho viewers
    const message = newMicState ? '🎤 Đã bật mic' : '🔇 Đã tắt mic';
    this.sendSystemMessage(message);
  };

  // FUNCTIONALITY: Bật/tắt camera
  toggleCamera = () => {
    const newCameraState = !this.state.isCameraEnabled;
    ZegoExpressEngine.instance().enableCamera(newCameraState);
    this.setState({ isCameraEnabled: newCameraState });
    
    // NOTE: Gửi thông báo cho viewers
    const message = newCameraState ? '📷 Đã bật camera' : '📷 Đã tắt camera';
    this.sendSystemMessage(message);
  };

  // FUNCTIONALITY: Chuyển đổi camera trước/sau
  switchCamera = () => {
    ZegoExpressEngine.instance().useFrontCamera(!this.state.isFrontCamera);
    this.setState(prevState => ({ isFrontCamera: !prevState.isFrontCamera }));
  };

  // FUNCTIONALITY: Gửi tin nhắn hệ thống
  sendSystemMessage = (message) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, {
        id: Date.now(),
        text: message,
        user: 'Hệ thống',
        time: new Date().toLocaleTimeString(),
        type: 'system'
      }]
    }));
  };

  // FUNCTIONALITY: Gửi tin nhắn chat
  sendMessage = (message = null) => {
    const messageToSend = message || this.state.chatInput.trim();
    
    if (messageToSend) {
      ZegoExpressEngine.instance().sendBroadcastMessage(this.state.roomID, messageToSend);
      
      // NOTE: Thêm tin nhắn vào local state ngay lập tức
      this.setState(prevState => ({
        messages: [...prevState.messages, {
          id: Date.now(),
          text: messageToSend,
          user: this.state.userName,
          time: new Date().toLocaleTimeString(),
          type: 'message',
          isOwn: true
        }],
        chatInput: '',
        showChatInput: false
      }));
      
      Keyboard.dismiss();
    }
  };

  // FUNCTIONALITY: Hiển thị/ẩn chat input
  toggleChatInput = () => {
    this.setState(prevState => ({ 
      showChatInput: !prevState.showChatInput 
    }), () => {
      if (this.state.showChatInput && this.chatInputRef.current) {
        setTimeout(() => {
          this.chatInputRef.current.focus();
        }, 100);
      }
    });
  };

  // FUNCTIONALITY: Bật/tắt beauty filter
  toggleBeautyFilter = () => {
    const newState = !this.state.isBeautyFilterOn;
    // TODO: Implement beauty filter với ZegoExpressEngine
    this.setState({ isBeautyFilterOn: newState });
    
    const message = newState ? '✨ Đã bật làm đẹp' : '✨ Đã tắt làm đẹp';
    this.sendSystemMessage(message);
  };

  // FUNCTIONALITY: Gửi reaction nhanh
  sendQuickReaction = (emoji) => {
    this.sendMessage(emoji);
    
    // TODO: Hiển thị animation cho reaction
    this.setState(prevState => ({
      messages: [...prevState.messages, {
        id: Date.now(),
        text: emoji,
        user: this.state.userName,
        time: new Date().toLocaleTimeString(),
        type: 'reaction'
      }]
    }));
  };

  // FUNCTIONALITY: Kết thúc stream hoặc rời phòng
  endStream = () => {
    Alert.alert(
      'Xác nhận',
      this.state.isStreaming ? 'Bạn có muốn kết thúc livestream?' : 'Bạn có muốn rời khỏi phòng?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng ý', 
          onPress: () => {
            ZegoExpressEngine.instance().logoutRoom(this.state.roomID);
            
            if (this.state.isStreaming) {
              ZegoExpressEngine.instance().stopPreview();
              ZegoExpressEngine.instance().stopPublishingStream();
            }
            
            if (this.state.isWatching) {
              ZegoExpressEngine.instance().stopPlayingStream(`stream_${this.state.roomID}`);
            }
            
            this.setState({
              currentScreen: 'home',
              isStreaming: false,
              isWatching: false,
              messages: [],
              isMicEnabled: true,
              isCameraEnabled: true,
              showChatInput: false,
              chatInput: ''
            });
          }
        }
      ]
    );
  };

  // FUNCTIONALITY: Cleanup khi component unmount
  componentWillUnmount() {
    if(ZegoExpressEngine.instance()) {
      ZegoExpressEngine.destroyEngine();
    }
  }

  // UI/UX: Render màn hình chính (Home)
  renderHomeScreen = () => (
    <View style={styles.homeContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.appTitle}>📱 Live Stream</Text>
        <Text style={styles.appSubtitle}>Phát sóng trực tiếp như TikTok</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên của bạn"
          placeholderTextColor={Colors.textLight}
          value={this.state.userName}
          onChangeText={(text) => this.setState({ userName: text })}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nhập ID phòng để xem (tùy chọn)"
          placeholderTextColor={Colors.textLight}
          value={this.state.roomID}
          onChangeText={(text) => this.setState({ roomID: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={this.createLiveRoom}
        >
          <Text style={styles.buttonText}>🎥 Bắt đầu phát sóng</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={this.joinLiveRoom}
        >
          <Text style={styles.buttonText}>👁️ Xem live stream</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 Để phát sóng: Nhập tên và nhấn "Bắt đầu phát sóng"
        </Text>
        <Text style={styles.infoText}>
          👀 Để xem: Nhập tên, ID phòng và nhấn "Xem live stream"
        </Text>
      </View>
    </View>
  );

  // UI/UX: Render controls cho broadcaster
  renderBroadcasterControls = () => (
    <View style={styles.broadcasterControls}>
      {/* FEATURE: Điều khiển mic và camera */}
      <View style={styles.primaryControls}>
        <TouchableOpacity 
          style={[styles.controlButton, !this.state.isMicEnabled && styles.disabledButton]}
          onPress={this.toggleMicrophone}
        >
          <Text style={styles.controlIcon}>
            {this.state.isMicEnabled ? '🎤' : '🔇'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, !this.state.isCameraEnabled && styles.disabledButton]}
          onPress={this.toggleCamera}
        >
          <Text style={styles.controlIcon}>
            {this.state.isCameraEnabled ? '📷' : '📷'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={this.switchCamera}
        >
          <Text style={styles.controlIcon}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, this.state.isBeautyFilterOn && styles.activeButton]}
          onPress={this.toggleBeautyFilter}
        >
          <Text style={styles.controlIcon}>✨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // UI/UX: Render màn hình broadcaster
  renderBroadcasterScreen = () => (
    <KeyboardAvoidingView style={styles.streamContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.videoContainer}>
        <ZegoTextureView 
          ref={this.broadcasterViewRef} 
          style={styles.fullScreenVideo}
        />
        
        {/* FEATURE: Overlay thông tin */}
        <View style={styles.overlayTop}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomIdText}>🔴 LIVE - ID: {this.state.roomID}</Text>
            <Text style={styles.viewerCountText}>👥 {this.state.viewerCount} người xem</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.endButton}
            onPress={this.endStream}
          >
            <Text style={styles.endButtonText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* FEATURE: Chat overlay */}
        <View style={styles.chatOverlay}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.messages.slice(-10).map((msg, index) => (
              <View key={index} style={[
                styles.chatMessage,
                msg.type === 'system' && styles.systemMessage,
                msg.type === 'reaction' && styles.reactionMessage
              ]}>
                <Text style={styles.chatText}>
                  <Text style={[
                    styles.chatUser, 
                    msg.type === 'system' && styles.systemUser,
                    msg.isOwn && styles.ownUser
                  ]}>
                    {msg.user}: 
                  </Text>
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FEATURE: Broadcaster controls */}
        {this.renderBroadcasterControls()}

        {/* FEATURE: Chat input */}
        {this.state.showChatInput && (
          <View style={styles.chatInputContainer}>
            <TextInput
              ref={this.chatInputRef}
              style={styles.chatInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={Colors.disabled}
              value={this.state.chatInput}
              onChangeText={(text) => this.setState({ chatInput: text })}
              onSubmitEditing={() => this.sendMessage()}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={() => this.sendMessage()}
            >
              <Text style={styles.sendButtonText}>📤</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FEATURE: Chat toggle button */}
        <TouchableOpacity 
          style={styles.chatToggleButton}
          onPress={this.toggleChatInput}
        >
          <Text style={styles.chatToggleText}>💬</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  // UI/UX: Render màn hình viewer
  renderViewerScreen = () => (
    <KeyboardAvoidingView style={styles.streamContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.videoContainer}>
        <ZegoTextureView 
          ref={this.viewerStreamRef} 
          style={styles.fullScreenVideo}
        />
        
        {/* FEATURE: Overlay thông tin */}
        <View style={styles.overlayTop}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomIdText}>🔴 LIVE - ID: {this.state.roomID}</Text>
            <Text style={styles.viewerCountText}>👥 {this.state.viewerCount} người xem</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.endButton}
            onPress={this.endStream}
          >
            <Text style={styles.endButtonText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* FEATURE: Chat overlay */}
        <View style={styles.chatOverlay}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.messages.slice(-10).map((msg, index) => (
              <View key={index} style={[
                styles.chatMessage,
                msg.type === 'system' && styles.systemMessage,
                msg.type === 'reaction' && styles.reactionMessage
              ]}>
                <Text style={styles.chatText}>
                  <Text style={[
                    styles.chatUser, 
                    msg.type === 'system' && styles.systemUser,
                    msg.isOwn && styles.ownUser
                  ]}>
                    {msg.user}: 
                  </Text>
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FEATURE: Viewer interaction buttons */}
        <View style={styles.viewerControls}>
          <TouchableOpacity 
            style={styles.reactionButton}
            onPress={() => this.sendQuickReaction('❤️')}
          >
            <Text style={styles.reactionText}>❤️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.reactionButton}
            onPress={() => this.sendQuickReaction('👏')}
          >
            <Text style={styles.reactionText}>👏</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reactionButton}
            onPress={() => this.sendQuickReaction('🔥')}
          >
            <Text style={styles.reactionText}>🔥</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reactionButton}
            onPress={() => this.sendQuickReaction('😍')}
          >
            <Text style={styles.reactionText}>😍</Text>
          </TouchableOpacity>
        </View>

        {/* FEATURE: Chat input */}
        {this.state.showChatInput && (
          <View style={styles.chatInputContainer}>
            <TextInput
              ref={this.chatInputRef}
              style={styles.chatInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={Colors.disabled}
              value={this.state.chatInput}
              onChangeText={(text) => this.setState({ chatInput: text })}
              onSubmitEditing={() => this.sendMessage()}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={() => this.sendMessage()}
            >
              <Text style={styles.sendButtonText}>📤</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FEATURE: Chat toggle button */}
        <TouchableOpacity 
          style={styles.chatToggleButton}
          onPress={this.toggleChatInput}
        >
          <Text style={styles.chatToggleText}>💬</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  // UI/UX: Render giao diện chính
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        
        {this.state.currentScreen === 'home' && this.renderHomeScreen()}
        {this.state.currentScreen === 'broadcaster' && this.renderBroadcasterScreen()}
        {this.state.currentScreen === 'viewer' && this.renderViewerScreen()}
      </SafeAreaView>
    );
  }
}

