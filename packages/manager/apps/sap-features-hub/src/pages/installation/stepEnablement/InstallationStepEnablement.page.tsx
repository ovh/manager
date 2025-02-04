import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import FormLayout from '@/components/Form/FormLayout.component';
import { RhfField } from '@/components/Fields';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { PRE_INSTALLATION_FORM_SCHEMA } from '@/schema/form.schema';
import {
  BACKUP_KEY_LENGTH,
  CONTAINER_ID_MAX_LENGTH,
} from '@/constants/form.constants';

export default function InstallationStepEnablement() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const { values: formValues, setValues } = useInstallationFormContext();

  const defaultValues = useMemo(
    () => ({
      hasBackup: !!formValues.bucketBackint,
      bucketBackint: formValues.bucketBackint ?? undefined,
      hasLogsInLdpOvh: !!formValues.logsDataPlatform,
      logsDataPlatform: formValues.logsDataPlatform ?? undefined,
    }),
    [formValues],
  );

  const {
    register,
    unregister,
    watch,
    formState,
    handleSubmit,
    ...restForm
  } = useForm<z.infer<typeof PRE_INSTALLATION_FORM_SCHEMA>>({
    mode: 'onTouched',
    resolver: zodResolver(PRE_INSTALLATION_FORM_SCHEMA),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues.bucketBackint || defaultValues.logsDataPlatform) {
      restForm.trigger();
    }
  }, [defaultValues]);

  const { isValid } = formState;

  const [hasBackup, hasLogsInLdpOvh] = watch(['hasBackup', 'hasLogsInLdpOvh']);

  useEffect(() => {
    if (!hasBackup) {
      unregister('bucketBackint');
    }
  }, [hasBackup]);

  useEffect(() => {
    if (!hasLogsInLdpOvh) {
      unregister('logsDataPlatform');
    }
  }, [hasLogsInLdpOvh]);

  const saveFormOnContext = () => {
    setValues((prev) => ({ ...prev, ...restForm.getValues() }));
  };

  const handleSubmitCustom = () => {
    saveFormOnContext();
    nextStep();
  };

  const handlePreviousCustom = () => {
    saveFormOnContext();
    previousStep();
  };

  return (
    <FormProvider
      register={register}
      unregister={unregister}
      watch={watch}
      formState={formState}
      handleSubmit={handleSubmit}
      {...restForm}
    >
      <FormLayout
        title={t('enablement_title')}
        subtitle={t('enablement_subtitle')}
        submitLabel={t('enablement_cta')}
        isSubmitDisabled={!isValid}
        onSubmit={handleSubmitCustom}
        onPrevious={handlePreviousCustom}
      >
        <RhfField
          controllerParams={register('hasBackup')}
          className="w-full max-w-md flex flex-row items-center gap-x-2"
        >
          <RhfField.Label>{t('enablement_input_has_backup')}</RhfField.Label>
          <RhfField.Toggle className="ml-auto" />
        </RhfField>
        {hasBackup && (
          <>
            <RhfField
              controllerParams={register('bucketBackint.id')}
              helperMessage={t('common_helper_container')}
            >
              <RhfField.Label className="flex gap-2 items-center">
                <span>{t('common_input_container')}</span>
                <OdsIcon
                  id="id-container-tooltip-trigger"
                  name="circle-question"
                />
              </RhfField.Label>
              <RhfField.Input
                placeholder="my-hana-backups"
                maxlength={CONTAINER_ID_MAX_LENGTH}
              />
              <RhfField.HelperAuto />
              <RhfField.VisualHintCounter max={CONTAINER_ID_MAX_LENGTH} />
              <OdsTooltip triggerId="id-container-tooltip-trigger">
                {t('enablement_input_id_container_tooltip')}
              </OdsTooltip>
            </RhfField>
            <RhfField
              controllerParams={register('bucketBackint.endpoint')}
              helperMessage={t('common_helper_endpoint')}
            >
              <RhfField.Label>{t('enablement_input_endpoint')}</RhfField.Label>
              <RhfField.Input />
              <RhfField.HelperAuto />
            </RhfField>
            <RhfField
              controllerParams={register('bucketBackint.accessKey')}
              helperMessage={t('common_helper_access_key')}
            >
              <RhfField.Label>{t('common_input_access_key')}</RhfField.Label>
              <RhfField.Input maxlength={BACKUP_KEY_LENGTH} />
              <RhfField.HelperAuto />
              <RhfField.VisualHintCounter max={BACKUP_KEY_LENGTH} />
            </RhfField>
            <RhfField
              controllerParams={register('bucketBackint.secretKey')}
              helperMessage={t('common_helper_secret_key')}
            >
              <RhfField.Label>{t('common_input_secret_key')}</RhfField.Label>
              <RhfField.Password maxlength={BACKUP_KEY_LENGTH} />
              <RhfField.HelperAuto />
              <RhfField.VisualHintCounter max={BACKUP_KEY_LENGTH} />
            </RhfField>
          </>
        )}
        <RhfField
          controllerParams={register('hasLogsInLdpOvh')}
          className="w-full max-w-md flex flex-row items-center gap-x-2"
        >
          <RhfField.Label className="flex gap-2 items-center  ">
            <span>{t('enablement_input_has_logs_ldp_ovh')}</span>
            <OdsIcon
              id="has-logs-ldp-ovh-tooltip-trigger"
              name="circle-question"
            />
          </RhfField.Label>
          <RhfField.Toggle className="ml-auto" />
          <OdsTooltip triggerId="has-logs-ldp-ovh-tooltip-trigger">
            {t('enablement_input_has_logs_ldp_ovh_helper')}
          </OdsTooltip>
        </RhfField>
        {hasLogsInLdpOvh && (
          <>
            <RhfField
              controllerParams={register('logsDataPlatform.entrypoint')}
              helperMessage={t('enablement_input_logstash_entrypoint_helper')}
            >
              <RhfField.Label>
                {t('enablement_input_logstash_entrypoint')}
              </RhfField.Label>
              <RhfField.Input />
              <RhfField.HelperAuto />
            </RhfField>
            <RhfField
              controllerParams={register('logsDataPlatform.certificate')}
              helperMessage={t('enablement_input_logstash_certificat_error')}
            >
              <RhfField.Label>
                {t('enablement_input_logstash_certificat')}
              </RhfField.Label>
              <RhfField.Password />
            </RhfField>
          </>
        )}
      </FormLayout>
    </FormProvider>
  );
}
