import * as React from 'react';
import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from 'react-router';
import { Grid, GridItem } from '@patternfly/react-core';
import { DATA_FEDERATION } from '../../constants';
import { DFRMock } from '../../models';
import PageHeading from '../../utils/heading/page-heading';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';
import ActivityCard from './activity-card/activity-card';
import { DetailsCard } from './details-card/details-card';
import { InventoryCard } from './inventory-card/inventory-card';
import { ResourceProvidersCard } from './resource-providers-card/resource-providers-card';
import { StatusCard } from './status-card/status-card';
import './dashboard.scss';

type DFRDashboardPageProps = {
  history: RouteComponentProps['history'];
};

const UpperSection: React.FC = () => (
  <Grid hasGutter>
    <GridItem md={8} sm={12}>
      <Grid hasGutter>
        <GridItem>
          <StatusCard />
        </GridItem>
        <GridItem>
          <DetailsCard />
        </GridItem>
        <GridItem>
          <InventoryCard />
        </GridItem>
        <GridItem>
          <ResourceProvidersCard />
        </GridItem>
      </Grid>
    </GridItem>
    <GridItem md={4} sm={12}>
      <ActivityCard />
    </GridItem>
  </Grid>
);

export const DFRDashboard: React.FC = () => {
  return (
    <>
      <div className="co-dashboard-body">
        <UpperSection />
      </div>
    </>
  );
};

const DFRDashboardPage: React.FC<DFRDashboardPageProps> = (props) => {
  const { t } = useCustomTranslation();
  const title = DATA_FEDERATION;
  const pages = [
    {
      href: '',
      name: t('Overview'),
      component: DFRDashboard,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageHeading title={title} />
      <HorizontalNav
        pages={pages}
        resource={{
          kind: DFRMock.kind,
          apiVersion: `${DFRMock.apiGroup}/${DFRMock.apiVersion}`,
        }}
      />
    </>
  );
};

export default DFRDashboardPage;
