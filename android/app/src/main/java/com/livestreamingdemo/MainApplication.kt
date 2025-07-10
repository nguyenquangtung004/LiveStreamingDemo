package com.livestreamingdemo

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.livestreamingdemo.nativefilehelper.NativeFileHelperPackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
          // === PHẦN QUAN TRỌNG NHẤT LÀ ĐÂY ===
          override fun getPackages(): List<ReactPackage> {
              // 1. Lấy danh sách package mặc định từ autolinking
              val packages = PackageList(this).packages.toMutableList()

              // 2. Thêm package của bạn vào danh sách đó
              packages.add(NativeFileHelperPackage())

              // 3. Trả về danh sách đã hoàn chỉnh
              return packages
          }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
