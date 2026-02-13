import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import {
  FieldDescription,
  FieldLabel,
  Input,
  RadioGroup,
  RadioGroupItem,
  Label,
} from '@datatr-ux/uxlib';
import { LifecycleRuleContainer } from './LifecycleRuleContainer';
import { FormField } from '@/components/form-field/FormField.component';
import { useLifecycleFormContext } from './LifecycleForm.context';
import { TagInput } from '@/components/tag-input/TagInput.component';
import { CheckboxField } from './CheckboxField.component';
import { SizeFilterField } from './SizeFilterField.component';

export const LifecycleRuleScope = () => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const hasFilter = form.watch('hasFilter');
  const hasObjectSizeGreaterThan = form.watch('hasObjectSizeGreaterThan');
  const hasObjectSizeLessThan = form.watch('hasObjectSizeLessThan');

  return (
    <LifecycleRuleContainer title={t('formScopeTitle')}>
      <FieldDescription>{t('formScopeDescription')}</FieldDescription>
      <Controller
        control={form.control}
        name="hasFilter"
        render={({ field }) => (
          <RadioGroup
            value={field.value ? 'limited' : 'all'}
            onValueChange={(value) => field.onChange(value === 'limited')}
            disabled={isPending}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="limited" id="lifecycle-scope-limited" />
              <Label
                htmlFor="lifecycle-scope-limited"
                className="text-sm font-normal cursor-pointer"
              >
                {t('formScopeLimited')}
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="all" id="lifecycle-scope-all" />
              <Label
                htmlFor="lifecycle-scope-all"
                className="text-sm font-normal cursor-pointer"
              >
                {t('formScopeForAll')}
              </Label>
            </div>
          </RadioGroup>
        )}
      />

      {hasFilter && (
        <div className="flex flex-col gap-3 pl-2 mt-2">
          <FormField name="prefix" form={form}>
            {(field) => (
              <>
                <FieldLabel>{t('formPrefixLabel')}</FieldLabel>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder={t('formPrefixPlaceholder')}
                />
              </>
            )}
          </FormField>

          <div>
            <FieldLabel>{t('formTagsLabel')}</FieldLabel>
            <Controller
              control={form.control}
              name="tags"
              render={({ field: tagsField }) => (
                <TagInput
                  tags={tagsField.value}
                  setTags={(newTags) => tagsField.onChange(newTags)}
                  isPending={isPending}
                  showHeader={false}
                  t={t}
                  errors={
                    form.formState.errors.tags as Array<{
                      key?: { message?: string };
                    }>
                  }
                />
              )}
            />
          </div>

          <div>
            <CheckboxField
              id="lifecycle-size-greater-than"
              label={t('formObjectSizeGreaterThanCheckbox')}
              checked={hasObjectSizeGreaterThan}
              onCheckedChange={(checked) =>
                form.setValue('hasObjectSizeGreaterThan', checked)
              }
              disabled={isPending}
            />
            {hasObjectSizeGreaterThan && (
              <div className="pl-6 mt-2">
                <SizeFilterField
                  name="objectSizeGreaterThan"
                  label={t('formObjectSizeGreaterThanLabel')}
                  form={form}
                  isPending={isPending}
                />
              </div>
            )}
          </div>

          <div>
            <CheckboxField
              id="lifecycle-size-less-than"
              label={t('formObjectSizeLessThanCheckbox')}
              checked={hasObjectSizeLessThan}
              onCheckedChange={(checked) =>
                form.setValue('hasObjectSizeLessThan', checked)
              }
              disabled={isPending}
            />
            {hasObjectSizeLessThan && (
              <div className="pl-6 mt-2">
                <SizeFilterField
                  name="objectSizeLessThan"
                  label={t('formObjectSizeLessThanLabel')}
                  form={form}
                  isPending={isPending}
                />
              </div>
            )}
          </div>

          {form.formState.errors.objectSizeGreaterThan && (
            <p className="text-critical-500 text-sm">
              {form.formState.errors.objectSizeGreaterThan.message}
            </p>
          )}
        </div>
      )}
    </LifecycleRuleContainer>
  );
};
