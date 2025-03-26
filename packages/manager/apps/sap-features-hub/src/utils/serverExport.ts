import { InstallationFormValues } from '@/types/form.type';
import {
  ApplicationServerExport,
  HanaServerExport,
} from '@/types/servers.type';

export const getServersExport = <T extends 'hana' | 'application'>({
  form,
  type,
}: {
  form: InstallationFormValues;
  type: T;
}): T extends 'hana' ? HanaServerExport[] : ApplicationServerExport[] => {
  const vms = type === 'hana' ? form.hanaServers : form.applicationServers;

  return vms.reduce((list, current) => {
    const vm = {
      ...current,
      network: form.network,
      netmask: form.netmask,
      gateway: form.gateway,
      passwordCrypted: form.passwordCrypted,
      ovaTemplate:
        type === 'hana' ? form.hanaServerOva : form.applicationServerOva,
      datastoreName:
        type === 'hana'
          ? form.hanaServerDatastore
          : form.applicationServerDatastore,
    };

    return type === 'hana'
      ? [...list, { ...vm, thickDatastorePolicy: form.thickDatastorePolicy }]
      : [...list, vm];
  }, [] as HanaServerExport[] | ApplicationServerExport[]);
};
