import {
  SetFeatureFlag,
  k8sList,
  K8sResourceCommon,
} from '@openshift-console/dynamic-plugin-sdk';
import { DATA_FEDERATION_NAMESPACE, ONE_SECOND } from './constants';
import { NooBaaSystemModel } from './models';

const MCG_FLAG = 'DF_MCG';

export const detectNoobaa: FeatureDetector = async (
  setFlag: SetFeatureFlag
) => {
  let noobaaIntervalId = null;
  const noobaaDetector = async () => {
    try {
      const noobaaSystems = (await k8sList({
        model: NooBaaSystemModel,
        queryParams: { ns: DATA_FEDERATION_NAMESPACE },
      })) as K8sResourceCommon[];
      if (noobaaSystems?.length > 0) {
        setFlag(MCG_FLAG, true);
        clearInterval(noobaaIntervalId);
      }
    } catch {
      setFlag(MCG_FLAG, false);
    }
  };

  // calling first time instantaneously
  // else it will wait for 15s before start polling
  noobaaDetector();
  noobaaIntervalId = setInterval(noobaaDetector, 15 * ONE_SECOND);
};

export type FeatureDetector = (setFlag: SetFeatureFlag) => Promise<void>;
