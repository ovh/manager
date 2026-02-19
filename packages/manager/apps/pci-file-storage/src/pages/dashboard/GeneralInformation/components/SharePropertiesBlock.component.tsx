import React from 'react';

import { useTranslation } from 'react-i18next';

import { Clipboard, ClipboardControl, ClipboardTrigger, Link, Text } from '@ovhcloud/ods-react';

import { DashboardCardLayout } from '@/components/dashboard/DashboardCardLayout.component';
import { DashboardTileBlock } from '@/components/dashboard/DashboardTileBlock.component';
import { useNetwork } from '@/data/hooks/network/useNetwork';
import { useShare } from '@/data/hooks/shares/useShare';
import { useFormatGiBSize } from '@/hooks/useFormatShareSize';
import { PciAppUrlSuffix, usePciAppUrl } from '@/hooks/usePciAppUrl';
import { useShareParams } from '@/hooks/useShareParams';
import {
  selectNetworkDetails,
  selectShareDetails,
} from '@/pages/dashboard/view-model/shareDetails.view-model';

export const SharePropertiesBlock: React.FC = () => {
  const { t } = useTranslation(['general_information', 'share']);
  const { region, shareId } = useShareParams();
  const { data: shareDetails, isLoading: isShareLoading } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  const { data: networkDetails, isLoading: isNetworkLoading } = useNetwork(
    region,
    shareDetails?.networkId,
    {
      select: selectNetworkDetails,
    },
  );

  const networkUrl = usePciAppUrl(PciAppUrlSuffix.PrivateNetworks);

  const formattedSize = useFormatGiBSize(shareDetails?.size ?? 0);

  return (
    <DashboardCardLayout title={t('cards.properties')}>
      <DashboardTileBlock
        label={t('share:fields.protocol')}
        isLoading={isShareLoading}
        withoutDivider
      >
        <Text preset="paragraph">{shareDetails?.protocol}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.allocated_capacity')} isLoading={isShareLoading}>
        <Text preset="paragraph">{formattedSize}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.mount_path')} isLoading={isShareLoading}>
        <div className="flex flex-col gap-3">
          {shareDetails?.mountPaths?.map((path) => (
            <Clipboard key={path} value={path}>
              <ClipboardControl className="w-full" />
              <ClipboardTrigger
                labelCopy={t('clipboard.copy')}
                labelCopySuccess={t('clipboard.copy_success')}
              />
            </Clipboard>
          ))}
        </div>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('share:fields.private_network')}
        isLoading={isShareLoading || isNetworkLoading}
      >
        <div className="flex flex-col gap-1">
          <Text preset="paragraph">{t('share:fields.network_name')}</Text>
          <Link href={networkUrl ?? ''} target="_self">
            {networkDetails?.displayName}
          </Link>
        </div>
      </DashboardTileBlock>
    </DashboardCardLayout>
  );
};
