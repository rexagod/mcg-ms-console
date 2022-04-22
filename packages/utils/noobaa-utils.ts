import * as _ from "lodash";
import { AWS_REGIONS, BC_PROVIDERS, StoreType } from "../constants";

export const awsRegionItems = _.zipObject(AWS_REGIONS, AWS_REGIONS);
export const endpointsSupported = [BC_PROVIDERS.S3, BC_PROVIDERS.IBM];
export const getProviders = (type: StoreType) => {
  const values =
    type === StoreType.BS
      ? // BackingStore does not support filesystem, NamespaceStore does not support PVC and GCP
        Object.values(BC_PROVIDERS).filter(
          (provider) => provider !== BC_PROVIDERS.FILESYSTEM
        )
      : Object.values(BC_PROVIDERS).filter(
          (provider) =>
            provider !== BC_PROVIDERS.GCP && provider !== BC_PROVIDERS.PVC
        );
  return _.zipObject(values, values);
};

export const getExternalProviders = (type: StoreType) => {
  return type === StoreType.NS
    ? [BC_PROVIDERS.AWS, BC_PROVIDERS.AZURE, BC_PROVIDERS.S3, BC_PROVIDERS.IBM]
    : [
        BC_PROVIDERS.AWS,
        BC_PROVIDERS.AZURE,
        BC_PROVIDERS.S3,
        BC_PROVIDERS.GCP,
        BC_PROVIDERS.IBM
      ];
};
