import { useTranslation } from 'react-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  FormField,
  FormFieldLabel,
  Skeleton,
} from '@ovhcloud/ods-react';

import { useGetResourceTags } from '../../../../hooks/iam/useOvhIam';
import { FilterTagsFormProps } from './FilterTagsForm.props';

export function FilterTagsForm({ resourceType, tagKey, setTagKey, setValue }: FilterTagsFormProps) {
  const { t } = useTranslation('filters');
  const {
    tags,
    isError: isTagsError,
    isLoading: isTagsLoading,
  } = useGetResourceTags({
    resourceType,
  });

  const TagsLoading = () => (
    <div className="w-full">
      <Skeleton />
    </div>
  );

  const TagsMapped =
    !isTagsError && tags
      ? tags.map((tag) => ({
          value: tag.key,
          label: tag.key,
        }))
      : [];

  const TagsValuesMapped =
    !isTagsError && tags
      ? tags
          .find((tag) => tag.key === tagKey)
          ?.values?.map((tagValue) => ({
            value: tagValue,
            label: tagValue,
          })) || []
      : [];

  return (
    <>
      <FormField className="mt-4 w-full w-[186px]">
        <FormField>{t('common_criteria_adder_key_label')}</FormField>
        {isTagsLoading ? (
          <TagsLoading />
        ) : (
          <Combobox
            className="w-full"
            name="tag-key"
            onValueChange={(value) => setTagKey(value?.value?.[0] || '')}
            data-testid="tags-filter-form-key-field"
            items={TagsMapped}
          >
            <ComboboxControl />
            <ComboboxContent />
          </Combobox>
        )}
      </FormField>
      <FormField className="mt-4 w-[186px]">
        <FormFieldLabel>{t('common_criteria_adder_value_label')}</FormFieldLabel>
        {isTagsLoading ? (
          <TagsLoading />
        ) : (
          <Combobox
            className="w-full"
            name="tag-value"
            disabled={!tagKey}
            onValueChange={(value) => {
              setValue(value?.value?.[0] || '');
            }}
            data-testid="tags-filter-form-value-field"
            items={TagsValuesMapped}
          >
            <ComboboxControl />
            <ComboboxContent />
          </Combobox>
        )}
      </FormField>
    </>
  );
}
