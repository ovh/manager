import { useTranslation } from 'react-i18next';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { StepSummary } from '@/types/formStep.type';
import { FORM_LABELS } from '@/constants/form.constants';

export const useFormSummary = () => {
  const { t } = useTranslation('installation');
  const { values } = useInstallationFormContext();

  const formSummary: StepSummary[] = [
    {
      id: '1',
      title: t('service_input_vmware'),
      fields: [
        { value: values.serviceName, label: t('service_input_vmware') },
        { value: values.datacenterId, label: t('service_input_vdc') },
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
          value: values.sidamnPassword,
          label: FORM_LABELS.sidamnPassword,
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
        { value: values.secretKey, label: t('common_input_secret_key') },
      ],
    },
    {
      id: '5',
      title: t('os_config_summary'),
      fields: [
        { value: values.domainName, label: t('os_config_input_domain') },
        { value: values.osLicense, label: t('os_config_input_suse') },
        {
          value: values.osUpdate
            ? t('activated_label')
            : t('desactivated_label'),
          label: t('os_config_toggle_update_summary'),
        },
        {
          value: values.firewallService
            ? t('activated_label')
            : t('desactivated_label'),
          label: t('os_config_toggle_firewall_service_summary'),
        },
        {
          value: values.firewallServer
            ? t('activated_label')
            : t('desactivated_label'),
          label: t('os_config_toggle_firewall_server_summary'),
        },
        {
          value: values.firewallDatabase
            ? t('activated_label')
            : t('desactivated_label'),
          label: t('os_config_toggle_firewall_database_summary'),
        },
      ],
    },
    {
      id: '6',
      title: t('enablement_summary'),
      fields: [
        {
          value:
            values.bucketBackint &&
            Object.values(values.bucketBackint).some((val) => !!val)
              ? t('activated_label')
              : t('desactivated_label'),
          label: FORM_LABELS.backint,
        },
        {
          value: values.bucketBackint?.id,
          label: t('common_input_container'),
        },
        {
          value: values.bucketBackint?.endpoint,
          label: FORM_LABELS.endpoint,
        },
        {
          value: values.bucketBackint?.accessKey,
          label: t('common_input_access_key'),
        },
        {
          value: values.bucketBackint?.secretKey,
          label: t('common_input_secret_key'),
          isSecretValue: true,
        },
        {
          value:
            values.logsDataPlatform &&
            Object.values(values.logsDataPlatform).some((val) => !!val)
              ? t('activated_label')
              : t('desactivated_label'),
          label: FORM_LABELS.logsDataPlatform,
        },
        {
          value: values.logsDataPlatform?.entrypoint,
          label: FORM_LABELS.endpoint,
        },
        {
          value: values.logsDataPlatform?.certificate,
          label: t('enablement_input_logstash_certificat'),
        },
      ],
    },
  ];

  return { formSummary };
};
