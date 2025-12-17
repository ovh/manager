import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Skeleton, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Clipboard, Tile, useFormatDate } from '@ovh-ux/muk';

import { GeneralInformationTileProps } from '@/components/dashboard/GeneralInformationTile.props';
import TenantStatus from '@/components/metrics/tenant-status/TenantStatus.component';
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
}: GeneralInformationTileProps) => {
  const { t } = useTranslation('tenants');

  const navigate = useNavigate();

  const formatDate = useFormatDate();

  const onClickEditTenantLink = () => {
    navigate(getEditTenantUrl(tenantId));
  };

  return (
    <Tile.Root title={t('dashboard.general_information_tile.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.name')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <Text preset={TEXT_PRESET.span}>{title}</Text>}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.description')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <Text preset={TEXT_PRESET.paragraph}>{description}</Text>}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.id')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <Clipboard className="w-full" value={iam?.id} />}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.urn')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <Clipboard className="w-full" value={iam?.urn} />}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.endpoint')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <Clipboard className="w-full" value={endpoint} />}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('status.title')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <TenantStatus status={resourceStatus} />}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.created_at')} />
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            createdAt && (
              <Text preset={TEXT_PRESET.span}>{formatDate({ date: createdAt, format: 'P' })}</Text>
            )
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.general_information_tile.updated_at')} />
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            updatedAt && (
              <Text preset={TEXT_PRESET.span}>{formatDate({ date: updatedAt, format: 'P' })}</Text>
            )
          )}
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
