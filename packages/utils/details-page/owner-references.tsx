import * as React from 'react';
import {
  OwnerReference,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash-es';
import { K8sResourceKind } from '../../types';
import { referenceForOwnerRef } from '../../utils';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';

export const OwnerReferences: React.FC<OwnerReferencesProps> = ({
  resource,
}) => {
  const { t } = useCustomTranslation();
  const owners = (_.get(resource.metadata, 'ownerReferences') || []).map(
    (o: OwnerReference) => (
      <ResourceLink
        key={o.uid}
        kind={referenceForOwnerRef(o)}
        name={o.name}
        namespace={resource.metadata.namespace}
      />
    )
  );
  return owners.length ? (
    <>{owners}</>
  ) : (
    <span className="text-muted">{t('No owner')}</span>
  );
};

type OwnerReferencesProps = {
  resource: K8sResourceKind;
};

OwnerReferences.displayName = 'OwnerReferences';
