import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Clipboard, Tile, useFormatDate } from '@ovh-ux/muk';

import { GeneralInformationTileProps } from '@/components/dashboard/GeneralInformationTile.props';
import SkeletonWrapper from '@/components/dashboard/SkeletonWrapper.component';
import ResourceBadgeStatus from '@/components/services/status/ResourceBadgeStatus.component';
import { getEditTenantUrl } from '@/routes/Routes.utils';

export const GeneralInformationTile = ({
  tenantId,
  title,
  description,
  iam,
  endpoint,
  createdAt,
  updatedAt,
  isLoading,
  resourceStatus,
  resourceName,
}: GeneralInformationTileProps) => {
  const { t } = useTranslation(['tenants', NAMESPACES.STATUS]);

  const navigate = useNavigate();

  const formatDate = useFormatDate();

  const onClickEditTenantLink = () => {
    navigate(getEditTenantUrl({ tenantId, resourceName }));
  };

  return (
    <Tile.Root title={t('dashboard.general_information_tile.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.name')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Text preset={TEXT_PRESET.span}>{title}</Text>
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.description')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Text preset={TEXT_PRESET.paragraph}>{description}</Text>
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.id')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Clipboard className="w-full" value={tenantId} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.urn')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Clipboard className="w-full" value={iam?.urn} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.endpoint')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Clipboard className="w-full" value={endpoint} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.STATUS}:status`)} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <ResourceBadgeStatus status={resourceStatus} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.created_at')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            {createdAt && (
              <Text preset={TEXT_PRESET.span}>{formatDate({ date: createdAt, format: 'P' })}</Text>
            )}
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.updated_at')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            {updatedAt && (
              <Text preset={TEXT_PRESET.span}>{formatDate({ date: updatedAt, format: 'P' })}</Text>
            )}
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Link onClick={onClickEditTenantLink}>
          <span>{t('dashboard.general_information_tile.edit_information')}</span>
        </Link>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default GeneralInformationTile;
