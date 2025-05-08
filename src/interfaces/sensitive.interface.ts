export interface SensitiveModuleOptions {
  encryptionKey: string;
  isGlobal?: boolean;
}

export interface SensitiveModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<SensitiveModuleOptions> | SensitiveModuleOptions;
  inject?: any[];
  imports?: any[];
  isGlobal?: boolean;
}
