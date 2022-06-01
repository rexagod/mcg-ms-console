import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popover, PopoverPosition } from '@patternfly/react-core';
import {
  NooBaaNamespaceStoreModel,
  NooBaaObjectBucketClaimModel,
} from '../../models';
import { referenceForModel } from '../../utils';
import ResourceLink from '../../utils/generics/resource-link';
import './resources.scss';

const ResourcePopOver: React.FC<ResourcePopOverProps> = ({
  position,
  children,
  label,
  title,
}) => {
  return (
    <Popover
      position={position || PopoverPosition.auto}
      headerContent={title}
      bodyContent={children}
      aria-label={title}
    >
      <Button variant="link" isInline>
        {label}
      </Button>
    </Popover>
  );
};

export const DataResourcesPopOver: React.FC<DataResourcesPopOverProps> = ({
  label,
  dataResources,
}) => {
  const { t } = useTranslation();

  return (
    <ResourcePopOver label={label} title={t('Connected data sources')}>
      <div className="resource-pop-over">
        {dataResources?.map((resourceName) => (
          <ResourceLink
            link={`/mcgms/resource/${referenceForModel(
              NooBaaNamespaceStoreModel
            )}/${resourceName}`}
            resourceName={resourceName}
            key={resourceName}
            hideIcon
          />
        ))}
      </div>
    </ResourcePopOver>
  );
};

export const OBCPopOver: React.FC<OBCPopOverProps> = ({
  label,
  obcDetails,
}) => {
  const { t } = useTranslation();

  return (
    <ResourcePopOver label={label} title={t('Connected ObjectBucketClaims')}>
      <div className="resource-pop-over">
        {obcDetails?.map((obcObj) => (
          <ResourceLink
            link={`/k8s/ns/${obcObj.ns}/${referenceForModel(
              NooBaaObjectBucketClaimModel
            )}/${obcObj.name}`}
            resourceName={obcObj.name}
            key={obcObj.name}
            hideIcon
          />
        ))}
      </div>
    </ResourcePopOver>
  );
};

type ResourcePopOverProps = {
  label: string;
  position?: PopoverPosition;
  title?: string;
  children: React.ReactNode;
};

type DataResourcesPopOverProps = {
  label: string;
  dataResources: string[];
};

type OBCPopOverProps = {
  label: string;
  obcDetails: {
    name: string;
    ns: string;
  }[];
};
