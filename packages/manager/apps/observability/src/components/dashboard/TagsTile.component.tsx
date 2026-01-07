import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Skeleton } from '@ovhcloud/ods-react';

import { TagsList, Tile } from '@ovh-ux/muk';

import { TagsTileProps } from '@/components/dashboard/TagsTile.props';
import { getTenantTagsUrl } from '@/routes/Routes.utils';

export const TagsTile = ({ tenantId, resourceName, title, tags, isLoading }: TagsTileProps) => {
  const { t } = useTranslation('tenants');

  const navigate = useNavigate();

  const onClickManageTagsLink = () => {
    navigate(getTenantTagsUrl({ tenantId, resourceName }));
  };

  return (
    <Tile.Root title={t('dashboard.tags_tile.title')}>
      <Tile.Item.Root>
        {isLoading ? <Skeleton /> : <TagsList tags={tags} modalHeading={title} maxLines={1} />}

        <Link onClick={onClickManageTagsLink}>
          <span>{t('dashboard.tags_tile.manage_tags')}</span>
        </Link>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default TagsTile;
