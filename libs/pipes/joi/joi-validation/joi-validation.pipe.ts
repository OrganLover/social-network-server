import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Schema } from 'joi';

import { ERROR_MESSAGE } from './joi-validation.constant';

export default class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  public async transform(value: any) {
    try {
      const result = await this.schema.validateAsync(value);

      return result;
    } catch (error) {
      throw new BadRequestException(undefined, {
        cause: error,
        description: error?.message ?? ERROR_MESSAGE.VALIDATION_ERROR,
      });
    }
  }
}
