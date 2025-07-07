// FIXME: Xây dựng giao diện Live Stream giống TikTok
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
  Dimensions
} from 'react-native';

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

// FIXME: Định nghĩa Colors theo phong cách TikTok
const Colors = {
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
  error: '#FF3040'
};

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
      messages: []
    };
    
    // FIXME: Sử dụng createRef() cho video views
    this.broadcasterViewRef = createRef();
    this.viewerStreamRef = createRef();
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
            time: new Date().toLocaleTimeString()
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
  };

  // FUNCTIONALITY: Gửi tin nhắn chat
  sendMessage = (message) => {
    if (message.trim()) {
      ZegoExpressEngine.instance().sendBroadcastMessage(this.state.roomID, message);
    }
  };

  // FUNCTIONALITY: Kết thúc stream hoặc rời phòng
  endStream = () => {
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
      messages: []
    });
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

  // UI/UX: Render màn hình broadcaster
  renderBroadcasterScreen = () => (
    <View style={styles.streamContainer}>
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
          {this.state.messages.slice(-5).map((msg, index) => (
            <View key={index} style={styles.chatMessage}>
              <Text style={styles.chatText}>
                <Text style={styles.chatUser}>{msg.user}: </Text>
                {msg.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // UI/UX: Render màn hình viewer
  renderViewerScreen = () => (
    <View style={styles.streamContainer}>
      <View style={styles.videoContainer}>
        <ZegoTextureView 
          ref={this.viewerStreamRef} 
          style={styles.fullScreenVideo}
        />
        
        {/* FEATURE: Overlay thông tin */}
        <View style={styles.overlayTop}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomIdText}>🔴 LIVE - ID: {this.state.roomID}</Text>
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
          {this.state.messages.slice(-5).map((msg, index) => (
            <View key={index} style={styles.chatMessage}>
              <Text style={styles.chatText}>
                <Text style={styles.chatUser}>{msg.user}: </Text>
                {msg.text}
              </Text>
            </View>
          ))}
        </View>

        {/* FEATURE: Interaction buttons */}
        <View style={styles.interactionButtons}>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => this.sendMessage('❤️')}
          >
            <Text style={styles.interactionText}>❤️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.commentButton}
            onPress={() => this.sendMessage('👏 Tuyệt vời!')}
          >
            <Text style={styles.interactionText}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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

// UI/UX: Định nghĩa styles theo phong cách TikTok
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
    color: Colors.textLight,
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
  
  // Stream Screen Styles
  streamContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  fullScreenVideo: {
    width: width,
    height: height,
  },
  overlayTop: {
    position: 'absolute',
    top: 50,
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
    backgroundColor: 'rgba(255,0,0,0.8)',
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
    bottom: 150,
    left: 20,
    right: 100,
  },
  chatMessage: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 5,
  },
  chatText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  chatUser: {
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  
  // Interaction Buttons Styles
  interactionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 150,
    gap: 15,
  },
  likeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 24,
  },
});