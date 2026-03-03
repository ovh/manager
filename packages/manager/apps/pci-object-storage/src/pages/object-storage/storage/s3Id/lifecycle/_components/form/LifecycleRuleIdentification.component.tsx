import { useTranslation } from 'react-i18next';
import { FieldLabel, Input } from '@datatr-ux/uxlib';
import { LifecycleRuleContainer } from './LifecycleRuleContainer';
import { FormField } from '@/components/form-field/FormField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';

export const LifecycleRuleIdentification = () => {
  const {
    form,
    isPending,
    isEditMode,
    lifecycleTitle,
  } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  return (
    <LifecycleRuleContainer title={lifecycleTitle}>
      <FormField name="ruleId" form={form}>
        {(field) => (
          <>
            <FieldLabel>{t('formRuleIdLabel')}</FieldLabel>
            <Input
              {...field}
              disabled={isEditMode || isPending}
              data-testid="lifecycle-rule-id-input"
            />
          </>
        )}
      </FormField>
    </LifecycleRuleContainer>
  );
};
