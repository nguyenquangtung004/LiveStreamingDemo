package com.livestreamingdemo.nativefilehelper

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
// QUAN TRỌNG: Thêm dòng import này
import com.facebook.react.module.model.ReactModuleInfo

class NativeFileHelperPackage : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == NativeFileHelperModule.NAME) {
            NativeFileHelperModule(reactContext)
        } else {
            null
        }
    }

    // Sửa lại hàm này cho đúng cú pháp của Turbo Package
    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos = mutableMapOf<String, ReactModuleInfo>()
            moduleInfos[NativeFileHelperModule.NAME] = ReactModuleInfo(
                NativeFileHelperModule.NAME,
                NativeFileHelperModule.NAME,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,   // hasConstants
                false,  // isCxxModule
                true    // isTurboModule
            )
            moduleInfos
        }
    }
}