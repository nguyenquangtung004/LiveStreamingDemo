// FIXME: Cập nhật cách sử dụng refs theo React Native hiện đại
import React, { Component, createRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Button,
  Text,
  StatusBar,
  findNodeHandle,
  PermissionsAndroid,
  Platform
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
// NOTE: Developers có thể lấy appID từ admin console tại https://console.zego.im/dashboard
const appID = 1359832122;

// CONFIG: Tùy chỉnh user ID
const userID = 'zego_demo';

// SECURITY: AppSign chỉ đáp ứng yêu cầu xác thực đơn giản
// NOTE: Nếu cần nâng cấp bảo mật, tham khảo Token authentication
const appSign = '5b11b51bd04571706a6ce9d42a7758de13dee90cb6959b09dc46076d1c068c30';

// FIXME: Thêm component Header bị thiếu
const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Zego Express Engine Demo</Text>
  </View>
);

// FIXME: Định nghĩa Colors object để thay thế Colors từ react-native
const Colors = {
  black: '#000000',
  dark: '#333333',
  light: '#ffffff',
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#f0f0f0'
};

export default class App extends Component {

  constructor(props) {
    super(props);
    
    // NOTE: Khởi tạo state và biến instance
    this.version = "";
    this.mediaPlayer = null;
    
    // FIXME: Sử dụng createRef() thay vì string refs
    this.zegoPreviewViewRef = createRef();
    this.zegoPlayViewRef = createRef();
    this.zegoMediaViewRef = createRef();
  }

  // FUNCTIONALITY: Xử lý kết nối phòng và bắt đầu streaming
  onClickA() {
    // NOTE: Đăng ký các event listener cho ZegoExpressEngine
    
    // DATABASE: Lắng nghe cập nhật trạng thái phòng
    ZegoExpressEngine.instance().on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
      console.log("JS onRoomStateUpdate: " + state + " roomID: " + roomID + " err: " + errorCode + " extendData: " + extendedData);
    });

    // FUNCTIONALITY: Xử lý tin nhắn broadcast
    ZegoExpressEngine.instance().on('IMRecvBroadcastMessage', (roomID, messageList) => {
      console.log("JS onIMRecvBroadcastMessage: " + " roomID: " + roomID + " messageList: " + messageList);
      // NOTE: Duyệt qua danh sách tin nhắn
      for (let msg of messageList) {
        console.log("current broadcast msg: message: " + msg.message + " messageID" + msg.messageID + " sendTime: " + msg.sendTime + " from user :" + msg.fromUser.userID + " x " + msg.fromUser.userName);
      }
    });

    // FUNCTIONALITY: Xử lý tin nhắn barrage (danmaku)
    ZegoExpressEngine.instance().on('IMRecvBarrageMessage', (roomID, messageList) => {
      console.log("JS onIMRecvBarrageMessage: " + " roomID: " + roomID);
      for (let msg of messageList) {
        console.log("current barrage msg: message: " + msg.message + " messageID" + msg.messageID + " sendTime: " + msg.sendTime + " from user :" + msg.fromUser.userID + " x " + msg.fromUser.userName);
      }
    });

    // FUNCTIONALITY: Xử lý lệnh tùy chỉnh
    ZegoExpressEngine.instance().on('IMRecvCustomCommand', (roomID, fromUser, command) => {
      console.log("JS onIMRecvCustomCommand: " + " roomID: " + roomID + " from user: " + fromUser.userID + " x " + fromUser.userName + " command: " + command);
    });

    // FUNCTIONALITY: Theo dõi trạng thái publisher
    ZegoExpressEngine.instance().on('publisherStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log("JS onPublisherStateUpdate: " + state + " streamID: " + streamID + " err: " + errorCode + " extendData: " + extendedData);
    });

    // FUNCTIONALITY: Theo dõi trạng thái player
    ZegoExpressEngine.instance().on('playerStateUpdate', (streamID, state, errorCode, extendedData) => {
      console.log("JS onPlayerStateUpdate: " + state + " streamID: " + streamID + " err: " + errorCode + " extendData: " + extendedData);
    });

    // PERFORMANCE: Theo dõi mức âm thanh mixer
    ZegoExpressEngine.instance().on('mixerSoundLevelUpdate', (soundLevels) => {
      var level = soundLevels[0];
      console.log("JS onMixerSoundLevelUpdate: " + soundLevels[0] + " type of: " + typeof level);
    });

    // FUNCTIONALITY: Theo dõi trạng thái CDN relay
    ZegoExpressEngine.instance().on('mixerRelayCDNStateUpdate', (taskID, infoList) => {
      console.log("JS onMixerRelayCDNStateUpdate: " + taskID);
      infoList.forEach((item) => {
        console.log("item: " + item.url + " ,state: " + item.state + " ,reason: " + item.updateReason, " ,time: " + item.stateTime);
      });
    });

    // FUNCTIONALITY: Thực hiện các thao tác streaming với refs mới
    ZegoExpressEngine.instance().loginRoom("9999", {"userID": userID, "userName": "zego"});
    
    // FIXME: Sử dụng current của ref để lấy node handle
    if (this.zegoPreviewViewRef.current) {
      ZegoExpressEngine.instance().startPreview({
        "reactTag": findNodeHandle(this.zegoPreviewViewRef.current), 
        "viewMode": 0, 
        "backgroundColor": 0
      });
    }
    
    ZegoExpressEngine.instance().startPublishingStream("333");
    
    if (this.zegoPlayViewRef.current) {
      ZegoExpressEngine.instance().startPlayingStream("333", {
        "reactTag": findNodeHandle(this.zegoPlayViewRef.current), 
        "viewMode": 0, 
        "backgroundColor": 0
      });
    }
  }

  // FUNCTIONALITY: Xử lý phát media từ URL
  onClickB() {
    ZegoExpressEngine.instance().createMediaPlayer().then((player) => {
      this.mediaPlayer = player;
      
      // UI/UX: Thiết lập view cho media player với ref mới
      if (this.zegoMediaViewRef.current) {
        this.mediaPlayer.setPlayerView({
          "reactTag": findNodeHandle(this.zegoMediaViewRef.current), 
          "viewMode": 0, 
          "backgroundColor": 0
        });
      }
      
      // NOTE: Lắng nghe sự kiện thay đổi trạng thái player
      this.mediaPlayer.on("mediaPlayerStateUpdate", (player, state, errorCode) => {
        console.log("media player state: " + state + " err: " + errorCode);
      });
      
      // PERFORMANCE: Theo dõi tiến trình phát
      this.mediaPlayer.on("mediaPlayerPlayingProgress", (player, millsecond) => {
        // DEBUG: Uncomment để debug progress
        // console.log("progress: " + millsecond);
      });
      
      // FUNCTIONALITY: Tải và phát media
      this.mediaPlayer.loadResource("https://storage.zego.im/demo/201808270915.mp4").then((ret) => {
        console.log("load resource err: " + ret.errorCode);
        this.mediaPlayer.start();

        // FEATURE: Xử lý audio track
        this.mediaPlayer.getAudioTrackCount().then((count) => {
          console.log(" get audio track count: " + count);
          this.mediaPlayer.setAudioTrackIndex(1);
        });
      });
    });
  }

  // FUNCTIONALITY: Gửi các loại tin nhắn khác nhau
  onClickC() {
    // NOTE: Gửi tin nhắn broadcast
    ZegoExpressEngine.instance().sendBroadcastMessage("9999", "test-boardcast-msg!!!!!!");
    
    // NOTE: Gửi tin nhắn barrage với callback
    ZegoExpressEngine.instance().sendBarrageMessage("9999", "test-danmaku-msg!!!!!!").then((ret) => {
      console.log("sendBarrageMessage: error: " + ret.errorCode + " message str: " + ret.messageID);
    });
    
    // NOTE: Gửi lệnh tùy chỉnh
    ZegoExpressEngine.instance().sendCustomCommand("9999", "testcommand?").then((ret) => {
      console.log("sendCustomCommand: error: " + ret.errorCode);
    });
  }

  // FUNCTIONALITY: Bắt đầu mixer task
  onClickD() {
    const task = new ZegoMixerTask('mix-stream-rn');
    
    // CONFIG: Cấu hình input và output cho mixer
    task.inputList = [{"streamID": "333", "contentType": ZegoMixerInputContentType.Video, "layout": {"x": 0, "y": 0, "width": 100, "height": 100}}];
    task.outputList = [{"target": "zzzz"}];
    
    console.log("task soundlevel: " + task.enableSoundLevel);
    
    ZegoExpressEngine.instance().startMixerTask(task).then((result) => {
      console.log("start mixer task, error: " + result.errorCode + " extended data: " + result.extendedData);
    });
  }

  // FUNCTIONALITY: Dừng mixer task
  onClickE() {
    const task = new ZegoMixerTask('mix-stream-rn');
    
    // CONFIG: Cấu hình cho việc dừng mixer (chỉ cần audio)
    task.inputList = [{"streamID": "333", "contentType": ZegoMixerInputContentType.Audio}];
    task.outputList = [{"target": "zzzz"}];
    
    ZegoExpressEngine.instance().stopMixerTask(task).then((result) => {
      console.log("stop mixer task, error: " + result.errorCode);
    });
  }

  // FUNCTIONALITY: Khởi tạo ZegoExpressEngine khi component mount
  componentDidMount() {
    console.log("componentDidMount");
    
    // CONFIG: Cấu hình profile cho engine
    let profile = {appID: appID, appSign: appSign, scenario: ZegoScenario.General};
    
    ZegoExpressEngine.createEngineWithProfile(profile).then((engine) => {
      // SECURITY: Yêu cầu quyền truy cập camera và microphone cho Android
      if(Platform.OS == 'android') {
        granted.then((data) => {
          console.log("Đã có quyền camera và microphone: " + data);
          if(!data) {
            const permissions = [
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
              PermissionsAndroid.PERMISSIONS.CAMERA
            ];
            // NOTE: Yêu cầu nhiều quyền cùng lúc
            PermissionsAndroid.requestMultiple(permissions);
          }
        }).catch((err) => {
          console.log("Lỗi kiểm tra quyền: " + err.toString());
        });
      }

      // LOGGING: Lấy và log phiên bản SDK
      engine.getVersion().then((ver) => {
        console.log("Express SDK Version: " + ver);
      });
    });
  }

  // FUNCTIONALITY: Cleanup khi component unmount
  componentWillUnmount() {
    console.log('componentWillUnmount');
    
    // NOTE: Cleanup engine instance
    if(ZegoExpressEngine.instance()) {
      console.log('[LZP] destroyEngine');
      ZegoExpressEngine.destroyEngine();
    }
  }

  // UI/UX: Render giao diện chính
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />

            <View style={styles.body}>
              {/* FEATURE: Nút bắt đầu streaming */}
              <View style={styles.sectionContainer}>
                <Button 
                  onPress={this.onClickA.bind(this)}
                  title="Nhấn để bắt đầu phát và thu stream"
                  color={Colors.primary}
                />
              </View>

              {/* UI/UX: Hiển thị preview local */}
              <Text style={styles.sectionTitle}>Xem trước cục bộ</Text>
              <View style={styles.videoContainer}>
                <ZegoTextureView 
                  ref={this.zegoPreviewViewRef} 
                  style={styles.videoView}
                />
              </View>

              {/* UI/UX: Hiển thị remote stream */}
              <Text style={styles.sectionTitle}>Thu stream từ xa</Text>
              <View style={styles.videoContainer}>
                <ZegoTextureView 
                  ref={this.zegoPlayViewRef} 
                  style={styles.videoView}
                />
              </View>

              {/* FEATURE: Nút phát media */}
              <View style={styles.sectionContainer}>
                <Button 
                  onPress={this.onClickB.bind(this)}
                  title="Nhấn để phát media từ mạng"
                  color={Colors.secondary}
                />
              </View>

              {/* UI/UX: Hiển thị media player */}
              <View style={styles.videoContainer}>
                <ZegoTextureView 
                  ref={this.zegoMediaViewRef} 
                  style={styles.videoView}
                />
              </View>

              {/* FEATURE: Các nút chức năng khác */}
              <View style={styles.buttonContainer}>
                <Button 
                  onPress={this.onClickC.bind(this)}
                  title="Nhấn để gửi tin nhắn IM"
                  color={Colors.dark}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button 
                  onPress={this.onClickD.bind(this)}
                  title="Nhấn để bắt đầu trộn stream"
                  color={Colors.primary}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button 
                  onPress={this.onClickE.bind(this)}
                  title="Nhấn để dừng trộn stream"
                  color={Colors.secondary}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

// UI/UX: Định nghĩa styles cho components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    backgroundColor: Colors.background,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light,
  },
  body: {
    backgroundColor: Colors.background,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 20,
    marginLeft: 24,
    marginBottom: 10,
  },
  videoContainer: {
    height: 200,
    marginHorizontal: 24,
    backgroundColor: Colors.dark,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoView: {
    height: 200,
    width: '100%',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});