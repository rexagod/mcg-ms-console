import * as React from 'react';
import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Alert, Button, Modal, ModalVariant } from '@patternfly/react-core';
import { DeploymentModel } from '../../../models';
import { DeploymentKind, K8sResourceKind } from '../../../types';
import { resourcePathFromModel } from '../../../utils';
import { getAttachOBCPatch } from '../../../utils';
import ResourceDropdown from '../../../utils/dropdown/ResourceDropdown';
import { LoadingInline } from '../../../utils/generics/Loading';
import {
  CommonModalProps,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../utils/modals/Modal';
import { getName } from '../../../utils/selectors/k8s';
import './attach-deployment.scss';

type AttachDeploymentToOBCModalProps = CommonModalProps<{
  resource: K8sResourceKind;
  namespace: string;
}>;

const AttachDeploymentToOBCModal: React.FC<AttachDeploymentToOBCModalProps> = (
  props
) => {
  const { t } = useTranslation('plugin__mcg-ms-console');
  const [requestDeployment, setRequestedDeployment] =
    React.useState<DeploymentKind>(null);
  const [inProgress, setProgress] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const {
    closeModal,
    isOpen,
    extraProps: { resource, namespace },
  } = props;

  const history = useHistory();

  // Deployments

  const deploymentResource = {
    kind: DeploymentModel.kind,
    namespaced: true,
    isList: true,
    namespace,
  };

  const obcName = getName(resource);

  const submit: React.FormEventHandler<EventTarget> = (e) => {
    setProgress(true);
    e.preventDefault();
    k8sPatch({
      model: DeploymentModel,
      resource: requestDeployment,
      data: getAttachOBCPatch(obcName, requestDeployment),
    })
      .then((res) => {
        history.push(
          `${resourcePathFromModel(
            DeploymentModel,
            res.metadata.name,
            res.metadata.namespace
          )}/environment`
        );
        closeModal();
      })
      .catch((err) => {
        setErrorMessage(err);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const Header = <ModalHeader>{t('Attach OBC to a Deployment')}</ModalHeader>;

  return (
    <Modal
      header={Header}
      isOpen={isOpen}
      onClose={closeModal}
      showClose={false}
      hasNoBodyWrapper
      variant={ModalVariant.small}
    >
      <ModalBody>
        <div>
          <label
            htmlFor="dropdown-selectbox"
            className="control-label co-required"
          >
            {t('Deployment Name')}
          </label>
        </div>
        <ResourceDropdown<DeploymentKind>
          className="odf-deployment__dropdown"
          id="dropdown-selectbox"
          resource={deploymentResource}
          resourceModel={DeploymentModel}
          onSelect={(resource) => setRequestedDeployment(resource)}
        />
        {errorMessage && (
          <Alert isInline variant="danger" title={t('An error occurred')}>
            {(errorMessage as any)?.message}
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button key="cancel" variant="secondary" onClick={closeModal}>
          {t('Cancel')}
        </Button>
        {!inProgress ? (
          <Button key="Attach" variant="primary" onClick={submit}>
            {t('Attach')}
          </Button>
        ) : (
            <LoadingInline />
          )}
      </ModalFooter>
    </Modal>
  );
};

export default AttachDeploymentToOBCModal;
