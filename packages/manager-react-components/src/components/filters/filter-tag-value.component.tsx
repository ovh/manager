import React, { useState } from 'react';
import {
  OdsComboboxItem,
  OdsCombobox,
  OdsSkeleton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';

import { useTranslation } from 'react-i18next';
import { useGetResourceTags } from '../../hooks/iam/useOvhIam';

export type FilterTagValueProps = {
  resourceType: string;
  onTagInputChange: ({
    tagKey,
    value,
  }: {
    tagKey: string;
    value?: string;
  }) => void;
};

export function FilterTagValue({
  resourceType,
  onTagInputChange,
}: FilterTagValueProps) {
  const { t } = useTranslation('filters');
  const [tagKey, setTagKey] = useState('');

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
              setTagKey(event.detail.value);
              onTagInputChange({ tagKey: event.detail.value });
            }}
            data-testid="filter-tag_tag-key"
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
              onTagInputChange({ tagKey, value: event.detail.value });
            }}
            data-testid="filter-tag_tag-value"
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
