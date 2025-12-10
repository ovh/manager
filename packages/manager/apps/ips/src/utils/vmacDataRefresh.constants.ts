import { UPDATE_TASKS_QUERY_KEY_PARAMS } from './dataRefresh.constants';

export const VMAC_UPDATE_FUNCTION_LIST = [
  'virtualMacAdd',
  'addVirtualMac',
  'removeVirtualMac',
  'virtualMacDelete',
];

export const VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS = {
  ...UPDATE_TASKS_QUERY_KEY_PARAMS,
  functionList: VMAC_UPDATE_FUNCTION_LIST,
};
