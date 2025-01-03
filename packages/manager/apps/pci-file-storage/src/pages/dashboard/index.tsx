import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  OsdsText,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsTile,
  OsdsClipboard,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import ShareStatus from '@/components/ShareStatus/ShareStatus';

import { useShare } from '@/api/hooks/useShare';
import { Share } from '@/api';

export const ShareCardTile: React.FC<React.PropsWithChildren<{
  label: string;
  divider?: boolean;
  action?: boolean;
  disabled?: boolean;
  color?: ODS_THEME_COLOR_INTENT;
}>> = ({ label, divider = true, action, color, disabled, children }) => (
  <div className="flex flex-col mb-3">
    {action && (
      <div className="flex w-full justify-between cursor-pointer">
        <OsdsLink
          color={color ?? ODS_THEME_COLOR_INTENT.primary}
          disabled={disabled}
        >
          {label}
        </OsdsLink>
        <OsdsIcon
          name={ODS_ICON_NAME.CHEVRON_RIGHT}
          size={ODS_ICON_SIZE.sm}
          color={
            disabled
              ? ODS_THEME_COLOR_INTENT.default
              : ODS_THEME_COLOR_INTENT.primary
          }
        />
      </div>
    )}
    {!action && (
      <>
        <OsdsText
          className="mb-2"
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {label}
        </OsdsText>
        <OsdsText
          className="mb-2"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.default}
        >
          {children}
        </OsdsText>
      </>
    )}
    {divider && <OsdsDivider separator />}
  </div>
);

const ShareCard: React.FC<React.PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => {
  return (
    <OsdsTile className="w-full flex-col" inline rounded>
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {label}
        </OsdsText>
        <OsdsDivider separator />
        {children}
      </div>
    </OsdsTile>
  );
};

const ManageShareCard = () => {
  const { t } = useTranslation('pci-file-storage/general_information');
  const { t: tDashboard } = useTranslation('pci-file-storage/dashboard');
  return (
    <ShareCard label={t('title_manage')}>
      {/* ACL */}
      <ShareCardTile label={t('action_manage_acl')} action />

      {/* Create Snapshot */}
      <OsdsTooltip>
        <OsdsTooltipContent slot="tooltip-content">
          {tDashboard('coming_soon')}
        </OsdsTooltipContent>
        <ShareCardTile label={t('action_create_snapshot')} action disabled />
      </OsdsTooltip>

      {/* Manage Snapshots */}
      <OsdsTooltip>
        <OsdsTooltipContent slot="tooltip-content">
          {tDashboard('coming_soon')}
        </OsdsTooltipContent>
        <ShareCardTile label={t('action_manage_snapshot')} action disabled />
      </OsdsTooltip>

      {/* Restore Snapshots */}
      <OsdsTooltip>
        <OsdsTooltipContent slot="tooltip-content">
          {tDashboard('coming_soon')}
        </OsdsTooltipContent>
        <ShareCardTile label={t('action_restore_snapshot')} action disabled />
      </OsdsTooltip>

      {/* Upgrade Size */}
      <OsdsTooltip>
        <OsdsTooltipContent slot="tooltip-content">
          {tDashboard('coming_soon')}
        </OsdsTooltipContent>
        <ShareCardTile label={t('action_upgrade_size')} action disabled />
      </OsdsTooltip>

      {/* Delete */}
      <ShareCardTile
        label={t('action_delete')}
        color={ODS_THEME_COLOR_INTENT.error}
        action
      />
    </ShareCard>
  );
};

const ShareInformationCard = ({ share }: { share: Share }) => {
  const { t } = useTranslation('pci-file-storage/general_information');
  return (
    <ShareCard label={t('title_information')}>
      {/* Name */}
      <ShareCardTile label={t('title_name')}>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
        >
          {share.name}
        </OsdsText>
      </ShareCardTile>

      {/* Status */}
      <ShareCardTile label={t('title_status')}>
        <ShareStatus status={share.status} />
      </ShareCardTile>

      {/* Region */}
      <ShareCardTile label={t('title_region')}>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
        >
          {share.region}
        </OsdsText>
      </ShareCardTile>

      {/* Creation Date */}
      <ShareCardTile label={t('title_createdAt')}>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
        >
          {new Intl.DateTimeFormat().format(share.createdAt)}
        </OsdsText>
      </ShareCardTile>

      {/* Protocol */}
      <ShareCardTile label={t('title_protocol')}>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
        >
          {share.protocol}
        </OsdsText>
      </ShareCardTile>

      {/* Size */}
      <ShareCardTile label={t('title_size')} divider={false}>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._400}
        >
          {share.size} GB
        </OsdsText>
      </ShareCardTile>
    </ShareCard>
  );
};

const ShareConnectingCard = ({ share }: { share: Share }) => {
  const { t } = useTranslation('pci-file-storage/general_information');
  return (
    <ShareCard label={t('title_connecting')}>
      {/* Mount Path */}
      <ShareCardTile label={t('title_mount_path')} divider={false}>
        <OsdsClipboard
          aria-label="clipboard"
          value={share.exportLocations[0].path}
        >
          <span slot="success-message">{t('copy_success')}</span>
          <span slot="error-message">{t('copy_error')}</span>
        </OsdsClipboard>
      </ShareCardTile>
    </ShareCard>
  );
};

const GeneralInformation = () => {
  const { projectId, regionName, serviceName } = useParams();
  const { data: share }: { data: Share } = useShare({
    projectId,
    regionName,
    shareId: serviceName,
  });

  return (
    <React.Suspense>
      {share && (
        <div className="grid xs:grid-cols-1 md:grid-cols-3 py-6">
          <div className="p-3">
            <ManageShareCard />
          </div>
          <div className="p-3">
            <ShareInformationCard share={share} />
          </div>
          <div className="p-3">
            <ShareConnectingCard share={share} />
          </div>
        </div>
      )}
    </React.Suspense>
  );
};

export default GeneralInformation;
