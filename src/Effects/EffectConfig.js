import {
    ZegoEffectsBlusherType,
    ZegoEffectsSkinColorType,
    ZegoEffectsColoredcontactsType,
    ZegoEffectsEyelashesType,
    ZegoEffectsEyelinerType,
    ZegoEffectsEyeshadowType,
    ZegoEffectsFilterType,
    ZegoEffectsLipstickType,
    ZegoEffectsMakeupType,
    ZegoEffectsMosaicType
} from '@zegocloud/zego-effects-reactnative'

// FEATURE: Interface định nghĩa BeautyItem
export class BeautyItem {
  constructor(type, name, items = null, params = null, intensity = 50, range = [0, 100]) {
    this.type = type;
    this.name = name;
    this.items = items;
    this.params = params;
    this.intensity = intensity;
    this.range = range;
  }
}

// CONFIG: Enum định nghĩa các loại beauty effects
export const BeautyType = {
  // Nhóm cơ bản
  Type_Group: 0,
  Face_Whitening: 1,
  Rosy: 2,
  Beauty_Face: 3,
  Sharpen: 4,
  Teeth_Whitening: 5,
  Eye_Bright: 6,
  Naso_Fold_Erase: 7,
  Dark_Circle_Erase: 8,
  
  // Nhóm beauty
  Face_Lifting: 9,
  Facial_Small_Mouth: 10,
  Facial_Long_Chin: 11,
  Big_Eyes: 12,
  Facial_Thin_Nose: 13,
  Facial_Stretch_ForeHead: 14,
  Facial_Thin_Jaw: 15,
  Facial_Thin_Cheek: 16,
  Facial_Small_Face: 17,
  Facial_Long_Nose: 18,
  
  // Nhóm filter
  Colorful_Style: 19,
  
  // Nhóm background
  Group_VirtualBackground: 20,
  Background: 21,
  AI_Segment: 22,
  ChromaKey: 23,
  Background_Mosaic: 24,
  Mosaic_Triangle: 25,
  Mosaic_Square: 26,
  Mosaic_Hexagon: 27,
  Background_Blur: 28,
  
  // Các filter cụ thể
  Filter_Natural_Creamy: 38,
  Filter_Natural_Brighten: 39,
  Filter_Natural_Fresh: 40,
  Filter_Natural_Autumn: 41,
  Filter_Gray_Monet: 42,
  Filter_Gray_Night: 43,
  Filter_Gray_FilmLike: 44,
  Filter_Dream_Sunset: 45,
  Filter_Dream_Cozily: 46,
  Filter_Dream_Sweet: 47,
  
  // Makeup
  Beautiful_Makeup: 48,
  Makeup_Lipstick: 49,
  Makeup_Blusher: 55,
  Makeup_Eyeball: 61,
  Makeup_Eyeshadow: 67,
  Makeup_Eyeliner: 73,
  Makeup_Eyelash: 79,
  Makeup_Total: 85,
  
  // Skin effects  
  Beauty_RemoveAce: 91,
  Skin_Color: 92,
  Beauty_Clarity: 98
};

// CONFIG: Cấu hình beauty effects đầy đủ
const EffectsConfig = [
  {
    type: BeautyType.Type_Group,
    name: "Cơ bản",
    items: [
      {
        type: BeautyType.Beauty_Face,
        name: "Làm mịn da",
        intensity: 70,
        range: [0, 100]
      },
      {
        type: BeautyType.Beauty_RemoveAce,
        name: "Loại bỏ mụn",
        intensity: 80,
        range: [0, 100]
      },
      {
        type: BeautyType.Beauty_Clarity,
        name: "Độ rõ nét",
        intensity: 30,
        range: [0, 100]
      },
      {
        type: BeautyType.Face_Whitening,
        name: "Làm trắng da",
        intensity: 60,
        range: [0, 100]
      },
      {
        type: BeautyType.Rosy,
        name: "Hồng hào",
        intensity: 40,
        range: [0, 100]
      },
      {
        type: BeautyType.Sharpen,
        name: "Sắc nét",
        intensity: 50,
        range: [0, 100]
      },
      {
        type: BeautyType.Teeth_Whitening,
        name: "Trắng răng",
        intensity: 70,
        range: [0, 100]
      },
      {
        type: BeautyType.Eye_Bright,
        name: "Sáng mắt",
        intensity: 60,
        range: [0, 100]
      },
      {
        type: BeautyType.Naso_Fold_Erase,
        name: "Xóa nếp nhăn",
        intensity: 80,
        range: [0, 100]
      },
      {
        type: BeautyType.Dark_Circle_Erase,
        name: "Xóa quầng mắt",
        intensity: 70,
        range: [0, 100]
      }
    ]
  },
  {
    type: BeautyType.Type_Group,
    name: "Chỉnh sửa khuôn mặt",
    items: [
      {
        type: BeautyType.Face_Lifting,
        name: "Thu gọn mặt",
        intensity: 50,
        range: [0, 100]
      },
      {
        type: BeautyType.Big_Eyes,
        name: "To mắt",
        intensity: 40,
        range: [0, 100]
      },
      {
        type: BeautyType.Facial_Thin_Nose,
        name: "Thon gọn mũi",
        intensity: 30,
        range: [0, 100]
      },
      {
        type: BeautyType.Facial_Small_Mouth,
        name: "Nhỏ miệng",
        intensity: 20,
        range: [-100, 100]
      },
      {
        type: BeautyType.Facial_Long_Chin,
        name: "Dài cằm",
        intensity: 0,
        range: [-100, 100]
      },
      {
        type: BeautyType.Facial_Stretch_ForeHead,
        name: "Chỉnh trán",
        intensity: 0,
        range: [-100, 100]
      },
      {
        type: BeautyType.Facial_Thin_Jaw,
        name: "Thon hàm",
        intensity: 40,
        range: [0, 100]
      },
      {
        type: BeautyType.Facial_Thin_Cheek,
        name: "Thon má",
        intensity: 30,
        range: [0, 100]
      },
      {
        type: BeautyType.Facial_Small_Face,
        name: "Nhỏ mặt",
        intensity: 35,
        range: [0, 100]
      },
      {
        type: BeautyType.Facial_Long_Nose,
        name: "Dài mũi",
        intensity: 0,
        range: [-100, 100]
      }
    ]
  },
  {
    type: BeautyType.Colorful_Style,
    name: "Bộ lọc",
    items: [
      {
        type: BeautyType.Filter_Natural_Creamy,
        name: "Tự nhiên - Kem",
        intensity: 60,
        params: ZegoEffectsFilterType.Creamy
      },
      {
        type: BeautyType.Filter_Natural_Brighten,
        name: "Tự nhiên - Sáng",
        intensity: 50,
        params: ZegoEffectsFilterType.Brighten
      },
      {
        type: BeautyType.Filter_Natural_Fresh,
        name: "Tự nhiên - Tươi",
        intensity: 55,
        params: ZegoEffectsFilterType.Fresh
      },
      {
        type: BeautyType.Filter_Natural_Autumn,
        name: "Tự nhiên - Thu",
        intensity: 45,
        params: ZegoEffectsFilterType.Autumn
      },
      {
        type: BeautyType.Filter_Gray_Monet,
        name: "Xám - Monet",
        intensity: 70,
        params: ZegoEffectsFilterType.Cool
      },
      {
        type: BeautyType.Filter_Gray_Night,
        name: "Xám - Đêm",
        intensity: 65,
        params: ZegoEffectsFilterType.Night
      },
      {
        type: BeautyType.Filter_Dream_Sunset,
        name: "Mơ mộng - Hoàng hôn",
        intensity: 60,
        params: ZegoEffectsFilterType.Sunset
      },
      {
        type: BeautyType.Filter_Dream_Sweet,
        name: "Mơ mộng - Ngọt ngào",
        intensity: 55,
        params: ZegoEffectsFilterType.Sweet
      }
    ]
  },
  {
    type: BeautyType.Beautiful_Makeup,
    name: "Trang điểm",
    items: [
      {
        type: BeautyType.Makeup_Lipstick,
        name: "Son môi",
        intensity: 80,
        items: [
          {
            type: BeautyType.Makeup_Lipstick,
            name: "Hồng đào",
            params: ZegoEffectsLipstickType.CameoPink
          },
          {
            type: BeautyType.Makeup_Lipstick,
            name: "San hô",
            params: ZegoEffectsLipstickType.Coral
          },
          {
            type: BeautyType.Makeup_Lipstick,
            name: "Đỏ nhung",
            params: ZegoEffectsLipstickType.RedVelvet
          },
          {
            type: BeautyType.Makeup_Lipstick,
            name: "Cam ngọt",
            params: ZegoEffectsLipstickType.SweetOrange
          }
        ]
      },
      {
        type: BeautyType.Makeup_Blusher,
        name: "Má hồng",
        intensity: 70,
        items: [
          {
            type: BeautyType.Makeup_Blusher,
            name: "Đào",
            params: ZegoEffectsBlusherType.Peach
          },
          {
            type: BeautyType.Makeup_Blusher,
            name: "Cam sữa",
            params: ZegoEffectsBlusherType.MilkyOrange
          },
          {
            type: BeautyType.Makeup_Blusher,
            name: "Cam ngọt",
            params: ZegoEffectsBlusherType.SweetOrange
          }
        ]
      },
      {
        type: BeautyType.Makeup_Eyeball,
        name: "Kính áp tròng",
        intensity: 90,
        items: [
          {
            type: BeautyType.Makeup_Eyeball,
            name: "Đen ánh nước",
            params: ZegoEffectsColoredcontactsType.DarknightBlack
          },
          {
            type: BeautyType.Makeup_Eyeball,
            name: "Xanh sao",
            params: ZegoEffectsColoredcontactsType.StarryBlue
          },
          {
            type: BeautyType.Makeup_Eyeball,
            name: "Nâu chocolate",
            params: ZegoEffectsColoredcontactsType.ChocolateBrown
          }
        ]
      }
    ]
  }
];
export default EffectsConfig;