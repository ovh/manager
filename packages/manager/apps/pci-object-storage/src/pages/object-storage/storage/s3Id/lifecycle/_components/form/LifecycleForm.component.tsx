import { UseFormReturn } from 'react-hook-form';
import storages from '@/types/Storages';
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
}: LifecycleFormProps) => (
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
      <LifecycleRuleCurrentVersion />
      <LifecycleRuleNoncurrentVersion />
      <LifecycleRuleAbortMultipart />
    </form>
  </LifecycleFormProvider>
);
