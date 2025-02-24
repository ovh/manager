import { StepSummary } from '@/types/formStep.type';
import { mockedValues as mock } from './installationForm.mock';
import { FORM_LABELS } from '@/constants/form.constants';
import { labels } from '@/test-utils';

const { installation: l } = labels;

export const mockedFormSummary: { formSummary: StepSummary[] } = {
  formSummary: [
    {
      id: '1',
      title: l.service_input_vmware,
      fields: [
        { value: mock.serviceDisplayName, label: l.service_input_vmware },
        { value: mock.datacenterName, label: l.service_input_vdc },
        { value: mock.clusterName, label: l.service_input_cluster },
      ],
    },
    {
      id: '2',
      title: l.deployment_summary,
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
        { type: 'subtitle', label: l.passwords },
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
        { value: mock.accessKey, label: l.common_input_access_key },
        {
          value: mock.secretKey,
          label: l.common_input_secret_key,
          isSecretValue: true,
        },
      ],
    },
    {
      id: '5',
      title: l.os_config_summary,
      fields: [
        { value: mock.domainName, label: l.os_config_input_domain },
        { value: mock.osLicense, label: l.os_config_input_suse },
        {
          value: mock.osUpdate ? l.yes : l.no,
          label: l.os_config_toggle_update,
        },
        {
          value: mock.firewallService ? l.yes : l.no,
          label: l.os_config_toggle_firewall_service,
        },
        {
          value: mock.firewallServer ? l.yes : l.no,
          label: l.os_config_toggle_firewall_server,
        },
        {
          value: mock.firewallDatabase ? l.yes : l.no,
          label: l.os_config_toggle_firewall_database,
        },
      ],
    },
    {
      id: '6',
      title: l.enablement_summary,
      fields: [
        {
          value: mock.bucketBackint ? l.yes : l.no,
          label: l.enablement_input_has_backup,
        },
        { value: mock.bucketBackint?.id, label: l.common_input_container },
        { value: mock.bucketBackint?.endpoint, label: FORM_LABELS.endpoint },
        {
          value: mock.bucketBackint?.accessKey,
          label: l.common_input_access_key,
        },
        {
          value: mock.bucketBackint?.secretKey,
          label: l.common_input_secret_key,
          isSecretValue: true,
        },
        {
          value: mock.logsDataPlatform ? l.yes : l.no,
          label: l.enablement_input_has_logs_ldp_ovh,
        },
        {
          value: mock.logsDataPlatform?.entrypoint,
          label: l.enablement_input_logstash_entrypoint,
        },
        {
          value: mock.logsDataPlatform?.certificate,
          label: l.enablement_input_logstash_certificat,
        },
      ],
    },
  ],
};
