import { WindowObject } from '../types';
import { ONE_HOUR } from './common';

export const MCG_MS_PROMETHEUS_URL =
  '/api/proxy/plugin/mcg-ms-console/prometheus-proxy';
export const PROMETHEUS_BASE_PATH = (window as WindowObject).SERVER_FLAGS
  .prometheusBaseURL;
export const PROMETHEUS_TENANCY_BASE_PATH = (window as WindowObject)
  .SERVER_FLAGS.prometheusTenancyBaseURL;
export const DEFAULT_PROMETHEUS_SAMPLES = 60;
export const DEFAULT_PROMETHEUS_TIMESPAN = ONE_HOUR;

export enum PrometheusEndpoint {
  LABEL = 'api/v1/label',
  QUERY = 'api/v1/query',
  QUERY_RANGE = 'api/v1/query_range',
  RULES = 'api/v1/rules',
  TARGETS = 'api/v1/targets',
}
