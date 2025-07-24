import { AppInternalException } from '@furkanogutcu/nest-common';
import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';

import { SENSITIVE_MODULE_OPTIONS } from './constants/sensitive.constants';
import { SensitiveModuleOptions } from './interfaces/sensitive.interface';

@Injectable()
export class SensitiveService {
  private readonly algorithm: crypto.CipherGCMTypes = 'aes-256-gcm';
  private readonly secretKey: string;
  private readonly ivLength = 16;

  constructor(@Inject(SENSITIVE_MODULE_OPTIONS) private readonly options: SensitiveModuleOptions) {
    this.secretKey = options.encryptionKey;
  }

  encrypt(input: any): string {
    if (input === null || input === undefined) {
      throw new AppInternalException({ message: 'Input cannot be null or undefined' });
    }

    const type = typeof input;
    const payload = { t: type, v: input };

    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv, {
      authTagLength: 16,
    });

    const encryptedText = Buffer.concat([
      cipher.update(JSON.stringify(payload)),
      cipher.final(),
      cipher.getAuthTag(),
    ]).toString('hex');

    return iv.toString('hex') + ':' + encryptedText;
  }

  decrypt(input: string): any {
    if (!input || input.length === 0) return '';

    const [ivHex, dataHex] = input.split(':');

    if (!ivHex || !dataHex) throw new AppInternalException({ message: 'Invalid input format' });

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedRawBuffer = Buffer.from(dataHex, 'hex');

    if (encryptedRawBuffer.length <= 16) throw new AppInternalException({ message: 'Invalid input length' });

    const authTagBuff = encryptedRawBuffer.subarray(encryptedRawBuffer.length - 16);
    const encTextBuff = encryptedRawBuffer.subarray(0, encryptedRawBuffer.length - 16);

    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv, {
      authTagLength: 16,
    });

    decipher.setAuthTag(authTagBuff);

    const decrypted = Buffer.concat([decipher.update(encTextBuff), decipher.final()]);
    const decryptedStr = decrypted.toString();

    let parsed: { t: string; v: any } = JSON.parse(decryptedStr);

    if (!parsed.t || !parsed.v) {
      throw new AppInternalException({ message: 'Invalid encrypted data.' });
    }

    switch (parsed.t) {
      case 'number':
        return Number(parsed.v);
      case 'boolean':
        return Boolean(parsed.v);
      case 'object':
        return parsed.v;
      case 'string':
        return String(parsed.v);
      default:
        return parsed.v;
    }
  }
}
