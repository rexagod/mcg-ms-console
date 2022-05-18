import { NS_NOOBAA_TYPE_MAP, NS_PROVIDERS_NOOBAA_MAP } from '../constants';

export type nsSpecProvider =
  typeof NS_PROVIDERS_NOOBAA_MAP[keyof typeof NS_PROVIDERS_NOOBAA_MAP];
export type nsSpecType =
  typeof NS_NOOBAA_TYPE_MAP[keyof typeof NS_NOOBAA_TYPE_MAP];
