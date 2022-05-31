import * as React from 'react';
import { TFunction } from 'i18next';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormGroup,
  TextInput,
  InputGroup,
  SelectOption,
} from '@patternfly/react-core';
import { StoreType, BC_PROVIDERS } from '../../constants';
import { SecretModel } from '../../models';
import { awsRegionItems, endpointsSupported } from '../../utils';
import ResourceDropdown from '../../utils/dropdown/ResourceDropdown';
import { SingleSelectDropdown } from '../../utils/dropdown/singleselectdropdown';
import { secretResource } from '../resources';
import {
  createFormAction,
  CreateFormAction,
  CreateFormDataState,
} from './reducer';
import './noobaa-provider-endpoints.scss';

type S3EndpointTypeProps = {
  type: StoreType;
  state: CreateFormDataState;
  dispatch: React.Dispatch<CreateFormAction>;
  provider: BC_PROVIDERS;
  namespace: string;
};

const regionDropdownOptions: (t: TFunction) => JSX.Element[] = (t) =>
  _.map(awsRegionItems, (v, _) => <SelectOption key={v} value={v} />);

export const S3EndPointType: React.FC<S3EndpointTypeProps> = (props) => {
  const { t } = useTranslation();

  const [showSecret, setShowSecret] = React.useState(true);
  const { provider, state, dispatch, type } = props;

  const targetLabel =
    provider === BC_PROVIDERS.AZURE
      ? t('Target blob container')
      : t('Target bucket');
  const credentialField1Label =
    provider === BC_PROVIDERS.AZURE ? t('Account name') : t('Access key');
  const credentialField2Label =
    provider === BC_PROVIDERS.AZURE ? t('Account key') : t('Secret key');

  const switchToSecret = () => {
    setShowSecret(true);
    dispatch({ type: createFormAction.SET_ACCESS_KEY, value: '' });
    dispatch({ type: createFormAction.SET_SECRET_KEY, value: '' });
  };

  const switchToCredentials = () => {
    setShowSecret(false);
    dispatch({ type: createFormAction.SET_SECRET_NAME, value: '' });
  };

  const getSecrets = React.useCallback(
    (e) =>
      dispatch({
        type: createFormAction.SET_SECRET_NAME,
        value: e?.metadata?.name,
      }),
    [dispatch]
  );
  const secretName = state.secretName;
  const getInitialSelection = React.useCallback(() => secretName, [secretName]);

  return (
    <>
      {provider === BC_PROVIDERS.AWS && (
        <FormGroup
          label={t('Region')}
          fieldId="region"
          className="nb-endpoints-form-entry"
          isRequired
        >
          <SingleSelectDropdown
            aria-label={t('Region Dropdown')}
            id="region"
            className="nb-endpoints-form-entry__dropdown"
            onChange={(e) => {
              dispatch({ type: createFormAction.SET_REGION, value: e });
            }}
            selectOptions={regionDropdownOptions(t)}
            selectedKey={state.region}
          />
        </FormGroup>
      )}

      {endpointsSupported.includes(provider) && (
        <FormGroup
          label={t('Endpoint')}
          fieldId="endpoint"
          className="nb-endpoints-form-entry"
          isRequired
        >
          <TextInput
            data-test={`${type.toLowerCase()}-s3-endpoint`}
            onChange={(e) => {
              dispatch({ type: createFormAction.SET_END_POINT, value: e });
            }}
            id="endpoint"
            value={state.endpoint}
            aria-label={t('Endpoint Address')}
          />
        </FormGroup>
      )}

      {showSecret ? (
        <FormGroup
          label={t('Secret')}
          fieldId="secret-dropdown"
          className="nb-endpoints-form-entry nb-endpoints-form-entry--full-width"
          isRequired
        >
          <InputGroup>
            <ResourceDropdown
              className="nb-endpoints-form-entry__dropdown nb-endpoints-form-entry__dropdown--full-width"
              resource={secretResource}
              resourceModel={SecretModel}
              onSelect={getSecrets}
              initialSelection={getInitialSelection}
            />
            <Button
              variant="plain"
              data-test="switch-to-creds"
              onClick={switchToCredentials}
            >
              {t('Switch to Credentials')}
            </Button>
          </InputGroup>
        </FormGroup>
      ) : (
        <>
          <FormGroup label={credentialField1Label} fieldId="access-key">
            <InputGroup>
              <TextInput
                id="access-key"
                data-test={`${type.toLowerCase()}-access-key`}
                value={state.accessKey}
                onChange={(e) => {
                  dispatch({ type: createFormAction.SET_ACCESS_KEY, value: e });
                }}
                aria-label={t('Access Key Field')}
              />
              <Button variant="plain" onClick={switchToSecret}>
                {t('Switch to Secret')}
              </Button>
            </InputGroup>
          </FormGroup>
          <FormGroup
            className="nb-endpoints-form-entry"
            label={credentialField2Label}
            fieldId="secret-key"
          >
            <TextInput
              value={state.secretKey}
              id="secret-key"
              data-test={`${type.toLowerCase()}-secret-key`}
              onChange={(e) => {
                dispatch({ type: createFormAction.SET_SECRET_KEY, value: e });
              }}
              aria-label={t('Secret Key Field')}
              type="password"
            />
          </FormGroup>
        </>
      )}
      <FormGroup
        label={targetLabel}
        fieldId="target-bucket"
        className="nb-endpoints-form-entry"
        isRequired
      >
        <TextInput
          id="target-bucket"
          value={state.target}
          data-test={`${type.toLowerCase()}-target-bucket`}
          onChange={(e) =>
            dispatch({ type: createFormAction.SET_TARGET, value: e })
          }
          aria-label={targetLabel}
        />
      </FormGroup>
    </>
  );
};
