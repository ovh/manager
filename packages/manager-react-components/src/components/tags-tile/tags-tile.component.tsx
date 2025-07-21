import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { TagsList, TagsListProps } from '../tags-list';
import './translations';
import { ManagerTile } from '../content';

export interface TagsTileProps extends Omit<TagsListProps, 'onClick'> {
  onEditTags?: () => void;
}

export const TagsTile: React.FC<TagsTileProps> = ({
  tags,
  displayInternalTags = false,
  lineNumber = 5,
  onEditTags,
}) => {
  const { t } = useTranslation('tags-tile');
  const isEmptyTags = !tags || Object.keys(tags).length === 0;

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('tags_tile_title')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('assigned_tags')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <div className="w-full min-w-[85px] h-[120px] overflow-auto">
            {isEmptyTags && <span>{t('tags_tile_empty')}</span>}
            {!isEmptyTags && (
              <TagsList
                tags={tags}
                lineNumber={lineNumber}
                displayInternalTags={displayInternalTags}
              />
            )}
          </div>
          <OdsLink
            href="#"
            className="mt-4"
            onClick={(e) => {
              onEditTags?.();
              e.preventDefault();
            }}
            label={isEmptyTags ? t('tags_tile_add_tag') : t('manage_tags')}
            icon={ODS_ICON_NAME.arrowRight}
          />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};
