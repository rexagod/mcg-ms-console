import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Title } from '@patternfly/react-core';
import { DATA_FEDERATION_NAMESPACE } from '../../constants';
import { NooBaaNamespaceStoreModel } from '../../models';
import { referenceForModel } from '../../utils';
import { getName } from '../../utils/selectors/k8s';
import DataResourceCreateForm from './data-resource-create-form';
import './noobaa-provider-endpoints.scss';

type CreateDataResourceProps = RouteComponentProps<{
  ns: string;
  appName: string;
}>;

const CreateDataResource: React.FC<CreateDataResourceProps> = ({
  history,
  match,
}) => {
  const { t } = useTranslation();
  const { ns = DATA_FEDERATION_NAMESPACE } = match.params;
  const onCancel = () => history.goBack();

  return (
    <>
      <div className="co-create-operand__header">
        <Title
          size="2xl"
          headingLevel="h1"
          className="co-create-operand__header-text"
        >
          {t('Create new data source')}
        </Title>
        <p className="help-block">
          {t(
            'Represents an underlying storage to be used as read or write target for the data in buckets.'
          )}
        </p>
      </div>
      <DataResourceCreateForm
        onCancel={onCancel}
        redirectHandler={(resources) => {
          const lastIndex = resources.length - 1;
          const resourcePath = `${referenceForModel(
            NooBaaNamespaceStoreModel
          )}/${getName(resources[lastIndex])}`;
          history.push(`/mcgms/resource/${resourcePath}`);
        }}
        namespace={ns}
        className="nb-endpoints-page-form__short"
      />
    </>
  );
};

export default CreateDataResource;
