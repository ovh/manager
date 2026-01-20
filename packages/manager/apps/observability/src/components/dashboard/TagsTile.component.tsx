import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Skeleton } from '@ovhcloud/ods-react';

import { TagsList, Tile } from '@ovh-ux/muk';

import { TagsTileProps } from '@/components/dashboard/TagsTile.props';

export const TagsTile = ({ href, title, tags, isLoading, hideLink = false }: TagsTileProps) => {
  const { t } = useTranslation('tenants');

  const _href = useHref(href);

  return (
    <Tile.Root title={t('dashboard.tags_tile.title')}>
      <Tile.Item.Root>
        {isLoading ? (
          <Skeleton />
        ) : (
          <TagsList displayInternalTags={hideLink} tags={tags} modalHeading={title} maxLines={1} />
        )}

        {!hideLink && (
          <Link href={_href}>
            <span>{t('dashboard.tags_tile.manage_tags')}</span>
          </Link>
        )}
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default TagsTile;
