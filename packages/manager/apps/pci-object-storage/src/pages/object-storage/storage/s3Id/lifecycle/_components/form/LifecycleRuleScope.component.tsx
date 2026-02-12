import { useTranslation } from 'react-i18next';
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

export const LifecycleRuleScope = () => {
  const { form, isPending } = useLifecycleFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const hasFilter = form.watch('hasFilter');
  const tags = form.watch('tags');

  return (
    <LifecycleRuleContainer title={t('formScopeTitle')}>
      <FieldDescription>{t('formScopeDescription')}</FieldDescription>
      <RadioGroup
        value={hasFilter ? 'limited' : 'all'}
        onValueChange={(value) =>
          form.setValue('hasFilter', value === 'limited')
        }
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

      {hasFilter && (
        <div className="flex flex-col gap-3 pl-6 mt-2">
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
            <TagInput
              tags={tags}
              setTags={(newTags) => form.setValue('tags', newTags)}
              isPending={isPending}
              showHeader={false}
              t={t}
            />
          </div>
        </div>
      )}
    </LifecycleRuleContainer>
  );
};
