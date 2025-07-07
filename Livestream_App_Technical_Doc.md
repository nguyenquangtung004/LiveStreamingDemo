
# 📄 Tài liệu Kỹ Thuật Livestream App (React Native + ZegoExpressEngine)

## 1. Tổng Quan Công Nghệ

- **Ngôn ngữ:** JavaScript (React Native)
- **Thư viện chính:** `zego-express-engine-reactnative`
- **Tính năng chính:**
  - Livestream (phát và xem video)
  - Chat realtime
  - Điều khiển camera, microphone, filter (hiệu ứng)
  - Quản lý số người xem (viewer count)
  - Tương tác nhanh (reaction emoji)
  - Giao diện style TikTok (UI/UX)

---

## 2. Các Thành Phần & Luồng Hoạt Động Cốt Lõi

### ✅ 1. Khởi Tạo & Cấu Hình ZegoExpressEngine

```js
await ZegoExpressEngine.createEngineWithProfile(profile);
```

- Thiết lập engine với:
  - `appID`
  - `appSign`
  - `scenario: ZegoScenario.General`
- **Nếu không có bước này → Livestream, Chat, Video KHÔNG hoạt động.**

---

### ✅ 2. Đăng Nhập Phòng Livestream (loginRoom)

```js
ZegoExpressEngine.instance().loginRoom(roomID, {
  userID,
  userName
});
```

- Giúp user tham gia phòng livestream.
- Bắt buộc cho:
  - Broadcaster (người phát)
  - Viewer (người xem)

---

### ✅ 3. Bắt Đầu Phát Video hoặc Xem Video

#### Broadcaster:

```js
ZegoExpressEngine.instance().startPublishingStream(streamID);
```

#### Viewer:

```js
ZegoExpressEngine.instance().startPlayingStream(streamID, { ... });
```

- Giúp user phát hoặc xem video livestream.

---

### ✅ 4. Lắng Nghe Sự Kiện Realtime (Event Listeners)

```js
ZegoExpressEngine.instance().on('roomStateUpdate', ...);
ZegoExpressEngine.instance().on('IMRecvBroadcastMessage', ...);
ZegoExpressEngine.instance().on('roomUserUpdate', ...);
```

- Theo dõi:
  - Trạng thái phòng (kết nối, lỗi)
  - Tin nhắn chat realtime
  - Số lượng người trong phòng

---

### ✅ 5. Video View (Hiển Thị Video Livestream)

```js
<ZegoTextureView ref={this.broadcasterViewRef} style={styles.fullScreenVideo} />
```

- Hiển thị video livestream từ camera hoặc stream.

---

### ✅ 6. Các Nút Điều Khiển Livestream (Mic, Camera, Filter, Chat)

```js
this.toggleMicrophone();
this.toggleCamera();
this.toggleBeautyFilter();
this.sendMessage();
```

- Chức năng tương tác livestream:
  - Bật/Tắt microphone, camera
  - Bật/Tắt filter (hiệu ứng)
  - Chat
  - Chuyển camera trước/sau

---

### ✅ 7. Kết Thúc Livestream / Rời Phòng

```js
ZegoExpressEngine.instance().logoutRoom(this.state.roomID);
```

- Dừng livestream, dọn dẹp tài nguyên khi rời phòng.

---

### ✅ 8. UI TikTok Style

- UI gần gũi TikTok, dễ sử dụng:
  - Chat overlay
  - Viewer Count
  - Reaction Buttons
  - Room Info Bar
  - Chat Input

---

## 3. Tóm Tắt Các Phần Cốt Lõi

| Phần              | Mô tả                        |
| ----------------- | ---------------------------- |
| Khởi tạo Engine   | Nền tảng hoạt động của app   |
| Đăng nhập phòng   | Cho user tham gia livestream |
| Phát / Xem video  | Hoạt động livestream chính   |
| Lắng nghe sự kiện | Giữ trạng thái realtime      |
| Video View        | Hiển thị video               |
| Nút điều khiển    | Tương tác livestream         |
| Thoát phòng       | Kết thúc an toàn             |

---

## 4. Gợi Ý:

- Nếu muốn đọc nhanh code:
  - Tập trung các hàm:
    - `setupZegoEngine`
    - `loginRoom`, `startPublishingStream`, `startPlayingStream`
    - `setupEventListeners`
    - `toggleMicrophone`, `toggleCamera`, `sendMessage`
  - Các hàm `render*Screen` để hiểu flow UI

---
