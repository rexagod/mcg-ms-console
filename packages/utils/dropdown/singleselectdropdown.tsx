import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectVariant } from '@patternfly/react-core';

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  onChange,
  selectOptions,
  selectedKey = '',
  valueLabelMap,
  ...props
}) => {
  const { t } = useTranslation();

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
    setOpen(false);
  };

  return (
    <Select
      {...props}
      variant={SelectVariant.single}
      aria-label={t('Select input')}
      onToggle={setOpen}
      onSelect={onSelect}
      selections={selectedKey}
      isOpen={isOpen}
      placeholderText={props?.placeholderText || t('Select options')}
      aria-labelledby={props?.id}
      noResultsFoundText={t('No results found')}
    >
      {selectOptions}
    </Select>
  );
};

export type SingleSelectDropdownProps = {
  id?: string;
  selectedKey?: string;
  placeholderText?: string;
  valueLabelMap?: { [key: string]: string };
  className?: string;
  selectOptions: JSX.Element[];
  onChange: (selected: string) => void;
};
