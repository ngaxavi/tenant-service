import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

import { BadRequestException } from './bad-request.exception';

@Injectable()
export class MongoPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    if (!isMongoId(value)) {
      throw new BadRequestException(metadata, 'must be ObjectId');
    }
    return value;
  }
}
