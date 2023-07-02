
import { TransactionTag } from '../types';
import { Buffer } from 'buffer';

export function fromB64Url(input: string): string {
  const decodedBuffer = Buffer.from(input, 'base64');
  return decodedBuffer.toString();
}


export function tagsToObject(tags: TransactionTag[]): {
  [x: string]: string;
} {
  return tags.reduce(
    (newTags, tag) => ({
      ...newTags,
      [fromB64Url(tag.name)]: fromB64Url(tag.value),
    }),
    {},
  );
}

export function byteSize(data: string): number {
  return Buffer.byteLength(data);
}
