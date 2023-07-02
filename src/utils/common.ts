import { Buffer } from 'buffer';
import { inRange } from 'lodash';
import { RESERVED_NAME_LENGTH } from '../constants';
import { TRANSACTION_TYPES, TransactionTag, ArweaveTransactionID, SmartWeaveActionInput, SmartWeaveActionTags } from '../types';

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


export function buildSmartweaveInteractionTags({
  contractId,
  input,
}: {
  contractId: ArweaveTransactionID;
  input: SmartWeaveActionInput;
}): TransactionTag[] {
  const tags: SmartWeaveActionTags = [
    {
      name: 'App-Name',
      value: 'SmartWeaveAction',
    },
    {
      name: 'Contract',
      value: contractId.toString(),
    },
    {
      name: 'Input',
      value: JSON.stringify(input),
    },
  ];
  return tags;
}

export function isDomainAuctionable({
  // https://ardrive.atlassian.net/wiki/spaces/ENGINEERIN/pages/706543688/PDNS+Auction+System+-+Technical+Requirements#Requirements
  domain,
  registrationType,
  reservedList,
}: {
  domain: string;
  registrationType: TRANSACTION_TYPES;
  reservedList: string[];
}): boolean {
  if (
    domain.length <= RESERVED_NAME_LENGTH || // if under 5 characters, auctionable
    (inRange(domain.length, RESERVED_NAME_LENGTH + 1, 12) &&
      registrationType === TRANSACTION_TYPES.BUY) || // if permabuying a name between 5 and 11 chars, auctionable
    reservedList.includes(domain) // all premium names are auctionable
  ) {
    return true;
  }

  return false;
}
