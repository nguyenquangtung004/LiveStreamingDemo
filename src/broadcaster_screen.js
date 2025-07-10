// DEPENDENCY: Import React và components
import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { ZegoTextureView } from 'zego-express-engine-reactnative';
import styles, { Colors } from './TikTokLiveStreamStyles';
import { MESSAGE_TYPES } from './contants';
  // UI/UX: Component màn hình phát sóng
const BroadcasterScreen = ({ 
  roomID,
  viewerCount,
  messages,
  isMicEnabled,
  isCameraEnabled,
  isBeautyFilterOn,
  showBeautyPanel,
  showChatInput,
  chatInput,
  beautySettings,
  onToggleMicrophone,
  onToggleCamera,
  onSwitchCamera,
  onToggleBeautyFilter,
  onToggleBeautyPanel,
  onToggleChatInput,
  onChatInputChange,
  onSendMessage,
  onAdjustBeauty,
  onEndStream,
  broadcasterViewRef
}) => {

  const chatInputRef = useRef(null);

  // FUNCTIONALITY: Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      onSendMessage();
      Keyboard.dismiss();
    }
  };

  // FUNCTIONALITY: Render controls cho broadcaster
  const renderBroadcasterControls = () => (
    <View style={styles.broadcasterControls}>
      <View style={styles.primaryControls}>
        {/* FEATURE: Điều khiển mic */}
        <TouchableOpacity 
          style={[styles.controlButton, !isMicEnabled && styles.disabledButton]}
          onPress={onToggleMicrophone}
          activeOpacity={0.7}
        >
          <Text style={styles.controlIcon}>
            {isMicEnabled ? '🎤' : '🔇'}
          </Text>
        </TouchableOpacity>

        {/* FEATURE: Điều khiển camera */}
        <TouchableOpacity 
          style={[styles.controlButton, !isCameraEnabled && styles.disabledButton]}
          onPress={onToggleCamera}
          activeOpacity={0.7}
        >
          <Text style={styles.controlIcon}>
            {isCameraEnabled ? '📷' : '📷'}
          </Text>
        </TouchableOpacity>

        {/* FEATURE: Chuyển đổi camera */}
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={onSwitchCamera}
          activeOpacity={0.7}
        >
          <Text style={styles.controlIcon}>🔄</Text>
        </TouchableOpacity>

        {/* FEATURE: Beauty filter */}
        <TouchableOpacity 
          style={[styles.controlButton, isBeautyFilterOn && styles.activeButton]}
          onPress={onToggleBeautyFilter}
          activeOpacity={0.7}
        >
          <Text style={styles.controlIcon}>✨</Text>
        </TouchableOpacity>

        {/* FEATURE: Beauty settings */}
        {isBeautyFilterOn && (
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onToggleBeautyPanel}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // FEATURE: Render beauty settings panel
  const renderBeautyPanel = () => {
    if (!showBeautyPanel || !isBeautyFilterOn) return null;

    return (
      <View style={styles.beautyPanel}>
        <Text style={styles.beautyPanelTitle}>Cài đặt làm đẹp</Text>
        
        {/* FEATURE: Làm mịn da */}
        <View style={styles.beautySliderContainer}>
          <Text style={styles.beautySliderLabel}>
            Làm mịn da: {beautySettings.smoothIntensity}%
          </Text>
          <View style={styles.beautySlider}>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => onAdjustBeauty('smooth', Math.max(0, beautySettings.smoothIntensity - 10))}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sliderValue}>{beautySettings.smoothIntensity}</Text>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => onAdjustBeauty('smooth', Math.min(100, beautySettings.smoothIntensity + 10))}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURE: Làm trắng da */}
        <View style={styles.beautySliderContainer}>
          <Text style={styles.beautySliderLabel}>
            Làm trắng da: {beautySettings.whiteningIntensity}%
          </Text>
          <View style={styles.beautySlider}>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => onAdjustBeauty('whitening', Math.max(0, beautySettings.whiteningIntensity - 10))}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sliderValue}>{beautySettings.whiteningIntensity}</Text>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => onAdjustBeauty('whitening', Math.min(100, beautySettings.whiteningIntensity + 10))}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURE: Thu gọn mặt */}
        <View style={styles.beautySliderContainer}>
          <Text style={styles.beautySliderLabel}>
            Thu gọn mặt: {beautySettings.faceLiftingIntensity}%
          </Text>
          <View style={styles.beautySlider}>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => onAdjustBeauty('faceLifting', Math.max(0, beautySettings.faceLiftingIntensity - 10))}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sliderValue}>{beautySettings.faceLiftingIntensity}</Text>
            <TouchableOpacity 
              style={styles.sliderButton}
              onPress={() => onAdjustBeauty('faceLifting', Math.min(100, beautySettings.faceLiftingIntensity + 10))}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURE: Nút đóng panel */}
        <TouchableOpacity 
          style={styles.beautyCloseButton}
          onPress={onToggleBeautyPanel}
          activeOpacity={0.8}
        >
          <Text style={styles.beautyCloseButtonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // FEATURE: Render chat messages
  const renderChatMessages = () => (
    <View style={styles.chatOverlay}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        ref={ref => {
          if (ref && messages.length > 0) {
            ref.scrollToEnd({ animated: true });
          }
        }}
      >
        {messages.slice(-10).map((msg, index) => (
          <View key={index} style={[
            styles.chatMessage,
            msg.type === MESSAGE_TYPES.SYSTEM && styles.systemMessage,
            msg.type === MESSAGE_TYPES.REACTION && styles.reactionMessage
          ]}>
            <Text style={styles.chatText}>
              <Text style={[
                styles.chatUser, 
                msg.type === MESSAGE_TYPES.SYSTEM && styles.systemUser,
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
  );

  // FEATURE: Render chat input
  const renderChatInput = () => {
    if (!showChatInput) return null;

    return (
      <View style={styles.chatInputContainer}>
        <TextInput
          ref={chatInputRef}
          style={styles.chatInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={Colors.disabled}
          value={chatInput}
          onChangeText={onChatInputChange}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          maxLength={500}
          multiline={false}
          autoFocus={true}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.streamContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.videoContainer}>
        {/* FEATURE: Video preview */}
        <ZegoTextureView 
          ref={broadcasterViewRef} 
          style={styles.fullScreenVideo}
        />
        
        {/* FEATURE: Overlay thông tin trên cùng */}
        <View style={styles.overlayTop}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomIdText}>🔴 LIVE - ID: {roomID}</Text>
            <Text style={styles.viewerCountText}>👥 {viewerCount} người xem</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.endButton}
            onPress={onEndStream}
            activeOpacity={0.8}
          >
            <Text style={styles.endButtonText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* FEATURE: Chat overlay */}
        {renderChatMessages()}

        {/* FEATURE: Broadcaster controls */}
        {renderBroadcasterControls()}

        {/* FEATURE: Chat input */}
        {renderChatInput()}

        {/* FEATURE: Chat toggle button */}
        <TouchableOpacity 
          style={styles.chatToggleButton}
          onPress={onToggleChatInput}
          activeOpacity={0.8}
        >
          <Text style={styles.chatToggleText}>💬</Text>
        </TouchableOpacity>

        {/* FEATURE: Beauty settings panel */}
        {renderBeautyPanel()}
      </View>
    </KeyboardAvoidingView>
  );
};

export default BroadcasterScreen;