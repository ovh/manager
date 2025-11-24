import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { TagsList } from '@/components/dashboard/TagsList.component';
import { TagsTileProps } from '@/components/dashboard/TagsTile.props';
import { getTenantTagsUrl } from '@/routes/Routes.utils';

export const TagsTile = ({ tenantId, tags, isLoading }: TagsTileProps) => {
  const { t } = useTranslation('tenants');

  const navigate = useNavigate();

  const onClickManageTagsLink = () => {
    navigate(getTenantTagsUrl(tenantId));
  };

  return (
    <Tile.Root title={t('dashboard.tags_tile.title')}>
      <Tile.Item.Root>
        <TagsList tags={tags} isLoading={isLoading} maxVisibleTags={8} />

        <Link onClick={onClickManageTagsLink}>
          <span>{t('dashboard.tags_tile.manage_tags')}</span>
        </Link>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default TagsTile;
