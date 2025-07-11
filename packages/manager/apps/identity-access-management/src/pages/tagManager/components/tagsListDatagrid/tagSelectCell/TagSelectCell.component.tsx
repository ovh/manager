import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { IamTagListItem } from '@/data/api/get-iam-tags';
import { TagManagerContext } from '@/pages/tagManager/tagsManagerContext';

export default function TagSelectCell({ name: tag }: IamTagListItem) {
  const { t } = useTranslation('tag-manager');
  const { toggleSelectTag, selectedTagsList } = useContext(TagManagerContext);

  return (
    <>
      <OdsCheckbox
        inputId={`select-${tag}`}
        name={t('selectTag')}
        aria-label={t('selectTag')}
        onOdsChange={() => toggleSelectTag(tag)}
        isChecked={selectedTagsList.includes(tag)}
      />
    </>
  );
}
