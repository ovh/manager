import React from 'react';

import { useTranslation } from 'react-i18next';

import { Clipboard, ClipboardControl, ClipboardTrigger, Text } from '@ovhcloud/ods-react';

import { DashboardCardLayout } from '@/components/dashboard/DashboardCardLayout.component';
import { DashboardTileBlock } from '@/components/dashboard/DashboardTileBlock.component';
import { useShare } from '@/data/hooks/shares/useShare';
import { useFormatGiBSize } from '@/hooks/useFormatShareSize';
import { useShareParams } from '@/hooks/useShareParams';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';

export const SharePropertiesBlock: React.FC = () => {
  const { t } = useTranslation(['general_information', 'share']);
  const { region, shareId } = useShareParams();
  const { data: shareDetails, isLoading } = useShare(region, shareId, {
    select: selectShareDetails,
  });
  const formatSize = useFormatGiBSize(shareDetails?.size ?? 0);

  return (
    <DashboardCardLayout title={t('cards.properties')}>
      <DashboardTileBlock label={t('share:fields.protocol')} isLoading={isLoading} withoutDivider>
        <Text preset="paragraph">{shareDetails?.protocol}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.allocated_capacity')} isLoading={isLoading}>
        <Text preset="paragraph">{shareDetails != null ? formatSize : null}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.mount_path')} isLoading={isLoading}>
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
    </DashboardCardLayout>
  );
};
