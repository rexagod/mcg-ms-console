import * as React from 'react';
import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import * as _ from 'lodash-es';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  ModalVariant,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { K8sResourceKind } from '../../types';
import { AsyncLoader } from '../generics/AsyncLoader';
import { LoadingInline } from '../generics/Loading';
import { NameValueEditorPair } from '../generics/NameValueEditor';
import { getAnnotations } from '../selectors/k8s';
import { ErrorMessage } from './EditLabelModal';
import { CommonModalProps, ModalBody, ModalFooter } from './Modal';

/**
 * Set up an AsyncComponent to wrap the name-value-editor to allow on demand loading to reduce the
 * vendor footprint size.
 */
const NameValueEditorComponent = (props) => (
  <AsyncLoader
    loader={() =>
      import('../generics/NameValueEditor').then((c) => c.NameValueEditor)
    }
    {...props}
  />
);
type AnnotationsModalProps = {
  titleKey: string;
  errorMessage: string;
  extraProps: {
    resource: K8sResourceKind;
    resourceModel: K8sModel;
  };
} & CommonModalProps;

const ANNOTATIONS_PATH = '/metadata/annotations';

export const AnnotationsModal: React.FC<AnnotationsModalProps> = ({
  extraProps: { resource, resourceModel },
  closeModal,
  isOpen,
}) => {
  const [inProgress, setProgress] = React.useState(false);
  const [tags, setTags] = React.useState(() =>
    _.isEmpty(getAnnotations(resource))
      ? [['', '']]
      : _.toPairs(getAnnotations(resource))
  );
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { t } = useTranslation();

  const onSubmit = (e?: any) => {
    setProgress(true);
    if (e) {
      e.preventDefault();
    }
    // We just throw away any rows where the key is blank
    const usedTags = _.reject(tags, (tag) =>
      _.isEmpty(tag[NameValueEditorPair.Name])
    );

    const keys = usedTags.map((tag) => tag[NameValueEditorPair.Name]);
    if (_.uniq(keys).length !== keys.length) {
      setErrorMessage(t('Duplicate keys found.'));
      return;
    }
    const patch = [
      {
        path: ANNOTATIONS_PATH,
        op: _.isEmpty(getAnnotations(resource)) ? 'add' : 'replace',
        value: _.fromPairs(usedTags),
      },
    ];
    k8sPatch({ model: resourceModel, resource, data: patch })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const header = (
    <Title headingLevel="h1" size={TitleSizes['2xl']}>
      {t('Edit annotations')}
    </Title>
  );
  return (
    <Modal
      isOpen={isOpen}
      header={header}
      variant={ModalVariant.small}
      showClose={false}
    >
      <ModalBody className="modalBody">
        <NameValueEditorComponent
          nameValuePairs={tags}
          submit={onSubmit}
          updateParentData={({ nameValuePairs }) => {
            setTags(nameValuePairs);
          }}
        />
        <div>{errorMessage && <ErrorMessage message={errorMessage} />}</div>
      </ModalBody>
      <ModalFooter>
        <Button
          key="cancel"
          variant="secondary"
          onClick={closeModal}
          isDisabled={inProgress}
        >
          {t('Cancel')}
        </Button>
        {!inProgress ? (
          <Button key="Save" variant="primary" onClick={onSubmit}>
            {t('Save')}
          </Button>
        ) : (
          <LoadingInline />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default AnnotationsModal;
