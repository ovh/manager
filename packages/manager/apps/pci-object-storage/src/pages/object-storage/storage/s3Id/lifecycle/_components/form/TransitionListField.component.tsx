import { useTranslation } from 'react-i18next';
import {
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@datatr-ux/uxlib';
import { Plus, X } from 'lucide-react';
import storages from '@/types/Storages';
import { CheckboxField } from './CheckboxField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';
import {
  MIN_TRANSITION_GAP_DAYS,
  getDisabledStorageClasses,
  canAddTransition,
  getNextTransitionDays,
} from './lifecycleTransition.utils';
import { LifecycleFormValues } from './useLifecycleForm.hook';
import { FieldPath, PathValue } from 'react-hook-form';

export type TransitionListFieldConfig = {
  hasFieldName:
    | 'hasCurrentVersionTransitions'
    | 'hasNoncurrentVersionTransitions';
  transitionsFieldName: 'transitions' | 'noncurrentVersionTransitions';
  daysKey: 'days' | 'noncurrentDays';
  checkboxId: string;
  checkboxLabelKey: string;
  checkboxDescriptionKey?: string;
  daysLabelKey: string;
  addButtonLabelKey: string;
};

type CurrentTransition = LifecycleFormValues['transitions'][number];
type NoncurrentTransition = LifecycleFormValues['noncurrentVersionTransitions'][number];

export function TransitionListField(config: TransitionListFieldConfig) {
  const {
    form,
    isPending,
    availableStorageClasses,
  } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );

  const isNoncurrent =
    config.transitionsFieldName === 'noncurrentVersionTransitions';

  const hasField = form.watch(config.hasFieldName);
  const transitions = form.watch(
    config.transitionsFieldName,
  ) as LifecycleFormValues[typeof config.transitionsFieldName];
  const transitionErrors = form.formState.errors[config.transitionsFieldName];

  const transitionsList = (Array.isArray(transitions) ? transitions : []) as (
    | CurrentTransition
    | NoncurrentTransition
  )[];
  const transitionLike = transitionsList.map((tr) => ({
    storageClass: tr.storageClass,
  }));
  const daysList = transitionsList.map((tr) => ({
    days: ((tr as Record<string, unknown>)[config.daysKey] as number) ?? 0,
  }));

  const addTransition = () => {
    const nextDays = getNextTransitionDays(daysList);
    const storageClass = undefined as storages.StorageClassEnum | undefined;
    const newItem = isNoncurrent
      ? { noncurrentDays: nextDays, storageClass, newerNoncurrentVersions: 0 }
      : { days: nextDays, storageClass };
    form.setValue(
      config.transitionsFieldName,
      [...transitionsList, newItem] as PathValue<
        LifecycleFormValues,
        typeof config.transitionsFieldName
      >,
      { shouldValidate: true },
    );
  };

  const removeTransition = (index: number) => {
    form.setValue(
      config.transitionsFieldName,
      transitionsList.filter((_, i) => i !== index) as PathValue<
        LifecycleFormValues,
        typeof config.transitionsFieldName
      >,
      { shouldValidate: true },
    );
  };

  const handleToggle = (checked: boolean) => {
    form.setValue(config.hasFieldName, checked);
    if (checked && transitionsList.length === 0) {
      const storageClass = undefined as storages.StorageClassEnum | undefined;
      const initialItem = isNoncurrent
        ? {
            noncurrentDays: MIN_TRANSITION_GAP_DAYS,
            storageClass,
            newerNoncurrentVersions: 0,
          }
        : { days: MIN_TRANSITION_GAP_DAYS, storageClass };
      form.setValue(
        config.transitionsFieldName,
        [initialItem] as PathValue<
          LifecycleFormValues,
          typeof config.transitionsFieldName
        >,
        { shouldValidate: true },
      );
    }
  };

  const daysPath = (index: number) =>
    `${config.transitionsFieldName}.${index}.${config.daysKey}` as FieldPath<
      LifecycleFormValues
    >;
  const storageClassPath = (index: number) =>
    `${config.transitionsFieldName}.${index}.storageClass` as FieldPath<
      LifecycleFormValues
    >;
  const newerNoncurrentVersionsPath = (index: number) =>
    `${config.transitionsFieldName}.${index}.newerNoncurrentVersions` as FieldPath<
      LifecycleFormValues
    >;

  return (
    <>
      <CheckboxField
        id={config.checkboxId}
        label={t(config.checkboxLabelKey)}
        description={
          config.checkboxDescriptionKey
            ? t(config.checkboxDescriptionKey)
            : undefined
        }
        checked={hasField}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />

      {hasField && (
        <div className="flex flex-col gap-2">
          {transitionsList.map((transition, index) => {
            const daysValue = (transition as Record<string, unknown>)[
              config.daysKey
            ] as number | undefined;
            const errorMessage = Array.isArray(transitionErrors)
              ? (transitionErrors[index] as {
                  days?: { message?: string };
                  noncurrentDays?: { message?: string };
                })?.[config.daysKey]?.message
              : undefined;

            return (
              <div key={index}>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <FieldLabel>{t(config.daysLabelKey)}</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={daysValue ?? ''}
                      onChange={(e) =>
                        form.setValue(daysPath(index), Number(e.target.value), {
                          shouldValidate: true,
                        })
                      }
                      disabled={isPending}
                    />
                  </div>
                  <div className="flex-1">
                    <FieldLabel>{t('formStorageClassLabel')}</FieldLabel>
                    <Select
                      value={transition.storageClass}
                      onValueChange={(value) =>
                        form.setValue(storageClassPath(index), value, {
                          shouldValidate: true,
                        })
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('formStorageClassPlaceholder')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStorageClasses.map((sc) => {
                          const disabled = getDisabledStorageClasses(
                            availableStorageClasses,
                            transitionLike,
                            index,
                          ).has(sc);
                          return (
                            <SelectItem key={sc} value={sc} disabled={disabled}>
                              {tObj(`objectClass_${sc}`)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {isNoncurrent && (
                    <div className="flex-1">
                      <FieldLabel>
                        {t('formNewerNoncurrentVersionsLabel')}
                      </FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        value={
                          (transition as NoncurrentTransition)
                            .newerNoncurrentVersions ?? ''
                        }
                        onChange={(e) =>
                          form.setValue(
                            newerNoncurrentVersionsPath(index),
                            Number(e.target.value),
                            { shouldValidate: true },
                          )
                        }
                        disabled={isPending}
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    mode="outline"
                    variant="critical"
                    size="menu"
                    onClick={() => removeTransition(index)}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-critical-500 text-sm min-h-5 mt-1">
                  {errorMessage ?? '\u00A0'}
                </p>
              </div>
            );
          })}
          {canAddTransition(availableStorageClasses, transitionLike) && (
            <Button
              type="button"
              size="md"
              mode="outline"
              onClick={addTransition}
              disabled={
                isPending ||
                transitionsList.some((tr) => !tr.storageClass)
              }
              className="self-start"
            >
              <Plus className="h-4 w-4" />
              {t(config.addButtonLabelKey)}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
