import * as React from 'react';
import { TFunction } from 'i18next';
import {
  GrayUnknownIcon,
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
} from '../../status/icons';

export enum HealthState {
  OK = 'OK',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

export const healthStateMessage = (
  state: keyof typeof HealthState,
  t: TFunction
): string => {
  switch (state) {
    case HealthState.OK:
      return '';
    case HealthState.ERROR:
      return t('Degraded');
    case HealthState.LOADING:
      return t('Loading');
    case HealthState.NOT_AVAILABLE:
      return t('Not available');
    default:
      return t('Unknown');
  }
};

export type HealthStateMappingValues = {
  icon: React.ReactNode;
  priority: number;
  health: HealthState;
};

export const healthStateMapping: {
  [key in HealthState]: HealthStateMappingValues;
} = {
  [HealthState.OK]: {
    priority: 0,
    health: HealthState.OK,
    icon: <GreenCheckCircleIcon title="Healthy" />,
  },
  [HealthState.UNKNOWN]: {
    priority: 1,
    health: HealthState.UNKNOWN,
    icon: <GrayUnknownIcon title="Unknown" />,
  },
  [HealthState.ERROR]: {
    priority: 6,
    health: HealthState.ERROR,
    icon: <RedExclamationCircleIcon title="Error" />,
  },
  [HealthState.LOADING]: {
    priority: 7,
    health: HealthState.LOADING,
    icon: <div className="skeleton-health" />,
  },
  [HealthState.NOT_AVAILABLE]: {
    priority: 8,
    health: HealthState.NOT_AVAILABLE,
    icon: <GrayUnknownIcon title="Not available" />,
  },
};
