import * as React from 'react';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import * as _ from 'lodash';
import { NooBaaBackingStoreModel, NooBaaBucketClassModel } from '../../models';
import { CustomKebabItemsType } from '../../utils/kebab/kebab';
import { ModalMap } from '../../utils/modals/modalLauncher';

type GenericListPageProps = {
  actions?: ModalMap;
  resourceModel?: K8sModel;
  kebabActions?: CustomKebabItemsType;
};

// TODO(deb): moved generic stuffs like types and other to common place (here) and
// specific resource related stuffs in respective resource list view file
const GenericListPage: React.FC<GenericListPageProps> = () => {
  return (
    <div className="center-component">
      {'Data Federation ~ Sample List View'}
    </div>
  );
};

// TODO(sanjal): specific resource related stuffs in respective resource list view file
export const BackingStoreListPage: React.FC = () => (
  <GenericListPage resourceModel={NooBaaBackingStoreModel} />
);

export const BucketClassListPage: React.FC = () => (
  <GenericListPage resourceModel={NooBaaBucketClassModel} />
);
