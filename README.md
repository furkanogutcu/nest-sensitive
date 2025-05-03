# nest-sensitive

[![npm version](https://img.shields.io/npm/v/@furkanogutcu/nest-sensitive.svg)](https://www.npmjs.com/package/@furkanogutcu/nest-sensitive)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Secure encryption and decryption module for sensitive data in NestJS applications.

## Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

## Installation

```bash
npm install @furkanogutcu/nest-sensitive
```

or

```bash
yarn add @furkanogutcu/nest-sensitive
```

## Features

- Simple AES-256-GCM encryption and decryption for sensitive data
- Easy to integrate with NestJS applications
- Support for both synchronous and asynchronous module registration
- Securely encrypt and decrypt any serializable data

## Usage

### Basic Example

```typescript
import { Module } from '@nestjs/common';
import { SensitiveModule, SensitiveService } from '@furkanogutcu/nest-sensitive';

@Module({
  imports: [
    SensitiveModule.register({
      encryptionKey: 'your-32-character-encryption-key', // Must be 32 characters (256 bits)
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SensitiveModule } from '@furkanogutcu/nest-sensitive';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SensitiveModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get<string>('ENCRYPTION_KEY'),
      }),
    }),
  ],
})
export class AppModule {}
```

### Encrypting and Decrypting Data

```typescript
import { Injectable } from '@nestjs/common';
import { SensitiveService } from '@furkanogutcu/nest-sensitive';

@Injectable()
export class YourService {
  constructor(private readonly sensitiveService: SensitiveService) {}

  encryptSensitiveData(data: any): string {
    return this.sensitiveService.encrypt(data);
  }

  decryptSensitiveData(encryptedData: string): any {
    return this.sensitiveService.decrypt(encryptedData);
  }
}
```

## Development

### Requirements

- Node.js 18+
- npm or yarn

### Getting Started

Clone the project

```bash
  git clone https://github.com/furkanogutcu/nest-sensitive.git
```

Go to the project directory

```bash
  cd nest-sensitive
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

## License

This project is licensed under the [MIT License](LICENSE).
