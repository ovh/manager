import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, FieldLabel, Input, Label } from '@datatr-ux/uxlib';
import { LifecycleRuleContainer } from './LifecycleRuleContainer';
import { FormField } from '@/components/form-field/FormField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';
import {
  TransitionListField,
  TransitionListFieldConfig,
} from './TransitionListField.component';
import { LifecycleFormValues } from './useLifecycleForm.hook';

type BooleanFieldName = {
  [K in keyof LifecycleFormValues]: LifecycleFormValues[K] extends boolean
    ? K
    : never;
}[keyof LifecycleFormValues];

type NumberFieldName = {
  [K in keyof LifecycleFormValues]: LifecycleFormValues[K] extends number
    ? K
    : never;
}[keyof LifecycleFormValues];

interface ExpirationConfig {
  hasFieldName: BooleanFieldName;
  daysFieldName: NumberFieldName;
  checkboxId: string;
  checkboxLabelKey: string;
  daysLabelKey: string;
}

interface LifecycleRuleVersionOperationsProps {
  titleKey?: string;
  transition: TransitionListFieldConfig;
  expiration: ExpirationConfig;
  children?: React.ReactNode;
}

export const LifecycleRuleVersionOperations = ({
  titleKey,
  transition,
  expiration,
  children,
}: LifecycleRuleVersionOperationsProps) => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const hasExpiration = form.watch(expiration.hasFieldName);

  const content = (
    <>
      <TransitionListField {...transition} />

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          id={expiration.checkboxId}
          checked={hasExpiration}
          onCheckedChange={(checked) =>
            form.setValue(expiration.hasFieldName, checked === true)
          }
          disabled={isPending}
        />
        <Label
          htmlFor={expiration.checkboxId}
          className="text-sm font-normal cursor-pointer"
        >
          {t(expiration.checkboxLabelKey)}
        </Label>
      </div>

      {hasExpiration && (
        <div className="flex flex-col gap-2 pl-6">
          <FormField name={expiration.daysFieldName} form={form}>
            {(field) => (
              <>
                <FieldLabel>{t(expiration.daysLabelKey)}</FieldLabel>
                <Input type="number" min={1} {...field} disabled={isPending} />
              </>
            )}
          </FormField>
        </div>
      )}

      {children}
    </>
  );

  if (titleKey) {
    return (
      <LifecycleRuleContainer title={t(titleKey)}>
        {content}
      </LifecycleRuleContainer>
    );
  }

  return content;
};
