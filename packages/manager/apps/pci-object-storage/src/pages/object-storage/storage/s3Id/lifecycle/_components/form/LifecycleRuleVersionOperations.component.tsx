import React from 'react';
import { useTranslation } from 'react-i18next';
import { FieldLabel, Input } from '@datatr-ux/uxlib';
import { LifecycleRuleContainer } from './LifecycleRuleContainer';
import { FormField } from '@/components/form-field/FormField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';
import { CheckboxField } from './CheckboxField.component';
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
  newerVersionsFieldName?: NumberFieldName;
  checkboxId: string;
  checkboxLabelKey: string;
  daysLabelKey: string;
  newerVersionsLabelKey?: string;
}

interface LifecycleRuleVersionOperationsProps {
  titleKey?: string;
  descriptionKey?: string;
  transition: TransitionListFieldConfig;
  expiration: ExpirationConfig;
  children?: React.ReactNode;
}

export const LifecycleRuleVersionOperations = ({
  titleKey,
  descriptionKey,
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

      <CheckboxField
        id={expiration.checkboxId}
        label={t(expiration.checkboxLabelKey)}
        checked={hasExpiration}
        onCheckedChange={(checked) =>
          form.setValue(expiration.hasFieldName, checked)
        }
        disabled={isPending}
        className="mt-2"
      />

      {hasExpiration && (
        <div className="flex flex-col gap-2">
          <FormField name={expiration.daysFieldName} form={form}>
            {(field) => (
              <>
                <FieldLabel>{t(expiration.daysLabelKey)}</FieldLabel>
                <Input type="number" min={1} {...field} disabled={isPending} />
              </>
            )}
          </FormField>
          {expiration.newerVersionsFieldName &&
            expiration.newerVersionsLabelKey && (
              <FormField name={expiration.newerVersionsFieldName} form={form}>
                {(field) => (
                  <>
                    <FieldLabel>
                      {t(expiration.newerVersionsLabelKey)}
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      disabled={isPending}
                    />
                  </>
                )}
              </FormField>
            )}
        </div>
      )}

      {children}
    </>
  );

  if (titleKey) {
    return (
      <LifecycleRuleContainer
        title={t(titleKey)}
        description={descriptionKey ? t(descriptionKey) : undefined}
      >
        {content}
      </LifecycleRuleContainer>
    );
  }

  return content;
};
