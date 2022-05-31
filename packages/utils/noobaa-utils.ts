import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import {
  AWS_REGIONS,
  BC_PROVIDERS,
  PROVIDERS_NOOBAA_MAP,
  BucketClassType,
  StoreType,
} from '../constants';
import {
  DeploymentKind,
  K8sResourceKind,
  NamespaceStoreKind,
  BucketClassKind,
  SingleBC,
  MultiBC,
} from '../types';

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
        BC_PROVIDERS.IBM,
      ];
};

export const getAttachOBCPatch = (
  obcName: string,
  deployment: DeploymentKind
) => {
  const configMapRef = {
    configMapRef: {
      name: obcName,
    },
  };
  const secretMapRef = {
    secretRef: {
      name: obcName,
    },
  };

  const containers = deployment?.spec?.template?.spec?.containers ?? [];
  const patches = containers.reduce((patch, container, i) => {
    if (_.isEmpty(container.envFrom)) {
      patch.push({
        op: 'add',
        path: `/spec/template/spec/containers/${i}/envFrom`,
        value: [configMapRef],
      });
      patch.push({
        op: 'add',
        path: `/spec/template/spec/containers/${i}/envFrom/-`,
        value: secretMapRef,
      });
    } else {
      patch.push({
        op: 'add',
        path: `/spec/template/spec/containers/${i}/envFrom/-`,
        value: configMapRef,
      });
      patch.push({
        op: 'add',
        path: `/spec/template/spec/containers/${i}/envFrom/-`,
        value: secretMapRef,
      });
    }
    return patch;
  }, []);
  return patches;
};

export const getPhase = (obj: K8sResourceKind): string => {
  return _.get(obj, 'status.phase', 'Lost');
};

export const isBound = (obj: K8sResourceKind): boolean =>
  getPhase(obj) === 'Bound';

const allPhases = ['Pending', 'Bound', 'Lost'];

export const obcStatusFilter = (t): RowFilter<K8sResourceKind> => ({
  type: 'obc-status',
  filterGroupName: t('Status'),
  reducer: getPhase,
  items: _.map(allPhases, (phase) => ({
    id: phase,
    title: phase,
  })),
  filter: (phases, obc) => {
    if (!phases || !phases.selected) {
      return true;
    }
    const phase = getPhase(obc);
    return (
      phases.selected.includes(phase) ||
      !_.includes(phases.all, phase) ||
      _.isEmpty(phases.selected)
    );
  },
});

export const obStatusFilter = (t): RowFilter<K8sResourceKind> => ({
  type: 'ob-status',
  filterGroupName: t('Status'),
  reducer: getPhase,
  items: _.map(allPhases, (phase) => ({
    id: phase,
    title: phase,
  })),
  filter: (phases, ob) => {
    if (!phases || !phases.selected) {
      return true;
    }
    const phase = getPhase(ob);
    return (
      phases.selected.includes(phase) ||
      !_.includes(phases.all, phase) ||
      _.isEmpty(phases.selected)
    );
  },
});

export const getMCGStoreType = (bs: NamespaceStoreKind): BC_PROVIDERS => {
  let type: BC_PROVIDERS = null;
  _.forEach(PROVIDERS_NOOBAA_MAP, (v, k) => {
    if (bs?.spec?.[v]) {
      type = k as BC_PROVIDERS;
    }
  });
  return type;
};

export const getRegion = (bs: NamespaceStoreKind): string => {
  const type = getMCGStoreType(bs);
  return bs.spec?.[PROVIDERS_NOOBAA_MAP[type]]?.region;
};

export const getDataResources = (obj: BucketClassKind): string[] => {
  const type = obj?.spec?.namespacePolicy?.type;
  const resourseList = [];
  if (type === BucketClassType.SINGLE) {
    resourseList.push(
      (obj?.spec?.namespacePolicy as SingleBC)?.single?.resource
    );
  } else if (type === BucketClassType.MULTI) {
    resourseList.push(
      ...(obj?.spec?.namespacePolicy as MultiBC)?.multi?.readResources
    );
  }
  return resourseList;
};
