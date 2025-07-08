// DEPENDENCY: Import ZegoEffects SDK
import ZegoEffects from '@zegocloud/zego-effects-reactnative';
import { ZEGO_CONFIG, BEAUTY_CONFIG } from '../contants';

class EffectsService {
  constructor() {
    this.effects = null;
    this.isInitialized = false;
    this.isEffectsEnabled = false;
  }

  // FEATURE: Khởi tạo ZegoEffects SDK
  async initializeEffects() {
    try {
      if (this.isInitialized) {
        return this.effects;
      }

      // LOGGING: Log phiên bản Effects SDK
      console.log(`Effects version=${await ZegoEffects.getVersion()}`);

      // SECURITY: Lấy thông tin xác thực từ SDK
      const authInfo = await ZegoEffects.getAuthInfo(ZEGO_CONFIG.appSign);
      console.log('Auth info obtained:', authInfo);

      // CONFIG: Phiên bản mới không cần license
      const license = ""; // Để trống theo hướng dẫn mới

      // FEATURE: Tạo instance ZegoEffects
      this.effects = new ZegoEffects(license);

      // NOTE: Lắng nghe lỗi từ Effects SDK
      this.effects.on('error', (errorCode, desc) => {
        console.error(`Effects Error - Code: ${errorCode}, Description: ${desc}`);
      });

      // FEATURE: Enable image processing
      await this.effects.enableImageProcessing(true);

      this.isInitialized = true;
      console.log('ZegoEffects initialized successfully');
      return this.effects;
    } catch (error) {
      console.error('Lỗi khởi tạo Effects SDK:', error);
      return null;
    }
  }

  // FEATURE: Bật tất cả beauty effects
  async enableBeautyEffects(settings = {}) {
    if (!this.effects || !this.isInitialized) {
      console.log('Effects chưa được khởi tạo');
      return false;
    }

    try {
      const {
        smoothIntensity = BEAUTY_CONFIG.defaultSmoothIntensity,
        whiteningIntensity = BEAUTY_CONFIG.defaultWhiteningIntensity,
        faceLiftingIntensity = BEAUTY_CONFIG.defaultFaceLiftingIntensity
      } = settings;

      // FEATURE: Bật và cấu hình làm mịn da
      await this.effects.enableSmooth(true);
      await this.effects.setSmoothParam({ intensity: smoothIntensity });

      // FEATURE: Bật và cấu hình làm trắng da
      await this.effects.enableWhitening(true);
      await this.effects.setWhiteningParam({ intensity: whiteningIntensity });

      // FEATURE: Bật và cấu hình thu gọn khuôn mặt
      await this.effects.enableFaceLifting(true);
      await this.effects.setFaceLiftingParam({ intensity: faceLiftingIntensity });

      this.isEffectsEnabled = true;
      console.log('Beauty effects enabled successfully');
      return true;
    } catch (error) {
      console.error('Lỗi enable beauty effects:', error);
      return false;
    }
  }

  // FEATURE: Tắt tất cả beauty effects
  async disableBeautyEffects() {
    if (!this.effects || !this.isInitialized) {
      return false;
    }

    try {
      // FEATURE: Tắt tất cả effects
      await this.effects.enableSmooth(false);
      await this.effects.enableWhitening(false);
      await this.effects.enableFaceLifting(false);

      this.isEffectsEnabled = false;
      console.log('Beauty effects disabled successfully');
      return true;
    } catch (error) {
      console.error('Lỗi disable beauty effects:', error);
      return false;
    }
  }

  // FEATURE: Điều chỉnh cường độ làm mịn da
  async setSmoothIntensity(intensity) {
    if (!this.effects || !this.isEffectsEnabled) {
      return false;
    }

    try {
      await this.effects.setSmoothParam({ intensity });
      console.log(`Smooth intensity set to ${intensity}`);
      return true;
    } catch (error) {
      console.error('Lỗi set smooth intensity:', error);
      return false;
    }
  }

  // FEATURE: Điều chỉnh cường độ làm trắng da
  async setWhiteningIntensity(intensity) {
    if (!this.effects || !this.isEffectsEnabled) {
      return false;
    }

    try {
      await this.effects.setWhiteningParam({ intensity });
      console.log(`Whitening intensity set to ${intensity}`);
      return true;
    } catch (error) {
      console.error('Lỗi set whitening intensity:', error);
      return false;
    }
  }

  // FEATURE: Điều chỉnh cường độ thu gọn mặt
  async setFaceLiftingIntensity(intensity) {
    if (!this.effects || !this.isEffectsEnabled) {
      return false;
    }

    try {
      await this.effects.setFaceLiftingParam({ intensity });
      console.log(`Face lifting intensity set to ${intensity}`);
      return true;
    } catch (error) {
      console.error('Lỗi set face lifting intensity:', error);
      return false;
    }
  }

  // FEATURE: Toggle beauty effects
  async toggleBeautyEffects(settings = {}) {
    if (!this.isInitialized) {
      const result = await this.initializeEffects();
      if (!result) {
        return { success: false, message: 'Không thể khởi tạo Effects SDK' };
      }
    }

    try {
      if (this.isEffectsEnabled) {
        await this.disableBeautyEffects();
        return { success: true, enabled: false, message: 'Đã tắt làm đẹp' };
      } else {
        await this.enableBeautyEffects(settings);
        return { success: true, enabled: true, message: 'Đã bật làm đẹp' };
      }
    } catch (error) {
      console.error('Lỗi toggle beauty effects:', error);
      return { success: false, message: 'Lỗi thay đổi beauty effects' };
    }
  }

  // FUNCTIONALITY: Kiểm tra trạng thái effects
  isEffectsReady() {
    return this.isInitialized && this.effects !== null;
  }

  // FUNCTIONALITY: Kiểm tra trạng thái beauty effects
  isBeautyEnabled() {
    return this.isEffectsEnabled;
  }

  // FUNCTIONALITY: Cleanup effects
  async cleanup() {
    try {
      if (this.effects && this.isInitialized) {
        await this.effects.enableImageProcessing(false);
        this.effects = null;
        this.isInitialized = false;
        this.isEffectsEnabled = false;
        console.log('Effects service cleaned up');
      }
    } catch (error) {
      console.error('Lỗi cleanup effects:', error);
    }
  }

  // FUNCTIONALITY: Lấy instance effects
  getEffects() {
    return this.effects;
  }
}

// NOTE: Export singleton instance
export default new EffectsService();