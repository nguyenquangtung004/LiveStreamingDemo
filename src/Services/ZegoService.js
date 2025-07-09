// DEPENDENCY: Import các thư viện cần thiết
import {
  PermissionsAndroid,
  Platform,
  findNodeHandle
} from 'react-native';

import ZegoExpressEngine, {
  ZegoScenario,
  ZegoPublishChannel
} from 'zego-express-engine-reactnative';

import { ZEGO_CONFIG } from '../contants';

class ZegoService {
  constructor() {
    this.engine = null;
    this.isInitialized = false;
    this.eventCallbacks = {};

  }

  // FUNCTIONALITY: Khởi tạo Zego Engine
  async initializeEngine() {
    try {
      if (this.isInitialized) {
        return this.engine;
      }
      console.log('Đang khởi tạo Zego Engine...');
      // CONFIG: Cấu hình profile cho engine
      const profile = {
        appID: ZEGO_CONFIG.appID,
        appSign: ZEGO_CONFIG.appSign,
        scenario: ZegoScenario.General
      };
      // FEATURE: Tạo Engine
      this.engine = await ZegoExpressEngine.createEngineWithProfile(profile);
      // FEATURE: Gắn thông tin Effects vào engine để EffectsService sử dụng
      this.engine.effectsAppID = ZEGO_CONFIG.appID;
      this.engine.effectsAppSign = ZEGO_CONFIG.appSign;
      this.engine.hasEffectsSupport = true;
      console.log('Effects info đã được gắn vào engine:', {
        appID: this.engine.effectsAppID,
        appSign: this.engine.effectsAppSign?.substring(0, 10) + '...' // Chỉ log một phần để bảo mật
      });
      // FEATURE: Enable custom video processing cho Effects
      await this.engine.enableCustomVideoProcessing(true, {}, ZegoPublishChannel.Main);
      
      // SECURITY: Yêu cầu quyền cho Android
      if (Platform.OS === 'android') {
        await this.requestAndroidPermissions();
      }

      this.isInitialized = true;
      return this.engine;
    } catch (error) {
      console.error('Lỗi khởi tạo Zego Engine:', error);
      throw error;
    }
  }
   // FUNCTIONALITY: Lấy thông tin Effects từ engine
  getEffectsInfo() {
    return {
      hasEffectsSupport: this.engine ? this.engine.hasEffectsSupport : false,
      appID: this.engine ? this.engine.effectsAppID : null,
      appSign: this.engine ? this.engine.effectsAppSign : null,
      isEngineReady: this.isInitialized && this.engine !== null
    };
  }
  // FUNCTIONALITY: Kiểm tra xem có hỗ trợ Effects không
  hasEffectsSupport() {
    return this.engine && this.engine.hasEffectsSupport;
  }
  // SECURITY: Yêu cầu quyền cho Android
  async requestAndroidPermissions() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA
      ];

      const hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      if (!hasPermissions) {
        await PermissionsAndroid.requestMultiple(permissions);
      }
    } catch (error) {
      console.error('Lỗi yêu cầu quyền:', error);
    }
  }

  // FUNCTIONALITY: Đăng nhập vào phòng
  async loginRoom(roomID, userInfo) {
    if (!this.engine) {
      throw new Error('Engine chưa được khởi tạo');
    }

    try {
      await this.engine.loginRoom(roomID, userInfo);
      console.log(`Đã đăng nhập vào phòng ${roomID}`);
    } catch (error) {
      console.error('Lỗi đăng nhập phòng:', error);
      throw error;
    }
  }

  // FUNCTIONALITY: Đăng xuất khỏi phòng
  async logoutRoom(roomID) {
    if (!this.engine) return;

    try {
      await this.engine.logoutRoom(roomID);
      console.log(`Đã đăng xuất khỏi phòng ${roomID}`);
    } catch (error) {
      console.error('Lỗi đăng xuất phòng:', error);
    }
  }

  // FUNCTIONALITY: Bắt đầu preview cho broadcaster
  async startPreview(viewRef) {
    if (!this.engine || !viewRef) return;

    try {
      await this.engine.startPreview({
        reactTag: findNodeHandle(viewRef),
        viewMode: 0,
        backgroundColor: 0
      });
    } catch (error) {
      console.error('Lỗi bắt đầu preview:', error);
      throw error;
    }
  }

  // FUNCTIONALITY: Dừng preview
  async stopPreview() {
    if (!this.engine) return;

    try {
      await this.engine.stopPreview();
    } catch (error) {
      console.error('Lỗi dừng preview:', error);
    }
  }

  // FUNCTIONALITY: Bắt đầu phát stream
  async startPublishing(streamID) {
    if (!this.engine) return;

    try {
      await this.engine.startPublishingStream(streamID);
      console.log(`Bắt đầu phát stream: ${streamID}`);
    } catch (error) {
      console.error('Lỗi bắt đầu phát stream:', error);
      throw error;
    }
  }

  // FUNCTIONALITY: Dừng phát stream
  async stopPublishing() {
    if (!this.engine) return;

    try {
      await this.engine.stopPublishingStream();
    } catch (error) {
      console.error('Lỗi dừng phát stream:', error);
    }
  }

  // FUNCTIONALITY: Bắt đầu xem stream
  async startPlaying(streamID, viewRef) {
    if (!this.engine || !viewRef) return;

    try {
      await this.engine.startPlayingStream(streamID, {
        reactTag: findNodeHandle(viewRef),
        viewMode: 0,
        backgroundColor: 0
      });
      console.log(`Bắt đầu xem stream: ${streamID}`);
    } catch (error) {
      console.error('Lỗi bắt đầu xem stream:', error);
      throw error;
    }
  }

  // FUNCTIONALITY: Dừng xem stream
  async stopPlaying(streamID) {
    if (!this.engine) return;

    try {
      await this.engine.stopPlayingStream(streamID);
    } catch (error) {
      console.error('Lỗi dừng xem stream:', error);
    }
  }

  // FUNCTIONALITY: Bật/tắt microphone
  async toggleMicrophone(enabled) {
    if (!this.engine) return;

    try {
      await this.engine.muteMicrophone(!enabled);
    } catch (error) {
      console.error('Lỗi toggle microphone:', error);
    }
  }

  // FUNCTIONALITY: Bật/tắt camera
  async toggleCamera(enabled) {
    if (!this.engine) return;

    try {
      await this.engine.enableCamera(enabled);
    } catch (error) {
      console.error('Lỗi toggle camera:', error);
    }
  }

  // FUNCTIONALITY: Chuyển đổi camera trước/sau
  async switchCamera(useFrontCamera) {
    if (!this.engine) return;

    try {
      await this.engine.useFrontCamera(useFrontCamera);
    } catch (error) {
      console.error('Lỗi chuyển đổi camera:', error);
    }
  }

  // FUNCTIONALITY: Gửi tin nhắn broadcast
  async sendBroadcastMessage(roomID, message) {
    if (!this.engine) return;

    try {
      await this.engine.sendBroadcastMessage(roomID, message);
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      throw error;
    }
  }

  // FUNCTIONALITY: Đăng ký event listeners
  setupEventListeners(callbacks) {
    if (!this.engine) return;

    this.eventCallbacks = callbacks;

    // DATABASE: Theo dõi trạng thái phòng
    this.engine.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
      console.log(`Trạng thái phòng ${roomID}: ${state}, lỗi: ${errorCode}`);
      if (callbacks.onRoomStateUpdate) {
        callbacks.onRoomStateUpdate(roomID, state, errorCode, extendedData);
      }
    });

    // FUNCTIONALITY: Xử lý tin nhắn chat
    this.engine.on('IMRecvBroadcastMessage', (roomID, messageList) => {
      if (callbacks.onReceiveMessage) {
        callbacks.onReceiveMessage(roomID, messageList);
      }
    });

    // PERFORMANCE: Theo dõi trạng thái streaming
    this.engine.on('publisherStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log(`Publisher ${streamID}: ${state}, lỗi: ${errorCode}`);
      if (callbacks.onPublisherStateUpdate) {
        callbacks.onPublisherStateUpdate(streamID, state, errorCode, extendedData);
      }
    });

    this.engine.on('playerStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log(`Player ${streamID}: ${state}, lỗi: ${errorCode}`);
      if (callbacks.onPlayerStateUpdate) {
        callbacks.onPlayerStateUpdate(streamID, state, errorCode, extendedData);
      }
    });

    // FEATURE: Theo dõi số lượng người trong phòng
    this.engine.on('roomUserUpdate', (roomID, updateType, userList) => {
      if (callbacks.onUserUpdate) {
        callbacks.onUserUpdate(roomID, updateType, userList);
      }
    });
  }

  // FUNCTIONALITY: Cleanup engine
  async destroyEngine() {
    try {
      if (this.engine && this.isInitialized) {
        await ZegoExpressEngine.destroyEngine();
        this.engine = null;
        this.isInitialized = false;
        this.eventCallbacks = {};
        console.log('Zego Engine đã được cleanup');
      }
    } catch (error) {
      console.error('Lỗi cleanup engine:', error);
    }
  }

  // FUNCTIONALITY: Lấy instance engine
  getEngine() {
    return this.engine;
  }
}

// NOTE: Export singleton instance
export default new ZegoService();