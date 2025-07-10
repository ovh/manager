import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { TagsList } from '../tags-list';
import '../translations';
import { ManagerTile } from '../../content';

export interface TagsTileProps {
  tags: { [key: string]: string };
  displayInternalTags?: boolean;
  onEditTags: () => void;
}

export const TagsTile = React.forwardRef<HTMLOdsModalElement, TagsTileProps>(
  ({ tags, displayInternalTags = false, onEditTags }) => {
    const { t } = useTranslation('tags');
    const isEmptyTags = !tags || (tags && Object.keys(tags).length === 0);

    return (
      <ManagerTile>
        <ManagerTile.Title>{t('tags_tile_title')}</ManagerTile.Title>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>{t('assigned_tags')}</ManagerTile.Item.Label>
          <ManagerTile.Item.Description>
            <div className="w-full min-w-[85px] h-[120px] overflow-auto">
              {isEmptyTags && <span>{t('tags_tile_empty')}</span>}
              {tags && Object.keys(tags).length > 0 && (
                <TagsList
                  tags={tags}
                  lineNumber={5}
                  displayInternalTags={displayInternalTags}
                />
              )}
            </div>
            <OdsLink
              href="#"
              className="mt-4"
              onClick={(e) => {
                if (onEditTags) onEditTags();
                e.preventDefault();
              }}
              label={isEmptyTags ? t('tags_tile_add_tag') : t('manage_tags')}
              icon={ODS_ICON_NAME.arrowRight}
            />
          </ManagerTile.Item.Description>
        </ManagerTile.Item>
      </ManagerTile>
    );
  },
);
