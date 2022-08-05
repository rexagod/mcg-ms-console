import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { useCustomTranslation } from '../../utils/hooks/useCustomTranslationHook';
import './badge.scss';

const ServicePreviewBadge: React.FC = () => {
  const { t } = useCustomTranslation();
  return <Label className="mcg-ms-preview-badge">{t('Service preview')}</Label>;
};

export default ServicePreviewBadge;
