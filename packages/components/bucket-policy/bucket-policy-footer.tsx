import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { ActionGroup, Button } from '@patternfly/react-core';
import { BucketClassType } from '../../constants';
import { ButtonBar } from '../../utils/generics/ButtonBar';
import { BucketPolicyState } from './state';

const checkRequiredValues = (state: BucketPolicyState) =>
  !!state.bucketName?.trim() &&
  !!state.obcNamespace &&
  (state.dataResourceType === BucketClassType.SINGLE
    ? !!state.readWriteSingle
    : !!state.writeResourceMulti && !_.isEmpty(state.readResourceMulti));

export const BucketPolicyFooter: React.FC<BucketPolicyFooterProps> = ({
  state,
  loaded,
  error,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <ButtonBar errorMessage={state.errorMessage} inProgress={state.inProgress}>
      <ActionGroup className="pf-c-form pf-c-form__actions--left">
        <Button
          type="button"
          variant="primary"
          data-test-id="confirm-action-bucket"
          onClick={onConfirm}
          isDisabled={!checkRequiredValues(state) || !loaded || !!error}
        >
          {t('Create')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          data-test-id="cancel-action-bucket"
          onClick={onCancel}
        >
          {t('Cancel')}
        </Button>
      </ActionGroup>
    </ButtonBar>
  );
};

type BucketPolicyFooterProps = {
  state: BucketPolicyState;
  loaded: boolean;
  error: any;
  onCancel: () => void;
  onConfirm: () => void;
};
