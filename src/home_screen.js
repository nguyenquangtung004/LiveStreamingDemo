// DEPENDENCY: Import React và components
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import styles, { Colors } from './TikTokLiveStreamStyles';

// UI/UX: Component màn hình chính
const HomeScreen = ({ 
  userName, 
  roomID, 
  onUserNameChange, 
  onRoomIDChange, 
  onCreateRoom, 
  onJoinRoom 
}) => {

  // FUNCTIONALITY: Xử lý tạo phòng mới
  const handleCreateRoom = () => {
    if (!userName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn');
      return;
    }
    onCreateRoom();
  };

  // FUNCTIONALITY: Xử lý tham gia phòng
  const handleJoinRoom = () => {
    if (!roomID.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập ID phòng');
      return;
    }
    
    if (!userName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn');
      return;
    }

    onJoinRoom();
  };

  return (
    <View style={styles.homeContainer}>
      {/* FEATURE: Logo và tiêu đề */}
      <View style={styles.logoContainer}>
        <Text style={styles.appTitle}>📱 Live Stream</Text>
        <Text style={styles.appSubtitle}>Phát sóng trực tiếp như TikTok</Text>
      </View>

      {/* FEATURE: Form nhập thông tin */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên của bạn"
          placeholderTextColor={Colors.textLight}
          value={userName}
          onChangeText={onUserNameChange}
          maxLength={50}
          autoCapitalize="words"
          returnKeyType="next"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nhập ID phòng để xem (tùy chọn)"
          placeholderTextColor={Colors.textLight}
          value={roomID}
          onChangeText={onRoomIDChange}
          keyboardType="numeric"
          maxLength={6}
          returnKeyType="done"
        />
      </View>

      {/* FEATURE: Các nút hành động */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleCreateRoom}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>🎥 Bắt đầu phát sóng</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleJoinRoom}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>👁️ Xem live stream</Text>
        </TouchableOpacity>
      </View>

      {/* FEATURE: Thông tin hướng dẫn */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 Để phát sóng: Nhập tên và nhấn "Bắt đầu phát sóng"
        </Text>
        <Text style={styles.infoText}>
          👀 Để xem: Nhập tên, ID phòng và nhấn "Xem live stream"
        </Text>
        
        {/* NOTE: Thêm tips sử dụng */}
        <Text style={styles.infoText}>
          🎯 Tips: Tên nên từ 2-20 ký tự, tránh ký tự đặc biệt
        </Text>
      </View>

      {/* FEATURE: Footer với thông tin phiên bản */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          ✨ Hỗ trợ beauty filters & real-time chat
        </Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
};

export default HomeScreen;