import { BaseVM, HanaServer, ApplicationServer } from '@/types/servers.type';
import { SERVER_CONFIG_LIMITS } from '@/pages/installation/stepServerConfig/installationStepServerConfig.constants';

const BASE_VM: BaseVM = {
  name: '',
  rootPassword: '',
  ipAddress: '',
  instanceNumber: '',
};

export const DEFAULT_HANA_SERVER: HanaServer = {
  ...BASE_VM,
  vcpus: SERVER_CONFIG_LIMITS.vmHanaMinVcpu,
  memory: SERVER_CONFIG_LIMITS.vmHanaMinRam,
};

export const DEFAULT_APPLICATION_SERVER: ApplicationServer = {
  ...BASE_VM,
  role: 'DI',
  vcpus: SERVER_CONFIG_LIMITS.vmApplicationMinVcpu,
  memory: SERVER_CONFIG_LIMITS.vmApplicationMinRam,
};
