import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StepFieldSummary, StepSummary } from '@/types/formStep.type';
import { FORM_LABELS } from '@/constants/form.constants';
import { InstallationFormValues } from '@/types/form.type';
import { LABELS } from '@/utils/label.constants';
import { ServerConfigVM as VM } from '@/types/servers.type';

export const useFormSummary = (values: InstallationFormValues) => {
  const { t } = useTranslation('installation');

  const getVMFields = (vms: VM[]): StepFieldSummary[] =>
    vms.reduce(
      (fields, vm, index) =>
        [
          ...fields,
          { type: 'subtitle', isMinor: true, label: `${t('vm')} ${index + 1}` },
          { value: vm.name, label: t('server_config_input_vm_name') },
          ...('role' in vm ? [{ value: vm.role, label: t('role') }] : []),
          { value: vm.vcpus, label: FORM_LABELS.vcpus },
          { value: vm.memory, label: t('ram') },
          {
            value: vm.rootPassword,
            label: t('server_config_input_root_password'),
            isSecretValue: true,
          },
          {
            value: vm.ipAddress,
            label: t('server_config_input_ipv4_address'),
          },
          {
            value: vm.instanceNumber,
            label: t('server_config_input_instance_number'),
          },
        ] as StepFieldSummary[],
      [],
    );

  const formSummary: StepSummary[] = useMemo(
    () => [
      {
        id: '1',
        title: t('service_input_vmware'),
        fields: [
          {
            value: values.serviceDisplayName,
            label: t('service_input_vmware'),
          },
          { value: values.datacenterName, label: t('service_input_vdc') },
          { value: values.clusterName, label: t('service_input_cluster') },
        ],
      },
      {
        id: '2',
        title: t('deployment_summary'),
        fields: [
          {
            value: values.applicationVersion,
            label: t('deployment_input_application_version'),
          },
          {
            value: values.applicationType,
            label: t('deployment_input_application_type'),
          },
          {
            value: values.deploymentType,
            label: t('deployment_input_deployment_type'),
          },
        ],
      },
      {
        id: '3',
        title: t('system_summary'),
        fields: [
          { type: 'subtitle', label: FORM_LABELS.sids },
          { value: values.sapSid, label: FORM_LABELS.sapSid },
          { value: values.sapHanaSid, label: FORM_LABELS.sapHanaSid },
          { type: 'subtitle', label: t('passwords') },
          {
            value: values.masterSapPassword,
            label: FORM_LABELS.masterSapPassword,
            isSecretValue: true,
          },
          {
            value: values.masterSapHanaPassword,
            label: FORM_LABELS.masterSapHanaPassword,
            isSecretValue: true,
          },
          {
            value: values.sidadmPassword,
            label: FORM_LABELS.sidadmPassword,
            isSecretValue: true,
          },
          {
            value: values.systemPassword,
            label: FORM_LABELS.systemPassword,
            isSecretValue: true,
          },
        ],
      },
      {
        id: '4',
        title: t('source_summary'),
        fields: [
          { value: values.bucketId, label: t('common_input_container') },
          { value: values.endpoint, label: FORM_LABELS.endpoint },
          { value: values.accessKey, label: t('common_input_access_key') },
          {
            value: values.secretKey,
            label: t('common_input_secret_key'),
            isSecretValue: true,
          },
        ],
      },
      {
        id: '5',
        title: t('os_config_summary'),
        fields: [
          { value: values.domainName, label: t('os_config_input_domain') },
          { value: values.osLicense, label: t('os_config_input_suse') },
          {
            value: values.osUpdate ? t('yes') : t('no'),
            label: t('os_config_toggle_update'),
          },
          {
            value: values.firewallService ? t('yes') : t('no'),
            label: t('os_config_toggle_firewall_service'),
          },
          {
            value: values.firewallServer ? t('yes') : t('no'),
            label: t('os_config_toggle_firewall_server'),
          },
          {
            value: values.firewallDatabase ? t('yes') : t('no'),
            label: t('os_config_toggle_firewall_database'),
          },
        ],
      },
      {
        id: '6',
        title: t('vms'),
        fields: [
          {
            value: values.network,
            label: t('server_config_input_vmware_ports'),
          },
          {
            value: values.netmask,
            label: t('server_config_input_subnet_mask'),
          },
          {
            value: values.gateway,
            label: t('server_config_input_gateway_ip'),
          },
          { type: 'subtitle', label: LABELS.SAP_HANA },
          {
            value: values.hanaServerOva,
            label: t('server_config_input_ova_model'),
          },
          { value: values.hanaServerDatastore, label: FORM_LABELS.datastore },
          {
            value: values.thickDatastorePolicy,
            label: t('server_config_input_thick_storage'),
          },
          ...(values.hanaServers?.length
            ? getVMFields(values.hanaServers)
            : []),
          { type: 'subtitle', label: t('server_config_applications_servers') },
          {
            value: values.applicationServerOva,
            label: t('server_config_input_ova_model'),
          },
          {
            value: values.applicationServerDatastore,
            label: FORM_LABELS.datastore,
          },
          ...(values.applicationServers?.length
            ? getVMFields(values.applicationServers)
            : []),
        ],
      },
      {
        id: '7',
        title: t('enablement_summary'),
        fields: [
          ...(!values.bucketBackint
            ? [
                {
                  value: t('no'),
                  label: t('enablement_input_has_backup'),
                },
              ]
            : [
                {
                  value: t('yes'),
                  label: t('enablement_input_has_backup'),
                },
                {
                  value: values.bucketBackint.id,
                  label: t('common_input_container'),
                },
                {
                  value: values.bucketBackint.endpoint,
                  label: FORM_LABELS.endpoint,
                },
                {
                  value: values.bucketBackint.accessKey,
                  label: t('common_input_access_key'),
                },
                {
                  value: values.bucketBackint.secretKey,
                  label: t('common_input_secret_key'),
                  isSecretValue: true,
                },
              ]),
          ...(!values.logsDataPlatform
            ? [
                {
                  value: t('no'),
                  label: t('enablement_input_has_logs_ldp_ovh'),
                },
              ]
            : [
                {
                  value: t('yes'),
                  label: t('enablement_input_has_logs_ldp_ovh'),
                },
                {
                  value: values.logsDataPlatform.entrypoint,
                  label: t('enablement_input_logstash_entrypoint'),
                },
                {
                  value: values.logsDataPlatform.certificate,
                  label: t('enablement_input_logstash_certificat'),
                  isSecretValue: true,
                },
              ]),
        ],
      },
    ],
    [values],
  );

  return { formSummary };
};
