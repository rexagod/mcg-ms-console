import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Gallery,
  GalleryItem,
  Skeleton,
} from '@patternfly/react-core';
import { NOOBAA_PROVIDER_MAP, NS_PROGRESS } from '../../../constants';
import { NamespaceStoreKind } from '../../../types';
import { nameSpaceStoreResource } from '../../resources';
import './resource-providers-card.scss';

const ResourceProvidersItem: React.FC<ResourceProvidersRowProps> =
  // eslint-disable-next-line react/display-name
  React.memo(({ title, count }) => (
    <div className="co-inventory-card__item">
      <div
        className="nb-resource-providers-card__row-title"
        data-test="nb-resource-providers-card"
      >{`${count} ${title}`}</div>
    </div>
  ));

const ResourceProviders: React.FC<{}> = () => {
  const { t } = useTranslation();

  const [dataResources, dataResourcesLoaded, dataResourcesError] =
    useK8sWatchResource<NamespaceStoreKind[]>(nameSpaceStoreResource);

  const allProvidersMap = React.useMemo(
    () =>
      dataResourcesLoaded && !dataResourcesError
        ? dataResources?.reduce(
            (drMap: AllProvidersMap, dataResource: NamespaceStoreKind) => {
              const providerType =
                NOOBAA_PROVIDER_MAP[dataResource?.spec?.type];
              dataResource?.status?.phase === NS_PROGRESS.READY &&
                (drMap[providerType] = drMap[providerType] + 1 || 1);
              return drMap;
            },
            {} as AllProvidersMap
          )
        : ({} as AllProvidersMap),
    [dataResources, dataResourcesLoaded, dataResourcesError]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Resource Providers')}</CardTitle>
      </CardHeader>
      <CardBody>
        {!dataResourcesLoaded ? (
          <Skeleton />
        ) : dataResourcesError || _.isEmpty(allProvidersMap) ? (
          <div className="nb-resource-providers-card__not-available text-secondary">
            {t('Not available')}
          </div>
        ) : (
          <Gallery hasGutter>
            {_.map(allProvidersMap, (count, provider) => {
              return (
                <GalleryItem key={provider}>
                  <ResourceProvidersItem count={count} title={provider} />
                </GalleryItem>
              );
            })}
          </Gallery>
        )}
      </CardBody>
    </Card>
  );
};

type AllProvidersMap = {
  string: number;
};

type ResourceProvidersRowProps = {
  count: number;
  title: string;
};

export const ResourceProvidersCard = ResourceProviders;
