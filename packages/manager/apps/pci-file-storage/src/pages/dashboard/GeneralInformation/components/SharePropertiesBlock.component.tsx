import React from 'react';

import { useTranslation } from 'react-i18next';

import { Clipboard, ClipboardControl, ClipboardTrigger, Text } from '@ovhcloud/ods-react';

import { ActionLink } from '@/components/action-link/ActionLink.component';
import { DashboardCardLayout } from '@/components/dashboard/DashboardCardLayout.component';
import { DashboardTileBlock } from '@/components/dashboard/DashboardTileBlock.component';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';

export const SharePropertiesBlock: React.FC = () => {
  const { t } = useTranslation('general_information');
  const { region, shareId } = useShareParams();
  const { data: shareDetails, isLoading } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  return (
    <DashboardCardLayout title={t('cards.properties')}>
      <DashboardTileBlock label={t('fields.protocol')} isLoading={isLoading} withoutDivider>
        <Text preset="paragraph">{shareDetails?.protocol}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('fields.allocated_size')} isLoading={isLoading}>
        <div className="flex flex-col gap-1">
          <Text preset="paragraph">{shareDetails != null ? `${shareDetails.size} GB` : null}</Text>
          {shareDetails?.enabledActions.includes('update_size') && (
            <ActionLink
              path="#"
              className="w-fit text-[--ods-color-primary-600]"
              label={t('actions.upgrade_share')}
            />
          )}
        </div>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('fields.mount_path')} isLoading={isLoading}>
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
