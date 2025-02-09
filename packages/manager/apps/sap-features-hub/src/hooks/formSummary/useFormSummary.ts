import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StepSummary } from '@/types/formStep.type';
import { FORM_LABELS } from '@/constants/form.constants';
import { InstallationFormValues } from '@/types/form.type';

export const useFormSummary = (values: InstallationFormValues) => {
  const { t } = useTranslation('installation');

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
                },
              ]),
        ],
      },
    ],
    [values],
  );

  return { formSummary };
};
