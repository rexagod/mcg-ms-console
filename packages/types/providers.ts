import {
  NOOBAA_TYPE_MAP,
  NS_NOOBAA_TYPE_MAP,
  NS_PROVIDERS_NOOBAA_MAP,
  PROVIDERS_NOOBAA_MAP,
} from '../constants';

export type nsSpecProvider =
  typeof NS_PROVIDERS_NOOBAA_MAP[keyof typeof NS_PROVIDERS_NOOBAA_MAP];
export type nsSpecType =
  typeof NS_NOOBAA_TYPE_MAP[keyof typeof NS_NOOBAA_TYPE_MAP];

export type SpecProvider =
  typeof PROVIDERS_NOOBAA_MAP[keyof typeof PROVIDERS_NOOBAA_MAP];
export type SpecType = typeof NOOBAA_TYPE_MAP[keyof typeof NOOBAA_TYPE_MAP];

export type nsSecretObject = {
  name: string;
  namespace: string;
};
