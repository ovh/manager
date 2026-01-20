import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge, Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import SkeletonWrapper from '@/components/dashboard/SkeletonWrapper.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenants } from '@/data/hooks/tenants/useTenants.hook';
import { urls } from '@/routes/Routes.constants';

export const ServiceLinks = () => {
  const { t } = useTranslation(['services', 'shared']);
  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';
  const { data: tenants, isLoading } = useTenants(resourceName);
  const comingSoon = <Badge color={BADGE_COLOR.neutral}>{t('shared:coming_soon')}</Badge>;

  const href = useHref(urls.tenants);

  return (
    <Tile.Root title={t('dashboard.links.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.links.tenants')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Text preset={TEXT_PRESET.paragraph}>{tenants?.length ?? 0}</Text>
          </SkeletonWrapper>
          <Link href={href}>{t('dashboard.links.link')}</Link>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.links.datastreams')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>{comingSoon}</SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.links.managed_dashboards')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>{comingSoon}</SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default ServiceLinks;
