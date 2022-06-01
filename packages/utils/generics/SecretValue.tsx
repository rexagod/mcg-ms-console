import * as React from 'react';
import { Base64 } from 'js-base64';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from '../generics/copy-to-clipboard';

type SecretValueProps = {
  value: string;
  encoded?: boolean;
  reveal: boolean;
};

export const MaskedData: React.FC<{}> = () => {
  const { t } = useTranslation('plugin__mcg-ms-console');
  return (
    <>
      <span className="sr-only">{t('Value hidden')}</span>
      <span aria-hidden="true">&bull;&bull;&bull;&bull;&bull;</span>
    </>
  );
};

export const SecretValue: React.FC<SecretValueProps> = ({
  value,
  reveal,
  encoded = true,
}) => {
  const { t } = useTranslation('plugin__mcg-ms-console');
  if (!value) {
    return <span className="text-muted">{t('No value')}</span>;
  }

  const decodedValue = encoded ? Base64.decode(value) : value;
  const visibleValue = reveal ? decodedValue : <MaskedData />;
  return <CopyToClipboard value={decodedValue} visibleValue={visibleValue} />;
};
