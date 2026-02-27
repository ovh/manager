import React from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_SIZE, Badge, Text } from '@ovhcloud/ods-react';

import { useFormatDate } from '@ovh-ux/muk';

import { ActionLink } from '@/components/action-link/ActionLink.component';
import { DashboardCardLayout } from '@/components/dashboard/DashboardCardLayout.component';
import { DashboardTileBlock } from '@/components/dashboard/DashboardTileBlock.component';
import { DeploymentModeBadge } from '@/components/new-lib/deploymentModeBadge/DeploymentModeBadge.component';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';
import { subRoutes } from '@/routes/Routes.constants';

export const ShareGeneralInfoBlock: React.FC = () => {
  const { t } = useTranslation(['general_information', 'share', 'regions', 'status']);
  const { region, shareId } = useShareParams();
  const { data: shareDetails, isLoading } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  const formatDate = useFormatDate();

  const formatedDate = formatDate({ date: shareDetails?.createdAt, format: 'P p (O)' });

  return (
    <DashboardCardLayout title={t('general_information:cards.informations')}>
      <DashboardTileBlock label={t('share:fields.id')} isLoading={isLoading}>
        <Text preset="paragraph">{shareDetails?.id}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.share_name')} isLoading={isLoading}>
        <Text preset="paragraph">{shareDetails?.name}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.status')} isLoading={isLoading}>
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
      <DashboardTileBlock label={t('share:fields.location')} isLoading={isLoading}>
        {shareDetails != null && (
          <div className="flex items-center gap-4">
            <Text preset="paragraph">
              {t(shareDetails.regionDisplayKey, { micro: shareDetails.region })}
            </Text>
            <DeploymentModeBadge mode="region" />
          </div>
        )}
      </DashboardTileBlock>
      <DashboardTileBlock label={t('share:fields.creation_date')} isLoading={isLoading}>
        <Text preset="paragraph">{shareDetails?.createdAt ? formatedDate : null}</Text>
      </DashboardTileBlock>
      {shareDetails?.enabledActions.includes('delete') && (
        <DashboardTileBlock isLoading={isLoading}>
          <ActionLink
            path={`./${subRoutes.shareDelete}`}
            className="w-fit text-[--ods-color-critical-600]"
            label={t('share:actions.delete')}
          />
        </DashboardTileBlock>
      )}
    </DashboardCardLayout>
  );
};
