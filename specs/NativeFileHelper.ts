import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  copyAssetsToExternalCache(assetsRelativePath: string, destFolder: string): Promise<boolean>;
}



export default TurboModuleRegistry.getEnforcing<Spec>('NativeFileHelper');