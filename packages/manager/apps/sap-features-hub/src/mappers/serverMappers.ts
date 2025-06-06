import {
  InstallationFormValues,
  StructuredInstallationForm,
} from '@/types/form.type';
import {
  ApplicationServer,
  ApplicationServerExport,
  HanaServer,
  HanaServerExport,
  ServerConfigVM as BaseVM,
} from '@/types/servers.type';

const getServersExport = <T extends 'hana' | 'application'>({
  form,
  type,
}: {
  form: InstallationFormValues;
  type: T;
}): T extends 'hana' ? HanaServerExport[] : ApplicationServerExport[] => {
  const vms = type === 'hana' ? form.hanaServers : form.applicationServers;

  return vms?.reduce((list, current) => {
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

const mapServerExportToBase = (
  vm: HanaServerExport | ApplicationServerExport,
): HanaServer | ApplicationServer => {
  const base: BaseVM = {
    name: vm.name,
    rootPassword: vm.rootPassword,
    ipAddress: vm.ipAddress,
    instanceNumber: vm.instanceNumber,
    memory: vm.memory,
    vcpus: vm.vcpus,
  };

  return 'role' in vm ? { ...base, role: vm.role } : base;
};

const getBaseServers = <T extends 'hana' | 'application'>({
  form,
  type,
}: {
  form: StructuredInstallationForm;
  type: T;
}): T extends 'hana' ? HanaServer[] : ApplicationServer[] => {
  const vms = type === 'hana' ? form.hanaServers : form.applicationServers;

  return vms?.reduce(
    (list, current) => [...list, mapServerExportToBase(current)],
    [] as HanaServer[] | ApplicationServer[],
  );
};

export const serverMappers = {
  toExport: getServersExport,
  toBase: getBaseServers,
};
