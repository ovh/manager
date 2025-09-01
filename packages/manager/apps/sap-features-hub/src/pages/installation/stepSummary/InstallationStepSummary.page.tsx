import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { saveAs } from 'file-saver';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import FormLayout from '@/components/Form/FormLayout.component';
import { FormStepSummary } from '@/components/Form/FormStepSummary.component';
import { useFormSummary } from '@/hooks/formSummary/useFormSummary';
import { useInstallationCreation } from '@/data/hooks/useInstallationCreation';
import { getSummaryBlob, getSummaryFileName } from '@/utils/summaryExport';
import { TRACKING } from '@/tracking.constants';
import { formMappers } from '@/mappers/formMappers';
import { buildViewInstallationRedirectUrl } from '@/utils/buildSearchQuery';

export default function InstallationStepSummary() {
  const { t } = useTranslation('installation');
  const navigate = useNavigate();
  const { previousStep, serviceName } = useFormSteps();
  const { values } = useInstallationFormContext();
  const { formSummary } = useFormSummary(values);
  const { addError, clearNotifications } = useNotifications();
  const { mutate: createInstallation, isPending } = useInstallationCreation({
    serviceName,
    onMutate: () => clearNotifications(),
    onSuccess: (data) => {
      const redirectUrl = buildViewInstallationRedirectUrl({
        serviceName,
        taskId: data.data,
      });
      navigate(redirectUrl);
    },
    onError: (err) => {
      const error = err?.response?.data?.message || err?.message;
      addError(t('summary_api_error', { error }), true);
    },
  });
  const { trackClick } = useOvhTracking();

  return (
    <FormLayout
      title={t('summary_title')}
      subtitle={t('summary_subtitle')}
      submitLabel={t('summary_cta_submit')}
      isSubmitLoading={isPending}
      onSubmit={() => {
        trackClick(TRACKING.installation.submitSummary('confirm'));
        createInstallation(formMappers.toStructured(values));
      }}
      onPrevious={() => {
        trackClick(TRACKING.installation.submitSummary('previous'));
        previousStep();
      }}
    >
      <div className="flex flex-col gap-y-8">
        {formSummary.map((step) => (
          <FormStepSummary key={step.id} step={step} />
        ))}
      </div>
      <OdsButton
        label={t('summary_cta_download')}
        className="mt-4"
        onClick={() => {
          saveAs(getSummaryBlob(values), getSummaryFileName(values.sapSid));
        }}
      />
    </FormLayout>
  );
}
