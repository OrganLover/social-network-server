import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { DataToEncode, DecodedData } from '../auth.interface';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  public async generateTokens(payload: DataToEncode) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '30m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  public async verifyToken(token: string): Promise<DecodedData> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
  }
}
