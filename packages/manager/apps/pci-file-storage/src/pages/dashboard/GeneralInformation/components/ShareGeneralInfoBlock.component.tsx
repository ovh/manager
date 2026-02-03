import React from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_SIZE, Badge, Text } from '@ovhcloud/ods-react';

import { ActionLink } from '@/components/action-link/ActionLink.component';
import { DashboardCardLayout } from '@/components/dashboard/DashboardCardLayout.component';
import { DashboardTileBlock } from '@/components/dashboard/DashboardTileBlock.component';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';
import { subRoutes } from '@/routes/Routes.constants';

export const ShareGeneralInfoBlock: React.FC = () => {
  const { t } = useTranslation(['general_information']);
  const { region, shareId } = useShareParams();
  const { data: shareDetails, isLoading } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  return (
    <DashboardCardLayout title={t('general_information:cards.informations')}>
      <DashboardTileBlock
        label={t('general_information:fields.id')}
        isLoading={isLoading}
        withoutDivider
      >
        <Text preset="paragraph">{shareDetails?.id}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('general_information:fields.share_name')} isLoading={isLoading}>
        <Text preset="paragraph">{shareDetails?.name}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('general_information:fields.status')} isLoading={isLoading}>
        {shareDetails != null && (
          <Badge
            size={BADGE_SIZE.sm}
            color={shareDetails.statusDisplay.badgeColor}
            className="w-fit"
          >
            {t(shareDetails.statusDisplay.labelKey)}
          </Badge>
        )}
      </DashboardTileBlock>
      <DashboardTileBlock label={t('general_information:fields.location')} isLoading={isLoading}>
        {shareDetails != null && (
          <div className="flex items-center gap-2">
            <Text preset="paragraph">
              {t(shareDetails.regionDisplayKey, { micro: shareDetails.region })}
            </Text>
            <Badge size={BADGE_SIZE.sm} color="primary" className="w-fit">
              1-AZ
            </Badge>
          </div>
        )}
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('general_information:fields.creation_date')}
        isLoading={isLoading}
      >
        <Text preset="paragraph">{shareDetails?.createdAt}</Text>
      </DashboardTileBlock>
      {shareDetails?.enabledActions.includes('delete') && (
        <DashboardTileBlock isLoading={isLoading}>
          <ActionLink
            path={`../${subRoutes.shareDelete}`}
            className="w-fit text-[--ods-color-critical-600]"
            label={t('general_information:actions.delete')}
          />
        </DashboardTileBlock>
      )}
    </DashboardCardLayout>
  );
};
