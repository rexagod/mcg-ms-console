import * as React from 'react';
import {
  k8sCreate,
  K8sResourceCommon,
  getAPIVersionForModel,
} from '@openshift-console/dynamic-plugin-sdk';
import classNames from 'classnames';
import { TFunction } from 'i18next';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  FormGroup,
  Form,
  TextInput,
  Tooltip,
  SelectOption,
  ActionGroup,
  Button,
} from '@patternfly/react-core';
import {
  BC_PROVIDERS,
  BUCKET_LABEL_NOOBAA_MAP,
  DATA_FEDERATION_NAMESPACE,
  NOOBAA_TYPE_MAP,
  PROVIDERS_NOOBAA_MAP,
  StoreType,
} from '../../constants';
import {
  SecretModel,
  NooBaaNamespaceStoreModel,
  PersistentVolumeClaimModel,
} from '../../models';
import {
  NamespaceStoreKind,
  PersistentVolumeClaimKind,
  SecretKind,
} from '../../types';
import {
  getExternalProviders,
  getProviders,
  secretPayloadCreator,
} from '../../utils';
import ResourceDropdown from '../../utils/dropdown/ResourceDropdown';
import { SingleSelectDropdown } from '../../utils/dropdown/singleselectdropdown';
import { ButtonBar } from '../../utils/generics/ButtonBar';
import {
  HandlePromiseProps,
  withHandlePromise,
} from '../../utils/generics/promise-component';
import { pvcResource } from '../resources';
import {
  createFormAction,
  initialStateCreateForm,
  createFormReducer,
  CreateFormDataState,
} from './reducer';
import { S3EndPointType } from './s3-endpoint-type';
import './noobaa-provider-endpoints.scss';

type Payload = K8sResourceCommon & {
  spec: {
    type: string;
    ssl: boolean;
    [key: string]: any;
  };
};

const PROVIDERS = getProviders(StoreType.NS);
const externalProviders = getExternalProviders(StoreType.NS);

const providerDropdownOptions: (t: TFunction) => JSX.Element[] = (t) =>
  _.map(PROVIDERS, (v, _) => <SelectOption key={v} value={v} />);

const filterPVCResource = (pvcObj: PersistentVolumeClaimKind) =>
  pvcObj?.status?.phase === 'Bound' &&
  pvcObj?.spec?.accessModes.some((mode) => mode === 'ReadWriteMany');

type DataResourceCreateFormProps = {
  redirectHandler: (resources?: (NamespaceStoreKind | SecretKind)[]) => void;
  namespace: string;
  className?: string;
  onCancel: () => void;
};

const isFormValid = (form: CreateFormDataState) => {
  const {
    name,
    accessKey,
    secretKey,
    secretName,
    region,
    endpoint,
    target,
    pvc,
    pvcFolderName,
  } = form;
  return (
    !!name?.trim() &&
    name.length <= 42 &&
    (((region || endpoint) &&
      (secretName || (secretKey && accessKey)) &&
      target) ||
      (pvc && pvcFolderName))
  );
};

const DataResourceCreateForm: React.FC<DataResourceCreateFormProps> =
  withHandlePromise<DataResourceCreateFormProps & HandlePromiseProps>(
    (props) => {
      const { t } = useTranslation();
      const [formDataState, formDataDispatch] = React.useReducer(
        createFormReducer,
        initialStateCreateForm
      );
      const handleNsNameTextInputChange = (strVal: string) =>
        formDataDispatch({ type: createFormAction.SET_NAME, value: strVal });
      const {
        onCancel,
        className,
        inProgress,
        handlePromise,
        redirectHandler,
        namespace,
        errorMessage,
      } = props;
      const { provider } = formDataState;

      const onSubmit = (event) => {
        event.preventDefault();
        /** Create a secret if secret ==='' */
        let { secretName, name: dataResourceName } = formDataState;
        const promises = [];
        if (provider !== BC_PROVIDERS.FILESYSTEM && !secretName) {
          secretName = dataResourceName.concat('-secret');
          const { secretKey, accessKey } = formDataState;
          const secretPayload = secretPayloadCreator(
            provider,
            namespace,
            secretName,
            accessKey,
            secretKey
          );
          formDataDispatch({
            type: createFormAction.SET_SECRET_NAME,
            value: secretName,
          });
          promises.push(k8sCreate({ model: SecretModel, data: secretPayload }));
        }

        const dataResourcePayload: Payload = {
          apiVersion: getAPIVersionForModel(NooBaaNamespaceStoreModel),
          kind: NooBaaNamespaceStoreModel.kind,
          metadata: {
            namespace,
            name: dataResourceName,
          },
          spec: {
            type: NOOBAA_TYPE_MAP[provider],
            ssl: false,
          },
        };
        if (externalProviders.includes(provider)) {
          dataResourcePayload.spec = {
            ...dataResourcePayload.spec,
            [PROVIDERS_NOOBAA_MAP[provider]]: {
              [BUCKET_LABEL_NOOBAA_MAP[provider]]: formDataState.target,
              secret: {
                name: secretName,
                namespace,
              },
            },
          };
        }
        if (provider === BC_PROVIDERS.S3) {
          dataResourcePayload.spec.s3Compatible = {
            ...dataResourcePayload.spec.s3Compatible,
            endpoint: formDataState.endpoint,
          };
        } else if (provider === BC_PROVIDERS.IBM) {
          dataResourcePayload.spec.ibmCos = {
            ...dataResourcePayload.spec.ibmCos,
            endpoint: formDataState.endpoint,
          };
        }
        // Add region in the end
        if (provider === BC_PROVIDERS.AWS) {
          dataResourcePayload.spec.awsS3 = {
            ...dataResourcePayload.spec.awsS3,
            region: formDataState.region,
          };
        }
        if (provider === BC_PROVIDERS.FILESYSTEM) {
          dataResourcePayload.spec.nsfs = {
            ...dataResourcePayload.spec.nsfs,
            pvcName: formDataState.pvc,
            subPath: formDataState.pvcFolderName,
          };
        }
        promises.push(
          k8sCreate({
            model: NooBaaNamespaceStoreModel,
            data: dataResourcePayload,
          })
        );
        return handlePromise(
          Promise.all(promises),
          (resources: (NamespaceStoreKind | SecretKind)[]) => {
            redirectHandler(resources);
          }
        );
      };

      return (
        <Form
          className={classNames(
            'nb-endpoints-form',
            'co-m-pane__body',
            className
          )}
          onSubmit={onSubmit}
          noValidate={false}
        >
          <FormGroup
            label={t('Data source name')}
            fieldId="data-source-name"
            className="nb-endpoints-form-entry"
            helperText={t(
              'A unique name for the data source within the project.'
            )}
            isRequired
          >
            <Tooltip
              content={t('Name can contain a max of 43 characters')}
              isVisible={formDataState.name.length > 42}
              trigger="manual"
            >
              <TextInput
                id="ns-name"
                onChange={handleNsNameTextInputChange}
                value={formDataState.name}
                maxLength={43}
                data-test="data-source-name"
                placeholder="my-data-source-name"
              />
            </Tooltip>
          </FormGroup>

          <FormGroup
            label={t('Provider')}
            fieldId="provider-name"
            className="nb-endpoints-form-entry"
            isRequired
          >
            <SingleSelectDropdown
              id="providers"
              className="nb-endpoints-form-entry__dropdown"
              onChange={(selectedProvider) => {
                formDataDispatch({
                  type: createFormAction.SET_PROVIDER,
                  value: PROVIDERS[selectedProvider],
                });
              }}
              selectOptions={providerDropdownOptions(t)}
              selectedKey={provider}
            />
          </FormGroup>
          {(provider === BC_PROVIDERS.AWS ||
            provider === BC_PROVIDERS.S3 ||
            provider === BC_PROVIDERS.IBM ||
            provider === BC_PROVIDERS.AZURE) && (
            <S3EndPointType
              type={StoreType.NS}
              provider={provider}
              namespace={DATA_FEDERATION_NAMESPACE}
              state={formDataState}
              dispatch={formDataDispatch}
            />
          )}
          {provider === BC_PROVIDERS.FILESYSTEM && (
            <>
              <FormGroup
                label={t('Persistent volume claim')}
                fieldId="pvc-name"
                className="nb-endpoints-form-entry"
                isRequired
              >
                <ResourceDropdown<PersistentVolumeClaimKind>
                  id="pvc-name"
                  className="nb-endpoints-form-entry__dropdown nb-endpoints-form-entry__dropdown--full-width"
                  resource={pvcResource}
                  resourceModel={PersistentVolumeClaimModel}
                  onSelect={(e) =>
                    formDataDispatch({
                      type: createFormAction.SET_PVC,
                      value: e.metadata.name,
                    })
                  }
                  filterResource={filterPVCResource}
                />
              </FormGroup>
              <FormGroup
                label={t('Folder')}
                fieldId="folder-name"
                className="nb-endpoints-form-entry"
                helperText={t(
                  'If the name you write exists, we will be using the existing folder if not we will create a new folder '
                )}
                isRequired
              >
                <TextInput
                  id="folder-name"
                  onChange={(e) =>
                    formDataDispatch({
                      type: createFormAction.SET_PVC_FOLDER_NAME,
                      value: e,
                    })
                  }
                  value={formDataState.pvcFolderName}
                  data-test="folder-name"
                  placeholder="Please enter the folder name"
                  isRequired
                />
              </FormGroup>
            </>
          )}
          <ButtonBar
            className="co-m-btn-bar"
            errorMessage={errorMessage}
            inProgress={inProgress}
          >
            <ActionGroup>
              <Button
                type="submit"
                isDisabled={!isFormValid(formDataState)}
                data-test="data-source-create-button"
                variant="primary"
              >
                {t('Create')}
              </Button>
              <Button onClick={onCancel} variant="secondary">
                {t('Cancel')}
              </Button>
            </ActionGroup>
          </ButtonBar>
        </Form>
      );
    }
  );

export default DataResourceCreateForm;
