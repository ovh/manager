import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, Path, useForm, UseFormTrigger } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import FormLayout from '@/components/Form/FormLayout.component';
import { RhfField } from '@/components/Fields';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { ENABLEMENT_FORM_SCHEMA } from '@/schema/form.schema';
import {
  BACKUP_KEY_LENGTH,
  CONTAINER_ID_MAX_LENGTH,
  FORM_LABELS,
} from '@/constants/form.constants';

const triggerFilledInput = <T,>({
  getValues,
  trigger,
  prefix,
}: {
  getValues: (params: T | Path<T>) => { [key: string]: unknown };
  trigger: UseFormTrigger<T>;
  prefix: T | Path<T>;
}) => {
  const objectValues = getValues(prefix);
  Object.keys(objectValues || {}).forEach((key) => {
    if (objectValues[key]) {
      trigger(`${prefix}.${key}` as Path<T>);
    }
  });
};

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
    getValues,
    trigger,
    register,
    unregister,
    watch,
    resetField,
    formState,
    handleSubmit,
    ...restForm
  } = useForm<z.infer<typeof ENABLEMENT_FORM_SCHEMA>>({
    mode: 'onChange',
    resolver: zodResolver(ENABLEMENT_FORM_SCHEMA),
    defaultValues,
    shouldUnregister: false,
  });
  const triggerFilledInputOfForm = (
    prefix: Path<z.infer<typeof ENABLEMENT_FORM_SCHEMA>>,
  ) =>
    triggerFilledInput<z.infer<typeof ENABLEMENT_FORM_SCHEMA>>({
      getValues,
      trigger,
      prefix,
    });

  useEffect(() => {
    if (defaultValues.bucketBackint) {
      triggerFilledInputOfForm('bucketBackint');
    }
    if (defaultValues.logsDataPlatform) {
      triggerFilledInputOfForm('logsDataPlatform');
    }
  }, [defaultValues]);

  const { isValid } = formState;

  const [hasBackup, hasLogsInLdpOvh] = watch(['hasBackup', 'hasLogsInLdpOvh']);

  const saveFormOnContext = () => {
    setValues((prev) => {
      const values = getValues();
      return {
        ...prev,
        bucketBackint: values.hasBackup ? values.bucketBackint : undefined,
        logsDataPlatform: values.hasLogsInLdpOvh
          ? values.logsDataPlatform
          : undefined,
      };
    });
  };

  useEffect(() => {
    return saveFormOnContext;
  }, []);

  return (
    <FormProvider
      register={register}
      unregister={unregister}
      watch={watch}
      formState={formState}
      handleSubmit={handleSubmit}
      trigger={trigger}
      getValues={getValues}
      resetField={resetField}
      {...restForm}
    >
      <FormLayout
        title={t('enablement_title')}
        subtitle={t('enablement_subtitle')}
        submitLabel={t('enablement_cta')}
        isSubmitDisabled={!isValid}
        onSubmit={nextStep}
        onPrevious={previousStep}
      >
        <RhfField
          controllerParams={register('hasBackup')}
          className="w-full max-w-md flex flex-row items-center gap-x-2"
          isHiddenError
        >
          <RhfField.Label>{t('enablement_input_has_backup')}</RhfField.Label>
          <RhfField.Toggle className="ml-auto" />
        </RhfField>
        <div className={hasBackup ? 'flex flex-col gap-y-4' : 'hidden'}>
          <RhfField
            controllerParams={register('bucketBackint.id')}
            helperMessage={t('common_helper_container')}
          >
            <RhfField.Label className="flex gap-2 items-center align-middle">
              {t('common_input_container')}
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
            <RhfField.Label>{FORM_LABELS.endpoint}</RhfField.Label>
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
        </div>
        <RhfField
          controllerParams={register('hasLogsInLdpOvh')}
          className="w-full max-w-md flex flex-row items-center gap-x-2"
          isHiddenError
        >
          <RhfField.Label className="flex gap-2 items-center">
            {t('enablement_input_has_logs_ldp_ovh')}
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
        <div className={hasLogsInLdpOvh ? 'flex flex-col gap-y-4' : 'hidden'}>
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
        </div>
      </FormLayout>
    </FormProvider>
  );
}
