import { AWS_REGIONS, BC_PROVIDERS } from '../../constants';

export enum createFormAction {
  SET_NAME = 'setName',
  SET_PROVIDER = 'setProvider',
  SET_SECRET_NAMESPACE = 'setSecretNamespace',
  SET_SECRET_NAME = 'setSecretName',
  SET_SECRET_KEY = 'setSecretKey',
  SET_ACCESS_KEY = 'setAccessKey',
  SET_REGION = 'setRegion',
  SET_TARGET = 'setTarget',
  SET_END_POINT = 'setEndpoint',
  SET_PVC = 'setPVC',
  SET_PVC_FOLDER_NAME = 'setPVCFolderName',
}

export type CreateFormDataState = {
  name: string;
  provider: BC_PROVIDERS;
  secretNamespace: string;
  secretName?: string;
  secretKey?: string;
  accessKey?: string;
  region?: string;
  target?: string;
  endpoint?: string;
  pvc?: string;
  pvcFolderName?: string;
};

export const initialStateCreateForm: CreateFormDataState = {
  name: '',
  provider: BC_PROVIDERS.AWS,
  secretNamespace: '',
  secretName: '',
  secretKey: '',
  accessKey: '',
  region: AWS_REGIONS[0],
  target: '',
  endpoint: '',
  pvc: '',
  pvcFolderName: '',
};

export type CreateFormAction =
  | { type: createFormAction.SET_NAME; value: string }
  | { type: createFormAction.SET_PROVIDER; value: string }
  | { type: createFormAction.SET_SECRET_NAMESPACE; value: string }
  | { type: createFormAction.SET_SECRET_NAME; value: string }
  | { type: createFormAction.SET_SECRET_KEY; value: string }
  | { type: createFormAction.SET_ACCESS_KEY; value: string }
  | { type: createFormAction.SET_REGION; value: string }
  | { type: createFormAction.SET_TARGET; value: string }
  | { type: createFormAction.SET_END_POINT; value: string }
  | { type: createFormAction.SET_PVC; value: string }
  | { type: createFormAction.SET_PVC_FOLDER_NAME; value: string };

export const createFormReducer = (
  state: CreateFormDataState,
  action: CreateFormAction
) => {
  const { value } = action;
  switch (action.type) {
    case createFormAction.SET_NAME:
      return Object.assign({}, state, { name: value });
    case createFormAction.SET_PROVIDER:
      return Object.assign({}, state, { provider: value });
    case createFormAction.SET_SECRET_NAMESPACE:
      return Object.assign({}, state, { secretNamespace: value });
    case createFormAction.SET_SECRET_NAME:
      return Object.assign({}, state, { secretName: value });
    case createFormAction.SET_SECRET_KEY:
      return Object.assign({}, state, { secretKey: value });
    case createFormAction.SET_ACCESS_KEY:
      return Object.assign({}, state, { accessKey: value });
    case createFormAction.SET_REGION:
      return Object.assign({}, state, { region: value });
    case createFormAction.SET_TARGET:
      return Object.assign({}, state, { target: value });
    case createFormAction.SET_END_POINT:
      return Object.assign({}, state, { endpoint: value });
    case createFormAction.SET_PVC:
      return Object.assign({}, state, { pvc: value });
    case createFormAction.SET_PVC_FOLDER_NAME:
      return Object.assign({}, state, { pvcFolderName: value });
    default:
      return initialStateCreateForm;
  }
};
