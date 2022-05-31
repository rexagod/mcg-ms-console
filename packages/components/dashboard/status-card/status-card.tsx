import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { HealthBody } from '@openshift-console/dynamic-plugin-sdk-internal';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from '@patternfly/react-core';
import { MCG_OPERATOR } from '../../../constants';
import { ClusterServiceVersionKind } from '../../../types';
import HealthItem from '../../../utils/dashboard/status-card/HealthItem';
import { operatorResource } from '../../resources';
import { getOperatorHealthState } from '../utils';
import './status-card.scss';

export const StatusCard: React.FC = () => {
  const { t } = useTranslation();
  const [csvData, csvLoaded, csvLoadError] =
    useK8sWatchResource<ClusterServiceVersionKind[]>(operatorResource);

  const operator = React.useMemo(
    () => csvData?.find((csv) => csv.metadata.name.startsWith(MCG_OPERATOR)),
    [csvData]
  );
  const operatorStatus = operator?.status?.phase;

  const operatorHealthStatus = getOperatorHealthState(
    operatorStatus,
    !csvLoaded,
    csvLoadError
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Status')}</CardTitle>
      </CardHeader>
      <CardBody>
        <HealthBody>
          <Gallery className="co-overview-status__health" hasGutter>
            <GalleryItem>
              <HealthItem
                title={t('Data Federation service')}
                state={operatorHealthStatus.state}
              />
            </GalleryItem>
          </Gallery>
        </HealthBody>
      </CardBody>
    </Card>
  );
};
