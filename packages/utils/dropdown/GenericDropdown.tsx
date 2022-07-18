import * as React from 'react';
import {
  useK8sWatchResource,
  WatchK8sResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { K8sResourceKind } from '../../types';
import { StatusBox } from '../../utils/generics/status-box';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';
import { getName, getUID } from '../../utils/selectors/k8s';
import './resourceDropdown.scss';

export const GenericDropdown: React.FC<GenericDropdown> = ({
  onChangeSelect,
  onChangeSelectOps,
  resource: watchResource,
  propertySelector = getName,
  secondaryTextGenerator,
  variant = SelectVariant.single,
  ...props
}) => {
  const { t } = useCustomTranslation();

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string
  ) => {
    onChangeSelect?.(selection);
    variant !== SelectVariant.checkbox && setOpen(false);
  };

  const onClick = React.useCallback(
    (resource: K8sResourceKind) =>
      (event: React.MouseEvent | React.ChangeEvent) =>
        onChangeSelectOps?.(resource),
    [onChangeSelectOps]
  );

  const [isOpen, setOpen] = React.useState(false);
  const [resources, loaded, loadError] =
    useK8sWatchResource<K8sResourceKind[]>(watchResource);

  const selectOptions: JSX.Element[] = React.useMemo(
    () =>
      resources.reduce((acc, resource) => {
        acc.push(
          <SelectOption
            key={getUID(resource)}
            value={propertySelector(resource)}
            description={secondaryTextGenerator?.(resource)}
            onClick={onClick(resource)}
          />
        );
        return acc;
      }, []),
    [resources, propertySelector, secondaryTextGenerator, onClick]
  );

  if (loaded && !loadError) {
    return (
      <Select
        {...props}
        variant={variant}
        aria-label={t('Select input')}
        onToggle={setOpen}
        onSelect={onSelect}
        isOpen={isOpen}
        placeholderText={props?.placeholderText || t('Select options')}
        aria-labelledby={props?.id}
        noResultsFoundText={t('No results found')}
      >
        {selectOptions}
      </Select>
    );
  }

  return <StatusBox loadError={loadError} loaded={loaded} />;
};

export type GenericDropdown = {
  id?: string;
  variant?: SelectVariant;
  selections?: string | string[];
  placeholderText?: string;
  className?: string;
  resource: WatchK8sResource;
  propertySelector?: (resource: K8sResourceKind) => string;
  secondaryTextGenerator?: (resource: K8sResourceKind) => string;
  onChangeSelect?: (selected: string) => void;
  onChangeSelectOps?: (resource: K8sResourceKind) => void;
};
