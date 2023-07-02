import { ArweaveTransactionID } from './types';

export const TX_ID_REGEX = new RegExp('^[a-zA-Z0-9-_s+]{43}$');
export const RECOMMENDED_TRANSACTION_CONFIRMATIONS = 50;

export const transactionByOwnerQuery = (address: ArweaveTransactionID) => {
  const queryObject = {
    query: `
    { 
      transactions (
        owners:["${address.toString()}"]
        sort: HEIGHT_DESC,
        first: 1,
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            block {
              height
            }
          }
        }
      }
    }`,
  };
  return queryObject;
};
