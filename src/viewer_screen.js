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
import { MESSAGE_TYPES, QUICK_REACTIONS } from './contants';

// UI/UX: Component màn hình xem stream
const ViewerScreen = ({ 
  roomID,
  viewerCount,
  messages,
  showChatInput,
  chatInput,
  onToggleChatInput,
  onChatInputChange,
  onSendMessage,
  onSendQuickReaction,
  onEndStream,
  viewerStreamRef
}) => {

  const chatInputRef = useRef(null);

  // FUNCTIONALITY: Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      onSendMessage();
      Keyboard.dismiss();
    }
  };

  // FEATURE: Render quick reaction buttons
  const renderQuickReactions = () => (
    <View style={styles.viewerControls}>
      {QUICK_REACTIONS.slice(0, 4).map((emoji, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.reactionButton}
          onPress={() => onSendQuickReaction(emoji)}
          activeOpacity={0.7}
        >
          <Text style={styles.reactionText}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // FEATURE: Render extended reactions (có thể swipe để xem thêm)
  const renderExtendedReactions = () => (
    <View style={styles.extendedReactionsContainer}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.extendedReactions}
      >
        {QUICK_REACTIONS.map((emoji, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.extendedReactionButton}
            onPress={() => onSendQuickReaction(emoji)}
            activeOpacity={0.7}
          >
            <Text style={styles.extendedReactionText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

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

  // FEATURE: Render viewer stats (có thể thêm thống kê cho viewer)
  const renderViewerStats = () => (
    <View style={styles.viewerStatsContainer}>
      <View style={styles.viewerStat}>
        <Text style={styles.viewerStatIcon}>👥</Text>
        <Text style={styles.viewerStatText}>{viewerCount}</Text>
      </View>
      
      <View style={styles.viewerStat}>
        <Text style={styles.viewerStatIcon}>💬</Text>
        <Text style={styles.viewerStatText}>{messages.length}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.streamContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.videoContainer}>
        {/* FEATURE: Video stream */}
        <ZegoTextureView 
          ref={viewerStreamRef} 
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

        {/* FEATURE: Quick reaction buttons */}
        {renderQuickReactions()}

        {/* FEATURE: Extended reactions (swipeable) */}
        {renderExtendedReactions()}

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

        {/* FEATURE: Viewer stats */}
        {renderViewerStats()}

        {/* FEATURE: Floating action buttons */}
        <View style={styles.floatingActions}>
          {/* TODO: Thêm nút share stream */}
          <TouchableOpacity 
            style={styles.floatingActionButton}
            onPress={() => {
              // TODO: Implement share functionality
              console.log('Share stream');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingActionText}>📤</Text>
          </TouchableOpacity>

          {/* TODO: Thêm nút follow streamer */}
          <TouchableOpacity 
            style={styles.floatingActionButton}
            onPress={() => {
              // TODO: Implement follow functionality
              console.log('Follow streamer');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingActionText}>➕</Text>
          </TouchableOpacity>
        </View>

        {/* FEATURE: Stream quality indicator */}
        <View style={styles.qualityIndicator}>
          <View style={styles.qualityDot} />
          <Text style={styles.qualityText}>HD</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ViewerScreen;