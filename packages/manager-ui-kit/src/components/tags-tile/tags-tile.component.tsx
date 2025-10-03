import React from 'react';
import { useTranslation } from 'react-i18next';
import { TagsList, TagsListProps } from '../tags-list';
import './translations';
import { Tile } from '../tile';
import { Link, LinkType } from '../Link';

export interface TagsTileProps extends Omit<TagsListProps, 'onClick'> {
  onEditTags?: () => void;
  lineNumber?: number;
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
    <Tile.Root title={t('tags_tile_title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('assigned_tags')} />
        <Tile.Item.Description>
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
          <Link
            type={LinkType.external}
            href="#"
            className="mt-4"
            onClick={(e) => {
              onEditTags?.();
              e.preventDefault();
            }}
          >
            {isEmptyTags ? t('tags_tile_add_tag') : t('manage_tags')}
          </Link>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};
