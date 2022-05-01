import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async hashString(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compareString(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
