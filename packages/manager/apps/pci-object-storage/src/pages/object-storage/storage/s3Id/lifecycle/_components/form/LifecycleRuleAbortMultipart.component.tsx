import { useTranslation } from 'react-i18next';
import { Checkbox, FieldLabel, Input, Label } from '@datatr-ux/uxlib';
import { FormField } from '@/components/form-field/FormField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';

export const LifecycleRuleAbortMultipart = () => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const hasAbort = form.watch('hasAbortIncompleteMultipartUpload');

  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          id="has-abort-multipart"
          checked={hasAbort}
          onCheckedChange={(checked) =>
            form.setValue('hasAbortIncompleteMultipartUpload', checked === true)
          }
          disabled={isPending}
        />
        <Label
          htmlFor="has-abort-multipart"
          className="text-sm font-normal cursor-pointer"
        >
          {t('formAbortMultipartLabel')}
        </Label>
      </div>

      {hasAbort && (
        <div className="flex flex-col gap-2 pl-6">
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
