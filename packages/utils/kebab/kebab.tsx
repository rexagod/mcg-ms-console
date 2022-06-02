import * as React from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  KebabToggle,
  DropdownItemProps,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import { ModalKeys, LaunchModal } from '../modals/modalLauncher';

export type CustomKebabItemsType = (t: TFunction) => {
  [key: string]: {
    value: string;
    props?: DropdownItemProps;
  };
};

type KebabProps = {
  launchModal: LaunchModal;
  extraProps: {
    resource: K8sResourceCommon;
    resourceModel: K8sModel;
    [key: string]: any;
  };
  customKebabItems?: CustomKebabItemsType;
  toggleType?: 'Kebab' | 'Dropdown';
  isDisabled?: boolean;
};

const defaultKebabItems = (t: TFunction, resourceLabel: string) => ({
  [ModalKeys.EDIT_LABELS]: (
    <DropdownItem key={ModalKeys.EDIT_LABELS} id={ModalKeys.EDIT_LABELS}>
      {t('Edit labels')}
    </DropdownItem>
  ),
  [ModalKeys.EDIT_ANN]: (
    <DropdownItem key={ModalKeys.EDIT_ANN} id={ModalKeys.EDIT_ANN}>
      {t('Edit annotations')}
    </DropdownItem>
  ),
  [ModalKeys.DELETE]: (
    <DropdownItem key={ModalKeys.DELETE} id={ModalKeys.DELETE}>
      {t('Delete {{resourceLabel}}', { resourceLabel })}
    </DropdownItem>
  ),
});

export const Kebab: React.FC<KebabProps> = ({
  launchModal,
  extraProps,
  customKebabItems,
  toggleType = 'Kebab',
  isDisabled,
}) => {
  const { t } = useTranslation();

  const [isOpen, setOpen] = React.useState(false);

  const { resourceModel } = extraProps;

  const resourceLabel = resourceModel.label;

  const onClick = (event?: React.SyntheticEvent<HTMLDivElement>) => {
    setOpen(false);
    const actionKey = event.currentTarget.id;
    launchModal(actionKey, extraProps);
  };

  const dropdownItems = React.useMemo(() => {
    const defaultResolved = defaultKebabItems(t, resourceLabel);
    const customResolved = customKebabItems ? customKebabItems(t) : {};
    const { overrides, custom } = Object.entries(customResolved).reduce(
      (acc, [k, obj]) => {
        const dropdownItem = (
          <DropdownItem key={k} id={k} {...obj?.props}>
            {obj?.value}
          </DropdownItem>
        );

        if (
          [
            ModalKeys.EDIT_LABELS,
            ModalKeys.EDIT_ANN,
            ModalKeys.DELETE,
          ].includes(k as ModalKeys)
        ) {
          acc['overrides'][k] = dropdownItem;
        } else {
          acc['custom'][k] = dropdownItem;
        }
        return acc;
      },
      { overrides: {}, custom: {} }
    );
    const deafultItems = Object.values(
      Object.assign(defaultResolved, overrides)
    );

    const customItems = Object.values(custom) ?? [];

    return [...customItems, ...deafultItems];
  }, [t, customKebabItems, resourceLabel]);

  const toggle = React.useMemo(() => {
    const onToggle = () => setOpen((open) => !open);
    return toggleType === 'Kebab' ? (
      <KebabToggle onToggle={onToggle} isDisabled={isDisabled} />
    ) : (
      <DropdownToggle
        onToggle={onToggle}
        toggleIndicator={CaretDownIcon}
        isDisabled={isDisabled}
      >
        Actions
      </DropdownToggle>
    );
  }, [setOpen, toggleType, isDisabled]);

  return (
    <Dropdown
      onSelect={onClick}
      toggle={toggle}
      isOpen={isOpen}
      isPlain={toggleType === 'Kebab' ? true : false}
      dropdownItems={dropdownItems}
      position="right"
    />
  );
};
