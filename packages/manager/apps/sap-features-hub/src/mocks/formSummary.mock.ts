import { StepFieldSummary, StepSummary } from '@/types/formStep.type';
import { mockedValues as mock } from './installationForm.mock';
import { FORM_LABELS } from '@/constants/form.constants';
import { labels } from '@/test-utils';
import { LABELS } from '@/utils/label.constants';
import { ServerConfigVM as VM } from '@/types/servers.type';

const { installation: l, system: lSystem, form: lForm } = labels;

const getVMFields = (vms: VM[]): StepFieldSummary[] =>
  vms.reduce(
    (fields, vm, index) =>
      [
        ...fields,
        {
          type: 'subtitle',
          isMinor: true,
          label: `${lSystem.vm} ${index + 1}`,
        },
        { value: vm.name, label: l.server_config_input_vm_name },
        ...('role' in vm ? [{ value: vm.role, label: lSystem.role }] : []),
        { value: vm.vcpus, label: FORM_LABELS.vcpus },
        { value: vm.memory, label: lSystem.ram_gb },
        {
          value: vm.rootPassword,
          label: lSystem.password_root,
          isSecretValue: true,
        },
        {
          value: vm.ipAddress,
          label: lSystem.address_ipv4,
        },
        {
          value: vm.instanceNumber,
          label: l.server_config_input_instance_number,
        },
      ] as StepFieldSummary[],
    [],
  );

export const mockedFormSummary: { formSummary: StepSummary[] } = {
  formSummary: [
    {
      id: '1',
      title: l.service_input_vmware,
      fields: [
        { value: mock.serviceDisplayName, label: l.service_input_vmware },
        { value: mock.datacenterName, label: lSystem.datacentre },
        { value: mock.clusterName, label: lSystem.cluster },
      ],
    },
    {
      id: '2',
      title: lSystem.installation,
      fields: [
        {
          value: mock.applicationVersion,
          label: l.deployment_input_application_version,
        },
        {
          value: mock.applicationType,
          label: l.deployment_input_application_type,
        },
        {
          value: mock.deploymentType,
          label: l.deployment_input_deployment_type,
        },
      ],
    },
    {
      id: '3',
      title: l.system_summary,
      fields: [
        { type: 'subtitle', label: FORM_LABELS.sids },
        { value: mock.sapSid, label: FORM_LABELS.sapSid },
        { value: mock.sapHanaSid, label: FORM_LABELS.sapHanaSid },
        { type: 'subtitle', label: lSystem.passwords },
        {
          value: mock.masterSapPassword,
          label: FORM_LABELS.masterSapPassword,
          isSecretValue: true,
        },
        {
          value: mock.masterSapHanaPassword,
          label: FORM_LABELS.masterSapHanaPassword,
          isSecretValue: true,
        },
        {
          value: mock.sidadmPassword,
          label: FORM_LABELS.sidadmPassword,
          isSecretValue: true,
        },
        {
          value: mock.systemPassword,
          label: FORM_LABELS.systemPassword,
          isSecretValue: true,
        },
      ],
    },
    {
      id: '4',
      title: l.source_summary,
      fields: [
        { value: mock.bucketId, label: l.common_input_container },
        { value: mock.endpoint, label: FORM_LABELS.endpoint },
        { value: mock.accessKey, label: lSystem.key_access },
        {
          value: mock.secretKey,
          label: lSystem.key_secret,
          isSecretValue: true,
        },
      ],
    },
    {
      id: '5',
      title: l.os_config_summary,
      fields: [
        { value: mock.domainName, label: lSystem.domain_name },
        { value: mock.osLicense, label: l.os_config_input_suse },
        {
          value: mock.osUpdate ? lForm.yes : lForm.no,
          label: l.os_config_toggle_update,
        },
        {
          value: mock.firewallService ? lForm.yes : lForm.no,
          label: l.os_config_toggle_firewall_service,
        },
        {
          value: mock.firewallServer ? lForm.yes : lForm.no,
          label: l.os_config_toggle_firewall_server,
        },
        {
          value: mock.firewallDatabase ? lForm.yes : lForm.no,
          label: l.os_config_toggle_firewall_database,
        },
      ],
    },
    {
      id: '6',
      title: lSystem.vms,
      fields: [
        {
          value: mock.network,
          label: l.server_config_input_vmware_ports,
        },
        {
          value: mock.netmask,
          label: l.server_config_input_subnet_mask,
        },
        {
          value: mock.gateway,
          label: l.server_config_input_gateway_ip,
        },
        { type: 'subtitle', label: LABELS.SAP_HANA },
        {
          value: mock.hanaServerOva,
          label: l.server_config_input_ova_model,
        },
        { value: mock.hanaServerDatastore, label: FORM_LABELS.datastore },
        {
          value: mock.thickDatastorePolicy,
          label: l.server_config_input_thick_storage,
        },
        ...(mock.hanaServers?.length ? getVMFields(mock.hanaServers) : []),
        { type: 'subtitle', label: l.server_config_applications_servers },
        {
          value: mock.applicationServerOva,
          label: l.server_config_input_ova_model,
        },
        {
          value: mock.applicationServerDatastore,
          label: FORM_LABELS.datastore,
        },
        ...(mock.applicationServers?.length
          ? getVMFields(mock.applicationServers)
          : []),
      ],
    },
    {
      id: '7',
      title: l.enablement_summary,
      fields: [
        {
          value: mock.bucketBackint ? lForm.yes : lForm.no,
          label: l.enablement_input_has_backup,
        },
        { value: mock.bucketBackint?.id, label: l.common_input_container },
        { value: mock.bucketBackint?.endpoint, label: FORM_LABELS.endpoint },
        {
          value: mock.bucketBackint?.accessKey,
          label: lSystem.key_access,
        },
        {
          value: mock.bucketBackint?.secretKey,
          label: lSystem.key_secret,
          isSecretValue: true,
        },
        {
          value: mock.logsDataPlatform ? lForm.yes : lForm.no,
          label: l.enablement_input_has_logs_ldp_ovh,
        },
        {
          value: mock.logsDataPlatform?.entrypoint,
          label: l.enablement_input_logstash_entrypoint,
        },
        {
          value: mock.logsDataPlatform?.certificate,
          label: l.enablement_input_logstash_certificat,
          isSecretValue: true,
        },
      ],
    },
  ],
};
