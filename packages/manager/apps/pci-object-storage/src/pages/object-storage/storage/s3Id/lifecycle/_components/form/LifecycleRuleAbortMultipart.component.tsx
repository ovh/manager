import { useTranslation } from 'react-i18next';
import { FieldLabel, Input } from '@datatr-ux/uxlib';
import { FormField } from '@/components/form-field/FormField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';
import { CheckboxField } from './CheckboxField.component';

export const LifecycleRuleAbortMultipart = () => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const hasAbort = form.watch('hasAbortIncompleteMultipartUpload');

  return (
    <>
      <CheckboxField
        id="has-abort-multipart"
        label={t('formAbortMultipartLabel')}
        description={t('formAbortMultipartDescription')}
        checked={hasAbort}
        onCheckedChange={(checked) =>
          form.setValue('hasAbortIncompleteMultipartUpload', checked)
        }
        disabled={isPending}
      />

      {hasAbort && (
        <div className="flex flex-col gap-2">
          <FormField name="abortDaysAfterInitiation" form={form}>
            {(field) => (
              <>
                <FieldLabel>{t('formAbortDaysLabel')}</FieldLabel>
                <Input type="number" min={1} {...field} disabled={isPending} />
              </>
            )}
          </FormField>
        </div>
      )}
    </>
  );
};
