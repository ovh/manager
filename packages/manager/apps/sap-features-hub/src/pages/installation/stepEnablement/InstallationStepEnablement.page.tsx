import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  FormProvider,
  Path,
  useForm,
  UseFormTrigger,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OdsIcon, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import FormLayout from '@/components/Form/FormLayout.component';
import { RhfField } from '@/components/Fields';
import { RhfToggleField } from '@/components/Fields/RhfToggleField.component';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { ENABLEMENT_FORM_SCHEMA } from '@/schema/form.schema';
import {
  BACKUP_KEY_LENGTH,
  CONTAINER_ID_MAX_LENGTH,
  FORM_LABELS,
} from '@/constants/form.constants';
import { TRACKING } from '@/tracking.constants';
import { EnablementForm } from '@/types/form.type';
import { mapFormEnablementToStructured } from '@/mappers/stepFormMappers';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { createRegisterWithHandler } from '@/utils/createRegisterWithHandler';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

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
  const {
    values: { serviceName, ...formValues },
    setValues,
  } = useInstallationFormContext();
  const { trackClick } = useOvhTracking();
  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  const defaultValues = {
    hasBackup: !!formValues.bucketBackint,
    bucketBackint: formValues.bucketBackint ?? undefined,
    hasLogsInLdpOvh: !!formValues.logsDataPlatform,
    logsDataPlatform: formValues.logsDataPlatform ?? undefined,
  };

  const {
    getValues,
    trigger,
    register: baseRegister,
    unregister,
    control,
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

  const register = createRegisterWithHandler(
    baseRegister,
    clearServerErrorMessage,
  );

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
  }, []);

  const { isValid } = formState;

  const [hasBackup, hasLogsInLdpOvh] = watch(['hasBackup', 'hasLogsInLdpOvh']);

  const getEnablementFormValues = () => {
    const values = getValues();
    return {
      bucketBackint: values.hasBackup ? values.bucketBackint : undefined,
      logsDataPlatform: values.hasLogsInLdpOvh
        ? values.logsDataPlatform
        : undefined,
    };
  };

  const saveFormOnContext = () => {
    setValues((prev) => ({
      ...prev,
      ...getEnablementFormValues(),
    }));
  };

  useEffect(() => {
    return saveFormOnContext;
  }, []);

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation<EnablementForm>({
    mapper: mapFormEnablementToStructured,
    serviceName,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      setServerErrorMessage(error.response.data.message);
    },
  });

  return (
    <FormProvider
      register={register}
      control={control}
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
        isSubmitDisabled={!isValid || !!serverErrorMessage}
        isSubmitLoading={isValidationPending}
        serverErrorMessage={serverErrorMessage}
        onSubmit={() => {
          trackClick(TRACKING.installation.startSAPDeployment);
          validate(getEnablementFormValues());
        }}
        onPrevious={previousStep}
      >
        <Controller
          control={control}
          name="hasBackup"
          render={({ field }) => (
            <RhfToggleField
              field={field}
              label={t('enablement_input_has_backup')}
            />
          )}
        />
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
        <Controller
          control={control}
          name="hasLogsInLdpOvh"
          render={({ field }) => (
            <RhfToggleField
              field={field}
              label={t('enablement_input_has_logs_ldp_ovh')}
              tooltip={t('enablement_input_has_logs_ldp_ovh_helper')}
            />
          )}
        />
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
