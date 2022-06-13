import { PrometheusResponse } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';

export const getMetric = (result: PrometheusResponse, metric: string): string =>
  _.get(result, ['data', 'result', '0', 'metric', metric], null);
