import * as React from "react";
import { k8sCreate } from "@openshift-console/dynamic-plugin-sdk";
import classNames from "classnames";
import { TFunction } from "i18next";
import * as _ from "lodash";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  Form,
  TextInput,
  Tooltip,
  SelectOption,
  ActionGroup,
  Button
} from "@patternfly/react-core";
import {
  BC_PROVIDERS,
  BUCKET_LABEL_NOOBAA_MAP,
  DATA_FEDERATION_NAMESPACE,
  NOOBAA_TYPE_MAP,
  PROVIDERS_NOOBAA_MAP,
  StoreType
} from "../../constants";
import {
  SecretModel,
  NooBaaNamespaceStoreModel,
  PersistentVolumeClaimModel
} from "../../models";
import {
  NamespaceStoreKind,
  Payload,
  PersistentVolumeClaimKind,
  SecretKind
} from "../../types";
import {
  getExternalProviders,
  getProviders,
  secretPayloadCreator
} from "../../utils";
import ResourceDropdown from "../../utils/dropdown/ResourceDropdown";
import { SingleSelectDropdown } from "../../utils/dropdown/singleselectdropdown";
import { ButtonBar } from "../../utils/generics/ButtonBar";
import {
  HandlePromiseProps,
  withHandlePromise
} from "../../utils/generics/promise-component";
import { getAPIVersionForModel } from "../../utils/selectors/k8s";
import "../noobaa-provider-endpoints/noobaa-provider-endpoints.scss";
import { S3EndPointType } from "../noobaa-provider-endpoints/s3-endpoint-type";
import { pvcResource } from "../resources";
import { initialState, providerDataReducer } from "./reducer";

const PROVIDERS = getProviders(StoreType.NS);
const externalProviders = getExternalProviders(StoreType.NS);

const providerDropdownOptions: (t: TFunction) => JSX.Element[] = (t) =>
  _.map(PROVIDERS, (v, _) => <SelectOption key={v} value={v} />);

const filterPVCResource = (pvcObj: PersistentVolumeClaimKind) =>
  pvcObj?.status?.phase === "Bound" &&
  pvcObj?.spec?.accessModes.some((mode) => mode === "ReadWriteMany");

type NamespaceStoreFormProps = {
  redirectHandler: (resources?: (NamespaceStoreKind | SecretKind)[]) => void;
  namespace: string;
  className?: string;
  onCancel: () => void;
};

const NamespaceStoreForm: React.FC<NamespaceStoreFormProps> = withHandlePromise<
  NamespaceStoreFormProps & HandlePromiseProps
>((props) => {
  const { t } = useTranslation("plugin__dfr-console");
  const [nsName, setNsName] = React.useState("");
  const [provider, setProvider] = React.useState(BC_PROVIDERS.AWS);
  const [pvc, setPVC] = React.useState(null);
  const [folderName, setFolderName] = React.useState("");
  const [providerDataState, providerDataDispatch] = React.useReducer(
    providerDataReducer,
    initialState
  );
  const handleNsNameTextInputChange = (strVal: string) => setNsName(strVal);
  const {
    onCancel,
    className,
    inProgress,
    errorMessage,
    handlePromise,
    redirectHandler,
    namespace
  } = props;

  const onSubmit = (event) => {
    event.preventDefault();
    /** Create a secret if secret ==='' */
    let { secretName } = providerDataState;
    const promises = [];

    if (!secretName) {
      secretName = nsName.concat("-secret");
      const { secretKey, accessKey } = providerDataState;
      const secretPayload = secretPayloadCreator(
        provider,
        namespace,
        secretName,
        accessKey,
        secretKey
      );
      providerDataDispatch({ type: "setSecretName", value: secretName });
      promises.push(k8sCreate({ model: SecretModel, data: secretPayload }));
    }
    /** Payload for ns */
    const nsPayload: Payload = {
      apiVersion: getAPIVersionForModel(NooBaaNamespaceStoreModel),
      kind: NooBaaNamespaceStoreModel.kind,
      metadata: {
        namespace,
        name: nsName
      },
      spec: {
        type: NOOBAA_TYPE_MAP[provider],
        ssl: false
      }
    };
    if (externalProviders.includes(provider)) {
      nsPayload.spec = {
        ...nsPayload.spec,
        [PROVIDERS_NOOBAA_MAP[provider]]: {
          [BUCKET_LABEL_NOOBAA_MAP[provider]]: providerDataState.target,
          secret: {
            name: secretName,
            namespace
          }
        }
      };
    }
    if (provider === BC_PROVIDERS.S3) {
      nsPayload.spec.s3Compatible = {
        ...nsPayload.spec.s3Compatible,
        endpoint: providerDataState.endpoint
      };
    } else if (provider === BC_PROVIDERS.IBM) {
      nsPayload.spec.ibmCos = {
        ...nsPayload.spec.ibmCos,
        endpoint: providerDataState.endpoint
      };
    }
    // Add region in the end
    if (provider === BC_PROVIDERS.AWS) {
      nsPayload.spec.awsS3 = {
        ...nsPayload.spec.awsS3,
        region: providerDataState.region
      };
    }
    if (provider === BC_PROVIDERS.FILESYSTEM) {
      nsPayload.spec.nsfs = {
        ...nsPayload.spec.nsfs,
        pvcName: pvc,
        subPath: folderName
      };
    }
    promises.push(
      k8sCreate({ model: NooBaaNamespaceStoreModel, data: nsPayload })
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
      className={classNames("nb-endpoints-form", "co-m-pane__body", className)}
      onSubmit={onSubmit}
      noValidate={false}
    >
      <FormGroup
        label={t("Namespace store name")}
        fieldId="namespacestore-name"
        className="nb-endpoints-form-entry"
        helperText={t(
          "A unique name for the namespace store within the project"
        )}
        isRequired
      >
        <Tooltip
          content={t("Name can contain a max of 43 characters")}
          isVisible={nsName.length > 42}
          trigger="manual"
        >
          <TextInput
            id="ns-name"
            onChange={handleNsNameTextInputChange}
            value={nsName}
            maxLength={43}
            data-test="namespacestore-name"
            placeholder="my-namespacestore"
          />
        </Tooltip>
      </FormGroup>

      <FormGroup
        label={t("Provider")}
        fieldId="provider-name"
        className="nb-endpoints-form-entry"
        isRequired
      >
        <SingleSelectDropdown
          id="providers"
          className="nb-endpoints-form-entry__dropdown"
          onChange={(selectedProvider) => {
            setProvider(PROVIDERS[selectedProvider]);
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
          state={providerDataState}
          dispatch={providerDataDispatch}
        />
      )}
      {provider === BC_PROVIDERS.FILESYSTEM && (
        <>
          <FormGroup
            label={t("Persistent volume claim")}
            fieldId="pvc-name"
            className="nb-endpoints-form-entry"
            isRequired
          >
            <ResourceDropdown<PersistentVolumeClaimKind>
              id="pvc-name"
              className="nb-endpoints-form-entry__dropdown nb-endpoints-form-entry__dropdown--full-width"
              resource={pvcResource}
              resourceModel={PersistentVolumeClaimModel}
              onSelect={setPVC}
              filterResource={filterPVCResource}
            />
          </FormGroup>
          <FormGroup
            label={t("Folder")}
            fieldId="folder-name"
            className="nb-endpoints-form-entry"
            helperText={t(
              "If the name you write exists, we will be using the existing folder if not we will create a new folder "
            )}
            isRequired
          >
            <TextInput
              id="folder-name"
              onChange={setFolderName}
              value={folderName}
              data-test="folder-name"
              placeholder="Please enter the folder name"
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
            data-test="namespacestore-create-button"
            variant="primary"
          >
            {t("Create")}
          </Button>
          <Button onClick={onCancel} variant="secondary">
            {t("Cancel")}
          </Button>
        </ActionGroup>
      </ButtonBar>
    </Form>
  );
});

export default NamespaceStoreForm;
