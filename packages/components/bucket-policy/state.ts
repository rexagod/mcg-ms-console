import { DataResourceType } from '../../constants';

export type ReplicationOBC = {
  obcName: string;
  targetBucket: string;
};

export type BucketPolicyState = {
  bucketName: string;
  dataResourceType: DataResourceType;
  readWriteSingle: string;
  cacheEnabled: boolean;
  readResourceMulti: string[];
  writeResourceMulti: string;
  obcNamespace: string;
  replicationOBC: ReplicationOBC[];
  inProgress: boolean;
  errorMessage: string;
};

export enum BucketPolicyActionType {
  SET_BUCKET_NAME = 'SET_BUCKET_NAME',
  SET_RESOURCE_TYPE = 'SET_RESOURCE_TYPE',
  SET_READ_WRITE_SINGLE = 'SET_READ_WRITE_SINGLE',
  SET_CACHE = 'SET_CACHE',
  SET_READ_MULTI = 'SET_READ_MULTI',
  SET_WRITE_MULTI = 'SET_WRITE_MULTI',
  SET_OBC_NAMESPACE = 'SET_OBC_NAMESPACE',
  SET_REPLICATION_OBC = 'SET_REPLICATION_OBC',
  SET_INPROGRESS = 'SET_INPROGRESS',
  SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE',
}

export const bucketPolicyInitialState: BucketPolicyState = {
  bucketName: '',
  dataResourceType: DataResourceType.SINGLE,
  readWriteSingle: '',
  cacheEnabled: false,
  readResourceMulti: [],
  writeResourceMulti: '',
  obcNamespace: '',
  replicationOBC: [],
  inProgress: false,
  errorMessage: '',
};

export type BucketPolicyAction =
  | { type: BucketPolicyActionType.SET_BUCKET_NAME; payload: string }
  | {
      type: BucketPolicyActionType.SET_RESOURCE_TYPE;
      payload: DataResourceType;
    }
  | { type: BucketPolicyActionType.SET_READ_WRITE_SINGLE; payload: string }
  | { type: BucketPolicyActionType.SET_CACHE; payload: boolean }
  | { type: BucketPolicyActionType.SET_READ_MULTI; payload: string[] }
  | { type: BucketPolicyActionType.SET_WRITE_MULTI; payload: string }
  | { type: BucketPolicyActionType.SET_OBC_NAMESPACE; payload: string }
  | {
      type: BucketPolicyActionType.SET_REPLICATION_OBC;
      payload: ReplicationOBC[];
    }
  | { type: BucketPolicyActionType.SET_INPROGRESS; payload: boolean }
  | { type: BucketPolicyActionType.SET_ERROR_MESSAGE; payload: string };

export const bucketPolicyReducer = (
  state: BucketPolicyState,
  action: BucketPolicyAction
) => {
  switch (action.type) {
    case BucketPolicyActionType.SET_BUCKET_NAME: {
      return {
        ...state,
        bucketName: action.payload,
      };
    }
    case BucketPolicyActionType.SET_RESOURCE_TYPE: {
      return {
        ...state,
        dataResourceType: action.payload,
      };
    }
    case BucketPolicyActionType.SET_READ_WRITE_SINGLE: {
      return {
        ...state,
        readWriteSingle: action.payload,
      };
    }
    case BucketPolicyActionType.SET_CACHE: {
      return {
        ...state,
        cacheEnabled: action.payload,
      };
    }
    case BucketPolicyActionType.SET_READ_MULTI: {
      return {
        ...state,
        readResourceMulti: action.payload,
      };
    }
    case BucketPolicyActionType.SET_WRITE_MULTI: {
      return {
        ...state,
        writeResourceMulti: action.payload,
      };
    }
    case BucketPolicyActionType.SET_OBC_NAMESPACE: {
      return {
        ...state,
        obcNamespace: action.payload,
      };
    }
    case BucketPolicyActionType.SET_REPLICATION_OBC: {
      return {
        ...state,
        replicationOBC: action.payload,
      };
    }
    case BucketPolicyActionType.SET_INPROGRESS: {
      return {
        ...state,
        inProgress: action.payload,
      };
    }
    case BucketPolicyActionType.SET_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: action.payload,
      };
    }
    default:
      return state;
  }
};
