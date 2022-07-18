import { useTranslation } from 'react-i18next';

export const useCustomTranslation = (NS = 'plugin__mcg-ms-console') =>
  useTranslation(NS);
