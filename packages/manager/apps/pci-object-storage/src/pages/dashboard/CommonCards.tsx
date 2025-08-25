import {
  OdsBadge,
  OdsCard,
  OdsDivider,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { useTranslation } from 'react-i18next';

export type TOdsBadgeColor =
  | 'neutral'
  | 'alpha'
  | 'beta'
  | 'critical'
  | 'information'
  | 'new'
  | 'promotion'
  | 'success'
  | 'warning';

export type TTTrackActionParams = {
  actionType: 'page' | 'funnel';
  specificAction: string;
};

type TCommonCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const CommonCard = ({
  title,
  children,
  className = '',
}: TCommonCardProps) => (
  <OdsCard className={`flex-col  h-fit ${className}`} color="neutral">
    <div className="flex flex-col w-full">
      <div className="mx-8">
        <div className="flex flex-col w-full my-6">
          <OdsText preset="heading-4" className="font-semibold">
            {title}
          </OdsText>
        </div>
        <OdsDivider />
        {children}
      </div>
    </div>
  </OdsCard>
);

type TCardSectionProps = {
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
};

export const CardSection = ({
  title,
  children,
  showDivider = true,
}: TCardSectionProps) => (
  <>
    <div className="flex flex-col w-full my-6">
      <OdsText preset="heading-6" className="font-semibold mb-4">
        {title}
      </OdsText>
      <span className="text-[#4d5592]">{children}</span>
    </div>
    {showDivider && <OdsDivider />}
  </>
);

type TStatusBadgeProps = {
  status: string;
  translationKey: string;
  color: TOdsBadgeColor;
  className?: string;
  isStorageCard?: boolean;
};

export const StatusBadge = ({
  status,
  translationKey,
  color,
  className = '',
  isStorageCard = false,
}: TStatusBadgeProps) => {
  const { t } = useTranslation(['containers/enable-versioning']);
  return (
    <div>
      <OdsBadge
        size="md"
        label={
          isStorageCard
            ? t(`${translationKey}_${status}`)
            : t(`${translationKey}_${status}_label`)
        }
        color={color}
        className={className}
      />
    </div>
  );
};

type TApiAvailableBadgeProps = {
  className?: string;
};

export const ApiAvailableBadge = ({
  className = '',
}: TApiAvailableBadgeProps) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <OdsBadge
      size="md"
      color="neutral"
      label={t(
        'dashboard:pci_projects_project_storages_dashboard_object_available_on_api',
      )}
      className={className}
    />
  );
};
