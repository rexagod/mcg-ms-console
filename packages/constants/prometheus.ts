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

enum DataResiliencyQuery {
  MCG_REBUILD_PROGRESS_QUERY = 'MCG_REBUILD_PROGRESS_QUERY',
  MCG_REBUILD_TIME_QUERY = 'MCG_REBUILD_TIME_QUERY',
}

export const dataResiliencyQueryMap = {
  [DataResiliencyQuery.MCG_REBUILD_PROGRESS_QUERY]:
    'NooBaa_rebuild_progress/100',
  [DataResiliencyQuery.MCG_REBUILD_TIME_QUERY]: 'NooBaa_rebuild_time',
};
