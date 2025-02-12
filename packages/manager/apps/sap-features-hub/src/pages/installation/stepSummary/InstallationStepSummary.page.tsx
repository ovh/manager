import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Links, useNotifications } from '@ovh-ux/manager-react-components';
import { saveAs } from 'file-saver';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import FormLayout from '@/components/Form/FormLayout.component';
import { FormStepSummary } from '@/components/Form/FormStepSummary.component';
import { useFormSummary } from '@/hooks/formSummary/useFormSummary';
import { testIds } from '@/utils/testIds.constants';
import { useApiValidation } from '@/hooks/apiValidation/useApiValidation';
import {
  getSummaryBlob,
  getSummaryFileName,
  getSummaryJSON,
} from '@/utils/summaryExport';

export default function InstallationStepSummary() {
  const { t } = useTranslation('installation');
  const { previousStep, serviceName } = useFormSteps();
  const { values } = useInstallationFormContext();
  const { formSummary } = useFormSummary(values);
  const { addError, clearNotifications } = useNotifications();
  const { mutate: validateForm } = useApiValidation({
    serviceName,
    onMutate: () => clearNotifications(),
    onError: (err) => {
      const error = err?.response?.data?.message || err?.message;
      addError(t('summary_api_error', { error }), true);
    },
  });

  return (
    <FormLayout
      title={t('summary_title')}
      subtitle={
        <Trans
          t={t}
          i18nKey={'summary_subtitle'}
          components={{
            DownloadLink: (
              <Links
                onClickReturn={() =>
                  saveAs(
                    getSummaryBlob(values),
                    getSummaryFileName(values.sapSid),
                  )
                }
                data-testid={testIds.summaryDownloadLink}
              />
            ),
          }}
        ></Trans>
      }
      submitLabel={t('summary_cta_submit')}
      onSubmit={() => validateForm(getSummaryJSON(values))}
      onPrevious={previousStep}
    >
      <div className="flex flex-col gap-y-8">
        {formSummary.map((step) => (
          <FormStepSummary key={step.id} step={step} />
        ))}
      </div>
    </FormLayout>
  );
}
