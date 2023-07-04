import {
  ArweaveTransactionID,
  Config,
  PDNSContractJSON,
  PDNTContractJSON,
} from './types';

export const TX_ID_REGEX = new RegExp('^[a-zA-Z0-9-_s+]{43}$');
export const RECOMMENDED_TRANSACTION_CONFIRMATIONS = 50;
export const RESERVED_NAME_LENGTH = 4; // names must be greater than 4 characters, in contract this is MINIMUM_ALLOWED_NAME_LENGTH = 5
export const PDNS_REGISTRY_ADDRESS =
  'GfrHPxXyfuxNNdGvzHl_5HFX711jZsG3OE8qmG-UqlY';

export const DEFAULT_ARNS_CONTRACT_IDS = [
  "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
  "GfrHPxXyfuxNNdGvzHl_5HFX711jZsG3OE8qmG-UqlY"
]

export const ARNS_SERVICE_URL = 'dev.arns.app';
export const DEFAULT_GATEWAY = 'arweave.net';

export const DEFAULT_TTL_SECONDS = 3600;
export const DEFAULT_MAX_UNDERNAMES = 100;

export const SMARTWEAVE_TAG_SIZE = 250; // required tag size in bytes

export const SMARTWEAVE_MAX_TAG_SPACE = 2048 - SMARTWEAVE_TAG_SIZE; // minimum tag size of smartweave tags from warp is 239, rounded it for wiggle room

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

export const DEFAULT_PDNT_CONTRACT_STATE: PDNTContractJSON = {
  balances: {},
  evolve: undefined,
  name: '',
  ticker: '',
  owner: '',
  controller: '',
  records: {
    '@': {
      transactionId: '',
      ttlSeconds: DEFAULT_TTL_SECONDS,
      maxUndernames: DEFAULT_MAX_UNDERNAMES,
    },
  },
};
export const DEFAULT_PDNS_REGISTRY_STATE: PDNSContractJSON = {
  records: {},
  fees: {},
  balances: { '': 0 },
  controllers: [],
  evolve: undefined,
  tiers: {
    history: [],
    current: [],
  },
  reserved: {},
  settings: {},
  name: '',
  owner: undefined,
  ticker: '',
  approvedANTSourceCodeTxs: [],
};

export const ATOMIC_FLAG = 'atomic';

export const ATOMIC_REGISTRATION_INPUT = {
  function: 'buyRecord',
  name: '',
  contractTxId: ATOMIC_FLAG,
};

export const DEFAULT_CONFIG: Config = {
  gateway: 'arweave.net',
  serviceUrl: ARNS_SERVICE_URL,
  blockHeightRefreshRate: 120_000,
  walletBalanceRefreshRate: 120_000,
  arnsRegistryContractId: PDNS_REGISTRY_ADDRESS,
  arnsRegistrySrcCodeId: undefined,
  nameTokenSrcCodeIds: undefined,
}
