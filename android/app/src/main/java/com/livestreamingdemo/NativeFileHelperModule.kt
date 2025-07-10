package com.livestreamingdemo.nativefilehelper

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
// QUAN TRỌNG: Import Spec từ package do codegen tạo ra
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

@ReactModule(name = NativeFileHelperModule.NAME)
class NativeFileHelperModule(private val reactContext: ReactApplicationContext) :
    // QUAN TRỌNG: Phải kế thừa từ Spec VÀ truyền reactContext vào constructor của nó
    NativeFileHelperSpec(reactContext) {

    override fun getName() = NAME

    override fun copyAssetsToExternalCache(assetsRelativePath: String, destFolder: String, promise: Promise) {
        try {
            val destDir = File(reactContext.externalCacheDir, destFolder)
            copyAssetFolderRecursive(assetsRelativePath, destDir)
            promise.resolve(true)
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject("COPY_ERROR", "Failed to copy assets: ${e.message}", e)
        }
    }

    @Throws(IOException::class)
    private fun copyAssetFolderRecursive(sourceAssetPath: String, destDir: File) {
        val assetManager = reactContext.assets
        val assets = assetManager.list(sourceAssetPath)
            ?: throw IOException("Asset path not found: $sourceAssetPath")

        if (!destDir.exists()) {
            destDir.mkdirs()
        }

        for (assetName in assets) {
            val newSourceAssetPath = if (sourceAssetPath.isEmpty()) assetName else "$sourceAssetPath/$assetName"
            val newDestFile = File(destDir, assetName)
            try {
                assetManager.open(newSourceAssetPath).use { inStream ->
                    FileOutputStream(newDestFile).use { outStream ->
                        inStream.copyTo(outStream)
                    }
                }
            } catch (e: IOException) {
                copyAssetFolderRecursive(newSourceAssetPath, newDestFile)
            }
        }
    }

    companion object {
        const val NAME = "NativeFileHelper"
    }
}