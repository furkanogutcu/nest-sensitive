import { DynamicModule, Module, Provider } from '@nestjs/common';

import { SENSITIVE_MODULE_OPTIONS } from './constants/sensitive.constants';
import { SensitiveModuleAsyncOptions } from './interfaces/sensitive.interface';
import { SensitiveModuleOptions } from './interfaces/sensitive.interface';
import { SensitiveService } from './sensitive.service';

@Module({})
export class SensitiveModule {
  static register(options: SensitiveModuleOptions): DynamicModule {
    return {
      module: SensitiveModule,
      providers: [
        {
          provide: SENSITIVE_MODULE_OPTIONS,
          useValue: options,
        },
        SensitiveService,
      ],
      exports: [SensitiveService],
    };
  }

  static registerAsync(options: SensitiveModuleAsyncOptions): DynamicModule {
    return {
      module: SensitiveModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), SensitiveService],
      exports: [SensitiveService],
    };
  }

  private static createAsyncProviders(options: SensitiveModuleAsyncOptions): Provider[] {
    return [
      {
        provide: SENSITIVE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }
}
