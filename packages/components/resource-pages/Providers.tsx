import * as React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem } from '@patternfly/react-core';
import { BC_PROVIDERS, NOOBAA_TYPE_MAP } from '../../constants';
import { SecretModel } from '../../models';
import { NamespaceStoreKind, nsSecretObject } from '../../types';
import { getRegion } from '../../utils';
import { LoadingBox } from '../../utils/generics/status-box';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';
import { DetailsItem } from './CommonDetails';
import './resources.scss';

type ProviderDetailsProps = {
  resource: NamespaceStoreKind;
};

const AWSDetails: React.FC<ProviderDetailsProps> = ({ resource }) => {
  const { t } = useCustomTranslation();
  const region = getRegion(resource);
  const secret = resource.spec.awsS3.secret as nsSecretObject;
  const targetBucket = resource.spec.awsS3.targetBucket;

  return (
    <Flex direction={{ default: 'column' }} className="details-item--border">
      <FlexItem>
        <DetailsItem field={t('Provider')}>{BC_PROVIDERS.AWS}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Region')}>{region}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Secret')}>
          <ResourceLink
            kind={SecretModel.kind}
            name={secret.name}
            namespace={secret.namespace}
          />
        </DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Target Bucket')}>{targetBucket}</DetailsItem>
      </FlexItem>
    </Flex>
  );
};

const AzureBlobDetails: React.FC<ProviderDetailsProps> = ({ resource }) => {
  const { t } = useCustomTranslation();
  const secret = resource.spec.azureBlob.secret as nsSecretObject;
  const targetBucket = resource.spec.azureBlob.targetBlobContainer;

  return (
    <Flex direction={{ default: 'column' }} className="details-item--border">
      <FlexItem>
        <DetailsItem field={t('Provider')}>{BC_PROVIDERS.AZURE}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Secret')}>
          <ResourceLink
            kind={SecretModel.kind}
            name={secret.name}
            namespace={secret.namespace}
          />
        </DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Target Blob Container')}>
          {targetBucket}
        </DetailsItem>
      </FlexItem>
    </Flex>
  );
};

const S3CompatibleDetails: React.FC<ProviderDetailsProps> = ({ resource }) => {
  const { t } = useCustomTranslation();
  const secret = resource.spec.s3Compatible.secret as nsSecretObject;
  const endpoint = resource.spec.s3Compatible.endpoint;
  const targetBucket = resource.spec.s3Compatible.targetBucket;

  return (
    <Flex direction={{ default: 'column' }} className="details-item--border">
      <FlexItem>
        <DetailsItem field={t('Provider')}>{BC_PROVIDERS.S3}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Endpoint')}>{endpoint}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Secret')}>
          <ResourceLink
            kind={SecretModel.kind}
            name={secret.name}
            namespace={secret.namespace}
          />
        </DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Target Bucket')}>{targetBucket}</DetailsItem>
      </FlexItem>
    </Flex>
  );
};

const IBMDetails: React.FC<ProviderDetailsProps> = ({ resource }) => {
  const { t } = useCustomTranslation();
  const secret = resource.spec.ibmCos.secret as nsSecretObject;
  const endpoint = resource.spec.ibmCos.endpoint;
  const targetBucket = resource.spec.ibmCos.targetBucket;

  return (
    <Flex direction={{ default: 'column' }} className="details-item--border">
      <FlexItem>
        <DetailsItem field={t('Provider')}>{BC_PROVIDERS.IBM}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Endpoint')}>{endpoint}</DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Secret')}>
          <ResourceLink
            kind={SecretModel.kind}
            name={secret.name}
            namespace={secret.namespace}
          />
        </DetailsItem>
      </FlexItem>
      <FlexItem>
        <DetailsItem field={t('Target Bucket')}>{targetBucket}</DetailsItem>
      </FlexItem>
    </Flex>
  );
};

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ resource }) => {
  const type = resource.spec.type;

  const ProviderComponent = React.useMemo(() => {
    switch (type) {
      case NOOBAA_TYPE_MAP[BC_PROVIDERS.AWS]:
        return AWSDetails;
      case NOOBAA_TYPE_MAP[BC_PROVIDERS.AZURE]:
        return AzureBlobDetails;
      case NOOBAA_TYPE_MAP[BC_PROVIDERS.S3]:
        return S3CompatibleDetails;
      case NOOBAA_TYPE_MAP[BC_PROVIDERS.IBM]:
        return IBMDetails;
      default:
        return LoadingBox;
    }
  }, [type]);

  return <ProviderComponent resource={resource} />;
};

export default ProviderDetails;
