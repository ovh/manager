import React, { useState } from 'react';
import {
  OdsComboboxItem,
  OdsCombobox,
  OdsSkeleton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';

import { useTranslation } from 'react-i18next';
import { useGetResourceTags } from '../../hooks/iam/useOvhIam';

export type TagsFilterFormProps = {
  resourceType: string;
  tagKey: string;
  setTagKey: (tagKey: string) => void;
  value: string;
  setValue: (value: string) => void;
};

export function TagsFilterForm({
  resourceType,
  tagKey,
  setTagKey,
  setValue,
}: TagsFilterFormProps) {
  const { t } = useTranslation('filters');

  const {
    tags,
    isError: isTagsError,
    isLoading: isTagsLoading,
  } = useGetResourceTags({
    resourceType,
  });

  return (
    <div>
      <OdsFormField className="mt-2 w-full">
        <div slot="label">
          <span className="text-[--ods-color-heading] leading-[22px]">
            {t('common_criteria_adder_key_label')}
          </span>
        </div>
        {isTagsLoading && <OdsSkeleton />}
        {!isTagsLoading && (
          <OdsCombobox
            name="tag-key"
            allowNewElement={false}
            onOdsChange={(event) => {
              setTagKey(event.detail.value || '');
            }}
            data-testid="tags-filter-form-key-field"
          >
            {!isTagsError &&
              tags?.map((tag) => (
                <OdsComboboxItem key={tag.key} value={tag.key}>
                  {tag.key}
                </OdsComboboxItem>
              ))}
          </OdsCombobox>
        )}
      </OdsFormField>
      <OdsFormField className="mt-2 w-full">
        <div slot="label">
          <span className="text-[--ods-color-heading] leading-[22px]">
            {t('common_criteria_adder_value_label')}
          </span>
        </div>
        {isTagsLoading && <OdsSkeleton />}
        {!isTagsLoading && (
          <OdsCombobox
            name="tag-value"
            isDisabled={!tagKey}
            allowNewElement={false}
            onOdsChange={(event) => {
              setValue(event.detail.value || '');
            }}
            data-testid="tags-filter-form-value-field"
          >
            {tags
              ?.find((tag) => tag.key === tagKey)
              ?.values?.map((tagValue) => (
                <OdsComboboxItem key={tagValue} value={tagValue}>
                  {tagValue}
                </OdsComboboxItem>
              ))}
          </OdsCombobox>
        )}
      </OdsFormField>
    </div>
  );
}
