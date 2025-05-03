export interface SensitiveModuleOptions {
  encryptionKey: string;
}

export interface SensitiveModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<SensitiveModuleOptions> | SensitiveModuleOptions;
  inject?: any[];
  imports?: any[];
}
