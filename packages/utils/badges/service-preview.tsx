import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@patternfly/react-core';
import './badge.scss';

const ServicePreviewBadge: React.FC = () => {
  const { t } = useTranslation();
  return <Label className="mcg-ms-preview-badge">{t('Service preview')}</Label>;
};

export default ServicePreviewBadge;
