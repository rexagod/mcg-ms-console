import * as React from 'react';
import { Select, SelectVariant } from '@patternfly/react-core';
import { useCustomTranslation } from '../hooks/useCustomTranslationHook';

export const StaticDropdown: React.FC<StaticDropdownProps> = ({
  onChange,
  selectOptions,
  valueLabelMap,
  variant = SelectVariant.single,
  'data-test': dataTest,
  ...props
}) => {
  const { t } = useCustomTranslation();

  const [isOpen, setOpen] = React.useState(false);
  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string
  ) => {
    /**
     * For case when the dropdownitem that we want to show on UI (label)
     * and its corresponding value that we want to store in the redux-state is different.
     * e.g: OSDSizeDropdown
     */
    const value = valueLabelMap
      ? Object.keys(valueLabelMap).find(
          (key) => valueLabelMap[key] === selection
        )
      : selection;
    onChange(value);
    variant !== SelectVariant.checkbox && setOpen(false);
  };

  return (
    <div data-test={dataTest}>
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
    </div>
  );
};

export type StaticDropdownProps = {
  id?: string;
  variant?: SelectVariant;
  selections?: string | string[];
  placeholderText?: string;
  valueLabelMap?: { [key: string]: string };
  className?: string;
  selectOptions?: JSX.Element[];
  onChange: (selected: string) => void;
  'data-test'?: string;
};
