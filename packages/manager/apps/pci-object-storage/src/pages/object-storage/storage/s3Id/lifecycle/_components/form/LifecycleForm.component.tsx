import { UseFormReturn, useFormState } from 'react-hook-form';
import storages from '@/types/Storages';
import { useTranslation } from 'react-i18next';
import { LifecycleFormValues } from './useLifecycleForm.hook';
import { LifecycleFormProvider } from './LifecycleForm.context';
import { LifecycleRuleIdentification } from './LifecycleRuleIdentification.component';
import { LifecycleRuleScope } from './LifecycleRuleScope.component';
import { LifecycleRuleCurrentVersion } from './LifecycleRuleCurrentVersion.component';
import { LifecycleRuleNoncurrentVersion } from './LifecycleRuleNoncurrentVersion.component';
import { LifecycleRuleAbortMultipart } from './LifecycleRuleAbortMultipart.component';
import { Separator } from '@datatr-ux/uxlib';

interface LifecycleFormProps {
  isEditMode?: boolean;
  lifecycleTitle: string;
  form: UseFormReturn<LifecycleFormValues>;
  isPending: boolean;
  availableStorageClasses: storages.StorageClassEnum[];
  onSubmit: () => void;
}

export const LifecycleForm = ({
  isEditMode = false,
  lifecycleTitle,
  form,
  isPending,
  availableStorageClasses,
  onSubmit,
}: LifecycleFormProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const { isSubmitted } = useFormState({ control: form.control });

  const hasOperation = form.watch('hasCurrentVersionTransitions')
    || form.watch('hasCurrentVersionExpiration')
    || form.watch('expiredObjectDeleteMarker')
    || form.watch('hasNoncurrentVersionTransitions')
    || form.watch('hasNoncurrentVersionExpiration')
    || form.watch('hasAbortIncompleteMultipartUpload');

  const showNoOperationError = isSubmitted && !hasOperation;

  return (
    <LifecycleFormProvider
      form={form}
      isPending={isPending}
      isEditMode={isEditMode}
      lifecycleTitle={lifecycleTitle}
      availableStorageClasses={availableStorageClasses}
    >
      <form onSubmit={onSubmit} className="space-y-4" id="lifecycle-form">
        <LifecycleRuleIdentification />
        <Separator />
        <LifecycleRuleScope />
        <Separator />
        {showNoOperationError && (
          <p className="text-critical-500 text-sm">
            {t('formAtLeastOneOperationError')}
          </p>
        )}
        <LifecycleRuleCurrentVersion />
        <LifecycleRuleNoncurrentVersion />
        <LifecycleRuleAbortMultipart />
      </form>
    </LifecycleFormProvider>
  );
};
