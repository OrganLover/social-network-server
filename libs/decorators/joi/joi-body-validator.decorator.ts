import { Body } from '@nestjs/common';
import { Schema } from 'joi';
import JoiValidationPipe from 'libs/pipes/joi/joi-validation/joi-validation.pipe';

export default (schema: Schema) => {
  return Body(new JoiValidationPipe(schema));
};
