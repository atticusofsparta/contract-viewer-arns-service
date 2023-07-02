import { TX_ID_REGEX } from "./constants";

export interface ArweaveWalletConnector {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getWalletAddress(): Promise<ArweaveTransactionID>;
  }

  export interface ArweaveDataProvider {
    // add isAddress method
    getTransactionStatus(id: ArweaveTransactionID): Promise<number>;
    getTransactionTags(
      id: ArweaveTransactionID,
    ): Promise<{ [x: string]: string }>;
    validateTransactionTags(params: {
      id: string;
      requiredTags?: {
        [x: string]: string[] | ArweaveTransactionID[]; // allowed values
      };
    }): Promise<void>;
    validateArweaveId(id: string): Promise<ArweaveTransactionID>;
    validateConfirmations(
      id: string,
      numberOfConfirmations?: number,
    ): Promise<void>;
    validateArweaveAddress(address: string): Promise<undefined | boolean>;
    getArBalance(wallet: ArweaveTransactionID): Promise<number>;
    getArPrice(data: number): Promise<number>;
    getCurrentBlockHeight(): Promise<number>;
  }
  
  export type TransactionHeaders = {
    id: string;
    signature: string;
    format: number;
    last_tx: string;
    owner: string;
    target: string;
    quantity: string;
    reward: string;
    data_size: string;
    data_root: string;
    tags: TransactionTag[];
  };




  export class ArweaveTransactionID implements Equatable<ArweaveTransactionID> {
    constructor(private readonly transactionId: string) {
      if (!TX_ID_REGEX.test(transactionId)) {
        throw new Error(
          'Transaction ID should be a 43-character, alphanumeric string potentially including "-" and "_" characters.',
        );
      }
    }
  
    [Symbol.toPrimitive](hint?: string): string {
      if (hint === 'number') {
        throw new Error('Transaction IDs cannot be interpreted as a number!');
      }
  
      return this.toString();
    }
  
    toString(): string {
      return this.transactionId;
    }
  
    equals(entityId: ArweaveTransactionID): boolean {
      return this.transactionId === entityId.transactionId;
    }
  }

export interface Equatable<T> {
    equals(other: T): boolean;
  }

  export type TransactionTag = {
    name: string;
    value: string;
  };