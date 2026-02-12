import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  FieldLabel,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@datatr-ux/uxlib';
import { Plus, X } from 'lucide-react';
import { useLifecycleFormContext } from './LifecycleForm.context';
import {
  TRANSITION_STORAGE_CLASSES,
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
  daysLabelKey: string;
  addButtonLabelKey: string;
};

type TransitionItem = {
  days?: number;
  noncurrentDays?: number;
  storageClass?: string;
};

export function TransitionListField(config: TransitionListFieldConfig) {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );

  const hasField = form.watch(config.hasFieldName);
  const transitions = form.watch(
    config.transitionsFieldName,
  ) as LifecycleFormValues[typeof config.transitionsFieldName];
  const transitionErrors = form.formState.errors[config.transitionsFieldName];

  const transitionsList: TransitionItem[] = Array.isArray(transitions)
    ? transitions
    : [];
  const transitionLike = transitionsList.map((tr) => ({
    storageClass: tr.storageClass,
  }));
  const daysList = transitionsList.map((tr) => ({
    days: tr[config.daysKey] ?? 0,
  }));

  const addTransition = () => {
    const nextDays = getNextTransitionDays(daysList);
    const newItem =
      config.daysKey === 'days'
        ? ({ days: nextDays, storageClass: '' } as PathValue<
            LifecycleFormValues,
            'transitions'
          >[number])
        : ({
            noncurrentDays: nextDays,
            storageClass: '',
          } as PathValue<
            LifecycleFormValues,
            'noncurrentVersionTransitions'
          >[number]);
    form.setValue(config.transitionsFieldName, [...transitionsList, newItem], {
      shouldValidate: true,
    });
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
      const initialItem =
        config.daysKey === 'days'
          ? ({ days: MIN_TRANSITION_GAP_DAYS, storageClass: '' } as PathValue<
              LifecycleFormValues,
              'transitions'
            >[number])
          : ({
              noncurrentDays: MIN_TRANSITION_GAP_DAYS,
              storageClass: '',
            } as PathValue<
              LifecycleFormValues,
              'noncurrentVersionTransitions'
            >[number]);
      form.setValue(config.transitionsFieldName, [initialItem], {
        shouldValidate: true,
      });
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

  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          id={config.checkboxId}
          checked={hasField}
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
        <Label
          htmlFor={config.checkboxId}
          className="text-sm font-normal cursor-pointer"
        >
          {t(config.checkboxLabelKey)}
        </Label>
      </div>

      {hasField && (
        <div className="flex flex-col gap-2 pl-6">
          {transitionsList.map((transition, index) => {
            const daysValue = transition[config.daysKey];
            const errorMessage = Array.isArray(transitionErrors)
              ? (transitionErrors[index] as {
                  days?: { message?: string };
                  noncurrentDays?: { message?: string };
                })?.[config.daysKey]?.message
              : undefined;

            return (
              <div key={index} className="flex gap-2 items-end">
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
                  {errorMessage && (
                    <p className="text-critical-500 text-sm mt-1">
                      {errorMessage}
                    </p>
                  )}
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
                      {TRANSITION_STORAGE_CLASSES.map((sc) => {
                        const disabled = getDisabledStorageClasses(
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
            );
          })}
          {canAddTransition(transitionLike) && (
            <Button
              type="button"
              size="md"
              mode="outline"
              onClick={addTransition}
              disabled={isPending}
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
