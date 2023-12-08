/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@ovhcloud/msc-stencil-tail-logs/custom-elements';

import { defineCustomElement as defineMscTailLogs } from '@ovhcloud/msc-stencil-tail-logs/custom-elements/msc-tail-logs.js';
import { defineCustomElement as defineMscTailLogsCode } from '@ovhcloud/msc-stencil-tail-logs/custom-elements/msc-tail-logs-code.js';


export const MscTailLogs = /*@__PURE__*/ defineContainer<JSX.MscTailLogs>('msc-tail-logs', defineMscTailLogs, [
  'source',
  'sort',
  'limit',
  'apiVersion',
  'refreshInterval',
  'locale',
  'autoRefresh'
]);


export const MscTailLogsCode = /*@__PURE__*/ defineContainer<JSX.MscTailLogsCode>('msc-tail-logs-code', defineMscTailLogsCode, [
  'logs'
]);

