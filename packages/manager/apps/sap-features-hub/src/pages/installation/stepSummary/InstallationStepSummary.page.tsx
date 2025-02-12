import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Links } from '@ovh-ux/manager-react-components';
import { saveAs } from 'file-saver';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import FormLayout from '@/components/Form/FormLayout.component';
import { FormStepSummary } from '@/components/Form/FormStepSummary.component';
import { useFormSummary } from '@/hooks/formSummary/useFormSummary';
import { testIds } from '@/utils/testIds.constants';
import { getSummaryBlob, getSummaryFileName } from '@/utils/summaryExport';

export default function InstallationStepSummary() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const { values, errors } = useInstallationFormContext();
  const { formSummary } = useFormSummary(values);

  const isStepValid = useMemo(
    () => Object.values(errors).some((err) => !!err),
    [errors],
  );

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
      isSubmitDisabled={!isStepValid}
      onSubmit={nextStep}
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
