import {
  OdsButton,
  OdsModal,
  OdsText,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import React, { Ref, useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
  OdsInputChangeEvent,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TagsList } from '../tags-list';
import './translations';

export interface TagsModalProps {
  displayName: string;
  isOpen: boolean;
  tags: { [key: string]: string };
  displayInternalTags?: boolean;
  onCancel: () => void;
  onEditTags: () => void;
}

export const TagsModal = React.forwardRef<HTMLOdsModalElement, TagsModalProps>(
  (
    {
      isOpen = false,
      displayName,
      tags,
      displayInternalTags = false,
      onEditTags,
      onCancel,
    },
    ref: Ref<HTMLOdsModalElement>,
  ) => {
    const { t } = useTranslation('tags-modal');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<{ [key: string]: string }>(tags);

    const handleSearch = () => {
      setResults(
        search
          ? Object.fromEntries(
              Object.entries(tags).filter(
                ([key, value]: [string, string]) =>
                  key.toLowerCase().includes(search.toLowerCase()) ||
                  value.toLowerCase().includes(search.toLowerCase()),
              ),
            )
          : tags,
      );
    };

    return (
      <OdsModal
        color={'neutral'}
        className="text-left"
        onOdsClose={onCancel}
        isOpen={isOpen}
        ref={ref}
      >
        <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading5}>
          {'Tags:'} {displayName}
        </OdsText>
        <div className="flex w-full mb-4">
          <OdsInput
            name="search"
            className="rounded-l flex-1 mr-1"
            placeholder={t('search_placeholder')}
            type="text"
            onOdsChange={(event: OdsInputChangeEvent) => {
              setSearch(event.detail.value as string);
            }}
          />
          <OdsButton
            className="rounded-r"
            variant={ODS_BUTTON_VARIANT.outline}
            size={ODS_BUTTON_SIZE.sm}
            onClick={handleSearch}
            label={t('search')}
          />
        </div>

        <div className="w-full min-w-[85px] h-[120px] overflow-auto">
          {results && <TagsList tags={results} />}
        </div>
        <OdsButton
          variant={ODS_BUTTON_VARIANT.ghost}
          slot="actions"
          color={'primary'}
          onClick={onCancel}
          label={t('back')}
          className="mt-4"
          type="button"
        />

        <OdsButton
          slot="actions"
          color={'primary'}
          onClick={onEditTags}
          label={t('edit_tags')}
          className="mt-4"
          type="button"
        />
      </OdsModal>
    );
  },
);
