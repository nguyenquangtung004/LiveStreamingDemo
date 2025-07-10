// DEPENDENCY: Import ZegoEffects SDK và EffectsHelper
import ZegoEffects from '@zegocloud/zego-effects-reactnative';
import EffectsHelper from './EffectsHelper';
import { ZEGO_CONFIG, BEAUTY_CONFIG } from '../contants';

class EffectsService {
  constructor() {
    this.effects = null;
    this.isInitialized = false;
    this.isEffectsEnabled = false;
    this.engine = null;
  }

  // FEATURE: Set engine từ ZegoService
  setEngine(engine) {
    this.engine = engine;
    console.log('EffectsService đã nhận engine từ ZegoService');
  }

  // FEATURE: Khởi tạo ZegoEffects SDK với EffectsHelper mới
  async initializeEffects() {
    try {
      console.log('Đang khởi tạo ZegoEffects với EffectsHelper...');
      
      // FEATURE: Sử dụng EffectsHelper để khởi tạo
      this.effects = await EffectsHelper.initEffects();
      
      if (!this.effects) {
        throw new Error('Không thể khởi tạo Effects SDK');
      }

      this.isInitialized = true;
      console.log('ZegoEffects initialized successfully with EffectsHelper');
      return this.effects;
    } catch (error) {
      console.error('Lỗi khởi tạo Effects SDK:', error);
      return null;
    }
  }

  // FEATURE: Áp dụng beauty effect thông qua EffectsHelper
  async applyBeautyEffect(groupItem, beautyItem, intensity) {
    if (!this.isInitialized || !EffectsHelper.isReady()) {
      console.warn('Effects chưa được khởi tạo');
      return false;
    }

    try {
      await EffectsHelper.updateEffects(groupItem, beautyItem, intensity);
      console.log(`Applied beauty effect: ${beautyItem.name} with intensity: ${intensity}`);
      return true;
    } catch (error) {
      console.error('Lỗi áp dụng beauty effect:', error);
      return false;
    }
  }

  // FEATURE: Bật tất cả beauty effects (backward compatibility)
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

      // FEATURE: Sử dụng EffectsHelper để áp dụng basic effects
      const basicGroup = { type: 0, name: "Cơ bản" }; // BeautyType.Type_Group
      
      // NOTE: Áp dụng làm mịn da
      await EffectsHelper.updateEffects(
        basicGroup, 
        { type: 3, name: "Làm mịn da" }, // BeautyType.Beauty_Face
        smoothIntensity
      );

      // NOTE: Áp dụng làm trắng da
      await EffectsHelper.updateEffects(
        basicGroup,
        { type: 1, name: "Làm trắng da" }, // BeautyType.Face_Whitening
        whiteningIntensity
      );

      // NOTE: Áp dụng thu gọn mặt
      await EffectsHelper.updateEffects(
        basicGroup,
        { type: 9, name: "Thu gọn mặt" }, // BeautyType.Face_Lifting
        faceLiftingIntensity
      );

      this.isEffectsEnabled = true;
      console.log('Beauty effects enabled successfully với EffectsHelper');
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
      // NOTE: Tắt các effects cơ bản
      const basicGroup = { type: 0, name: "Cơ bản" };
      
      await EffectsHelper.updateEffects(basicGroup, { type: 3, name: "Làm mịn da" }, 0);
      await EffectsHelper.updateEffects(basicGroup, { type: 1, name: "Làm trắng da" }, 0);
      await EffectsHelper.updateEffects(basicGroup, { type: 9, name: "Thu gọn mặt" }, 0);

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
    if (!this.isEffectsEnabled) return false;

    try {
      const basicGroup = { type: 0, name: "Cơ bản" };
      await EffectsHelper.updateEffects(
        basicGroup,
        { type: 3, name: "Làm mịn da" },
        intensity
      );
      console.log(`Smooth intensity set to ${intensity}`);
      return true;
    } catch (error) {
      console.error('Lỗi set smooth intensity:', error);
      return false;
    }
  }

  // FEATURE: Điều chỉnh cường độ làm trắng da
  async setWhiteningIntensity(intensity) {
    if (!this.isEffectsEnabled) return false;

    try {
      const basicGroup = { type: 0, name: "Cơ bản" };
      await EffectsHelper.updateEffects(
        basicGroup,
        { type: 1, name: "Làm trắng da" },
        intensity
      );
      console.log(`Whitening intensity set to ${intensity}`);
      return true;
    } catch (error) {
      console.error('Lỗi set whitening intensity:', error);
      return false;
    }
  }

  // FEATURE: Điều chỉnh cường độ thu gọn mặt
  async setFaceLiftingIntensity(intensity) {
    if (!this.isEffectsEnabled) return false;

    try {
      const basicGroup = { type: 0, name: "Cơ bản" };
      await EffectsHelper.updateEffects(
        basicGroup,
        { type: 9, name: "Thu gọn mặt" },
        intensity
      );
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
      console.log('Effects SDK initialized:', !!result);
      
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
    return this.isInitialized && EffectsHelper.isReady();
  }

  // FUNCTIONALITY: Kiểm tra trạng thái beauty effects
  isBeautyEnabled() {
    return this.isEffectsEnabled;
  }

  // FUNCTIONALITY: Cleanup effects
  async cleanup() {
    try {
      if (this.isInitialized) {
        await EffectsHelper.destroyEffects();
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
    return EffectsHelper.getEffects();
  }

  // FEATURE: Lấy EffectsHelper instance
  getEffectsHelper() {
    return EffectsHelper;
  }
}

// NOTE: Export singleton instance
export default new EffectsService();