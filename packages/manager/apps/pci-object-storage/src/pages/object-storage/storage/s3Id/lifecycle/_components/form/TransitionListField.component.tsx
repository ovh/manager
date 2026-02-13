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
import { Controller, FieldPath, PathValue } from 'react-hook-form';

type CurrentTransition = LifecycleFormValues['transitions'][number];
type NoncurrentTransition = LifecycleFormValues['noncurrentVersionTransitions'][number];

const getTransitionDays = (
  tr: CurrentTransition | NoncurrentTransition,
): number | undefined => {
  if ('noncurrentDays' in tr) return tr.noncurrentDays;
  if ('days' in tr) return tr.days;
  return undefined;
};

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
  const currentTransitions = form.watch('transitions') ?? [];
  const noncurrentTransitions =
    form.watch('noncurrentVersionTransitions') ?? [];
  const transitionsList: (CurrentTransition | NoncurrentTransition)[] =
    isNoncurrent ? noncurrentTransitions : currentTransitions;
  const transitionLike = transitionsList.map((tr) => ({
    storageClass: tr.storageClass,
  }));
  const daysList = transitionsList.map((tr) => ({
    days: getTransitionDays(tr) ?? 0,
  }));

  const addTransition = () => {
    const nextDays = getNextTransitionDays(daysList);
    const storageClass: storages.StorageClassEnum | undefined = undefined;
    const newItem = isNoncurrent
      ? { noncurrentDays: nextDays, storageClass, newerNoncurrentVersions: 0 }
      : { days: nextDays, storageClass };
    form.setValue(
      config.transitionsFieldName,
      [...transitionsList, newItem],
    );
  };

  const removeTransition = (index: number) => {
    form.setValue(
      config.transitionsFieldName,
      transitionsList.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const handleToggle = (checked: boolean) => {
    form.setValue(config.hasFieldName, checked);
    if (checked && transitionsList.length === 0) {
      const storageClass: storages.StorageClassEnum | undefined = undefined;
      const initialItem = isNoncurrent
        ? {
          noncurrentDays: MIN_TRANSITION_GAP_DAYS,
          storageClass,
          newerNoncurrentVersions: 0,
        }
        : { days: MIN_TRANSITION_GAP_DAYS, storageClass };
      form.setValue(
        config.transitionsFieldName,
        [initialItem],
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
            const daysValue = getTransitionDays(transition);
            const daysErrorMessage = form.getFieldState(daysPath(index))
              .error?.message;
            const storageClassErrorMessage = form.getFieldState(
              storageClassPath(index),
            ).error?.message;

            return (
              <div key={index}>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <FieldLabel>{t(config.daysLabelKey)}</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={daysValue ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        form.setValue(
                          daysPath(index),
                          raw === '' ? '' : Number(raw),
                          { shouldValidate: true },
                        );
                      }}
                      disabled={isPending}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      control={form.control}
                      name={storageClassPath(index)}
                      render={({ field }) => (
                        <>
                          <FieldLabel>{t('formStorageClassLabel')}</FieldLabel>
                          <Select
                            value={String(field.value ?? '')}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.trigger(storageClassPath(index));
                            }}
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
                        </>
                      )}
                    />
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
                          ('newerNoncurrentVersions' in transition
                            ? transition.newerNoncurrentVersions
                            : 0) ?? ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value;
                          form.setValue(
                            newerNoncurrentVersionsPath(index),
                            raw === '' ? '' : Number(raw),
                            { shouldValidate: true },
                          );
                        }}
                        disabled={isPending}
                      />
                    </div>
                  )}
                  {index > 0 && (
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
                  )}
                </div>
                <div className="flex gap-2">
                  <p className="flex-1 text-critical-500 text-sm min-h-5 mt-1">
                    {daysErrorMessage}
                  </p>
                  <p className="flex-1 text-critical-500 text-sm min-h-5 mt-1">
                    {storageClassErrorMessage}
                  </p>
                  {isNoncurrent && <div className="flex-1" />}
                </div>
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
