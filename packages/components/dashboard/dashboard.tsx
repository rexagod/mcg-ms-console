import * as React from 'react';
import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { DFRMock } from '../../models';
import PageHeading from '../../utils/heading/page-heading';
import './dashboard.scss';

type DFRDashboardPageProps = {
  history: RouteComponentProps['history'];
};

export const DFRDashboard: React.FC = () => {
  return (
    <>
      <div className="co-dashboard-body center-component">
        <>{"Data Federation ~ Sample Dashboard"}</>
      </div>
    </>
  );
};

const DFRDashboardPage: React.FC<DFRDashboardPageProps> = (props) => {
  const { t } = useTranslation('plugin__mcg-ms-console');
  const title = t('Data Federation');
  const pages = [
    {
      href: '',
      name: t('Overview'),
      component: DFRDashboard,
    }
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
