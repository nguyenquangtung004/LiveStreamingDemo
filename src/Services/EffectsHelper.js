// DEPENDENCY: Import ZegoEffects SDK và các dependencies
import ZegoEffects, { 
  ZegoEffectsSkinColorType, 
  ZegoEffectsBlusherType, 
  ZegoEffectsColoredcontactsType, 
  ZegoEffectsEyelashesType, 
  ZegoEffectsEyelinerType, 
  ZegoEffectsEyeshadowType, 
  ZegoEffectsFilterType, 
  ZegoEffectsLipstickType, 
  ZegoEffectsMakeupType, 
  ZegoEffectsMosaicType, 
  ZegoEffectsScaleMode 
} from '@zegocloud/zego-effects-reactnative';

import { Platform } from 'react-native';
import RNFS ,{
  ExternalCachesDirectoryPath
} from '@dr.pogodin/react-native-fs';
import { ZEGO_CONFIG } from '../contants';
import { BeautyType } from '../Effects/EffectConfig';

class EffectsHelper {
  constructor() {
    this.effects = null;
    this.isInitialized = false;
  }

  // FEATURE: Copy resources sử dụng react-native-fs thay vì native module
  async copyResources() {
    try {
      if (Platform.OS === 'android') {
        const bundlePath = 'ClarityResources.bundle';
        const destPath = `${ExternalCachesDirectoryPath}/${bundlePath}`;
        
        console.log(`[copyResources] Copying ${bundlePath} to ${destPath}`);
        
        // NOTE: Kiểm tra nếu đã copy rồi thì skip
        const exists = await exists(destPath);
        if (exists) {
          console.log('[copyResources] Resources already exist, skipping...');
          return;
        }

        // FEATURE: Copy từ assets bundle đến external cache
        await this.copyAssetsRecursively(bundlePath, destPath);
        console.log('[copyResources] Resources copied successfully');
      }
    } catch (error) {
      console.error('[copyResources] Error copying resources:', error);
    }
  }

  // FUNCTIONALITY: Copy assets recursively sử dụng RNFS
  async copyAssetsRecursively(sourcePath, destPath) {
    try {
      // NOTE: Tạo thư mục đích
      await RNFS.mkdir(destPath);
      
      // NOTE: Đối với demo, chúng ta sẽ tạo một số file background mẫu
      // TODO: Thay thế bằng logic copy thực tế từ assets
      const sampleBackgrounds = [
        'sunset.jpg',
        'bg.jpg',
        'forest.jpg',
        'sky.jpg'
      ];

      for (const fileName of sampleBackgrounds) {
        const filePath = `${destPath}/${fileName}`;
        // NOTE: Tạo file placeholder (trong thực tế sẽ copy từ assets)
        await RNFS.writeFile(filePath, '', 'utf8');
        console.log(`[copyResources] Created placeholder: ${fileName}`);
      }
    } catch (error) {
      console.error('[copyResources] Error in recursive copy:', error);
    }
  }

  // FUNCTIONALITY: Lấy đường dẫn resource
  getResourcePath() {
    if (Platform.OS === 'android') {
      return RNFS.ExternalCachesDirectoryPath;
    } else {
      return RNFS.MainBundlePath;
    }
  }

  // FEATURE: Khởi tạo Effects (bỏ qua license theo yêu cầu)
  async initEffects() {
    try {
      console.log('Initializing ZegoEffects without license...');
      
      // NOTE: Copy resources nếu cần
      if (Platform.OS === 'android') {
        await this.copyResources();
      }

      // FEATURE: Tạo ZegoEffects instance với appID và appSign
      this.effects = new ZegoEffects(ZEGO_CONFIG.appID, ZEGO_CONFIG.appSign);

      // NOTE: Lắng nghe lỗi từ Effects SDK
      this.effects.on("error", (errorCode, desc) => {
        console.error("Effects error: " + errorCode + ", desc: " + desc);
      });

      // FEATURE: Enable image processing cho Express
      await this.effects.enableImageProcessing(true);

      // FEATURE: Enable và cấu hình các effect cơ bản
      await this.enableBasicEffects();

      this.isInitialized = true;
      console.log('ZegoEffects initialized successfully without license');
      return this.effects;
    } catch (error) {
      console.error('Error initializing Effects SDK:', error);
      return null;
    }
  }

  // FEATURE: Enable các effect cơ bản
  async enableBasicEffects() {
    try {
      // NOTE: Enable smoothing effect
      await this.effects.enableSmooth(true);
      await this.effects.setSmoothParam({ intensity: 50 });

      // NOTE: Enable face lifting
      await this.effects.enableFaceLifting(true);
      await this.effects.setFaceLiftingParam({ intensity: 30 });

      console.log('Basic effects enabled');
    } catch (error) {
      console.error('Error enabling basic effects:', error);
    }
  }

  // FEATURE: Cleanup effects
  async destroyEffects() {
    try {
      if (this.effects && this.isInitialized) {
        await this.effects.destroy();
        this.effects = null;
        this.isInitialized = false;
        console.log('Effects destroyed successfully');
      }
    } catch (error) {
      console.error('Error destroying effects:', error);
    }
  }

  // FUNCTIONALITY: Cập nhật effects dựa trên BeautyItem
  async updateEffects(groupItem, beautyItem, currentIntensity) {
    if (!this.effects || !this.isInitialized) {
      console.warn('Effects not initialized');
      return;
    }

    console.log(`updateEffects: groupItem=${groupItem.type}, beautyItem=${JSON.stringify(beautyItem)}, intensity=${currentIntensity}`);

    try {
      // FEATURE: Xử lý effects theo nhóm
      await this.processEffectsByGroup(groupItem, beautyItem, currentIntensity);
    } catch (error) {
      console.error('Error updating effects:', error);
    }
  }

  // FUNCTIONALITY: Xử lý effects theo nhóm
  async processEffectsByGroup(groupItem, beautyItem, currentIntensity) {
    const isEnabled = currentIntensity > 0;
    
    switch (groupItem.type) {
      case BeautyType.Type_Group:
        await this.handleBasicEffects(beautyItem, currentIntensity, isEnabled);
        break;
        
      case BeautyType.Colorful_Style:
        await this.handleFilterEffects(beautyItem, currentIntensity, isEnabled);
        break;
        
      case BeautyType.Beautiful_Makeup:
        await this.handleMakeupEffects(groupItem, beautyItem, currentIntensity, isEnabled);
        break;
        
      case BeautyType.Group_VirtualBackground:
        await this.handleBackgroundEffects(groupItem, beautyItem, currentIntensity, isEnabled);
        break;
        
      default:
        console.warn(`Unhandled group type: ${groupItem.type}`);
    }
  }

  // FEATURE: Xử lý basic effects
  async handleBasicEffects(beautyItem, currentIntensity, isEnabled) {
    switch (beautyItem.type) {
      case BeautyType.Beauty_Face:
        await this.effects.enableSmooth(isEnabled);
        if (isEnabled) {
          await this.effects.setSmoothParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Face_Whitening:
        await this.effects.enableWhiten(isEnabled);
        if (isEnabled) {
          await this.effects.setWhitenParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Rosy:
        await this.effects.enableRosy(isEnabled);
        if (isEnabled) {
          await this.effects.setRosyParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Beauty_RemoveAce:
        await this.effects.enableAcneRemoving(isEnabled);
        if (isEnabled) {
          await this.effects.setAcneRemovingParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Beauty_Clarity:
        await this.effects.enableClarity(isEnabled);
        if (isEnabled) {
          await this.effects.setClarityParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Sharpen:
        await this.effects.enableSharpen(isEnabled);
        if (isEnabled) {
          await this.effects.setSharpenParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Teeth_Whitening:
        await this.effects.enableTeethWhitening(isEnabled);
        if (isEnabled) {
          await this.effects.setTeethWhiteningParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Eye_Bright:
        await this.effects.enableEyesBrightening(isEnabled);
        if (isEnabled) {
          await this.effects.setEyesBrighteningParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Naso_Fold_Erase:
        await this.effects.enableWrinklesRemoving(isEnabled);
        if (isEnabled) {
          await this.effects.setWrinklesRemovingParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Dark_Circle_Erase:
        await this.effects.enableDarkCirclesRemoving(isEnabled);
        if (isEnabled) {
          await this.effects.setDarkCirclesRemovingParam({ intensity: currentIntensity });
        }
        break;
        
      // FEATURE: Face shaping effects
      case BeautyType.Face_Lifting:
        await this.effects.enableFaceLifting(isEnabled);
        if (isEnabled) {
          await this.effects.setFaceLiftingParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Big_Eyes:
        await this.effects.enableBigEyes(isEnabled);
        if (isEnabled) {
          await this.effects.setBigEyesParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Thin_Nose:
        await this.effects.enableNoseNarrowing(isEnabled);
        if (isEnabled) {
          await this.effects.setNoseNarrowingParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Small_Mouth:
        await this.effects.enableSmallMouth(isEnabled);
        if (isEnabled) {
          await this.effects.setSmallMouthParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Long_Chin:
        await this.effects.enableLongChin(isEnabled);
        if (isEnabled) {
          await this.effects.setLongChinParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Stretch_ForeHead:
        await this.effects.enableForeheadShortening(isEnabled);
        if (isEnabled) {
          await this.effects.setForeheadShorteningParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Thin_Jaw:
        await this.effects.enableMandibleSlimming(isEnabled);
        if (isEnabled) {
          await this.effects.setMandibleSlimmingParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Thin_Cheek:
        await this.effects.enableCheekboneSlimming(isEnabled);
        if (isEnabled) {
          await this.effects.setCheekboneSlimmingParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Small_Face:
        await this.effects.enableFaceShortening(isEnabled);
        if (isEnabled) {
          await this.effects.setFaceShorteningParam({ intensity: currentIntensity });
        }
        break;
        
      case BeautyType.Facial_Long_Nose:
        await this.effects.enableNoseLengthening(isEnabled);
        if (isEnabled) {
          await this.effects.setNoseLengtheningParam({ intensity: currentIntensity });
        }
        break;
        
      default:
        console.warn(`Unhandled basic effect: ${beautyItem.type}`);
    }
  }

  // FEATURE: Xử lý filter effects
  async handleFilterEffects(beautyItem, currentIntensity, isEnabled) {
    await this.effects.enableFilter(isEnabled);
    if (isEnabled && beautyItem.params) {
      await this.effects.setFilterParam({
        intensity: currentIntensity,
        type: beautyItem.params
      });
    }
  }

  // FEATURE: Xử lý makeup effects
  async handleMakeupEffects(groupItem, beautyItem, currentIntensity, isEnabled) {
    switch (groupItem.type) {
      case BeautyType.Makeup_Lipstick:
        await this.effects.enableLipstick(isEnabled);
        if (isEnabled && beautyItem.params) {
          await this.effects.setLipstickParam({
            intensity: currentIntensity,
            type: beautyItem.params
          });
        }
        break;
        
      case BeautyType.Makeup_Blusher:
        await this.effects.enableBlusher(isEnabled);
        if (isEnabled && beautyItem.params) {
          await this.effects.setBlusherParam({
            intensity: currentIntensity,
            type: beautyItem.params
          });
        }
        break;
        
      case BeautyType.Makeup_Eyeball:
        await this.effects.enableColoredcontacts(isEnabled);
        if (isEnabled && beautyItem.params) {
          await this.effects.setColoredcontactsParam({
            intensity: currentIntensity,
            type: beautyItem.params
          });
        }
        break;
        
      default:
        console.warn(`Unhandled makeup effect: ${groupItem.type}`);
    }
  }

  // FEATURE: Xử lý background effects  
  async handleBackgroundEffects(groupItem, beautyItem, currentIntensity, isEnabled) {
    switch (beautyItem.type) {
      case BeautyType.AI_Segment:
        await this.effects.enablePortraitSegmentation(isEnabled);
        break;
        
      case BeautyType.ChromaKey:
        await this.effects.enableChromaKey(isEnabled);
        break;
        
      case BeautyType.Background_Blur:
        await this.effects.enablePortraitSegmentationBackgroundBlur(isEnabled);
        await this.effects.enableChromaKeyBackgroundBlur(isEnabled);
        if (isEnabled) {
          await this.effects.setPortraitSegmentationBackgroundBlurParam({ intensity: currentIntensity });
          await this.effects.setChromaKeyBackgroundBlurParam({ intensity: currentIntensity });
        }
        break;
        
      default:
        console.warn(`Unhandled background effect: ${beautyItem.type}`);
    }
  }

  // FUNCTIONALITY: Kiểm tra trạng thái
  isReady() {
    return this.isInitialized && this.effects !== null;
  }

  // FUNCTIONALITY: Lấy instance effects
  getEffects() {
    return this.effects;
  }
}

// NOTE: Export singleton instance
export default new EffectsHelper();