import * as React from 'react';
import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import PageHeading from '../../utils/heading/page-heading';
import './dashboard.scss';

type SampleDashboardPageProps = {
  history: RouteComponentProps['history'];
};

export const SampleDashboard: React.FC = () => {
    return (
    <>
        <div className="co-dashboard-body centerComponent">
          <>{"Data Federation ~ Sample Dashboard"}</>
        </div>
    </>
    );
};

export const SampleListPage: React.FC = () => {
    return (
        <>
        <div className="co-dashboard-body centerComponent">
            <>{"Data Federation ~ Sample ListPage"}</>
        </div>
        </>
    );
};

const SampleDashboardPage: React.FC<SampleDashboardPageProps> = (props) => {
  const { t } = useTranslation('plugin__dfr-console');
  const title = t('Data Federation Mock Page');
  const pages = [
    {
      href: '',
      name: t('Overview'),
      component: SampleDashboard,
    },
    {
      href: 'systems',
      name: t('List Page'),
      component: SampleListPage,
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
          kind: 'DataFederation',
          apiVersion: 'console.odf.io/v1',
        }}
      />
    </>
  );
};

export default SampleDashboardPage;