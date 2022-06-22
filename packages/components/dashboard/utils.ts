import { HealthState } from '../../utils/dashboard/status-card/states';

type SubsystemHealth = {
  message?: string;
  state: HealthState;
};

export const getOperatorHealthState = (
  state: string,
  loading,
  loadError
): SubsystemHealth => {
  if (loading) {
    return { state: HealthState.LOADING };
  }
  if (loadError) {
    return { state: HealthState.NOT_AVAILABLE };
  }
  if (state === 'success') {
    return { state: HealthState.OK };
  }
  return { state: HealthState.ERROR };
};
