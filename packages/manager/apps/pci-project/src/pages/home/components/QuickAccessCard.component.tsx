import { OdsCard, OdsText, OdsIcon } from '@ovhcloud/ods-components/react';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { DashboardItem } from '@/constants';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type QuickAccessCardProps = {
  item: DashboardItem;
  index: number;
};

function QuickAccessCard({ item, index }: QuickAccessCardProps) {
  const { t } = useTranslation('home');
  const { trackClick } = useOvhTracking();

  const handleQuickAccessClick = () => {
    // Track the click action
    trackClick({
      actionType: 'action',
      actions: [
        ...PROJECTS_TRACKING.PROJECT_HOME.CTA_QUICK_ACCESS,
        item.labelTranslationKey,
      ],
    });
  };

  return item.link ? (
    <a
      href={item.link}
      className="no-underline"
      key={index}
      onClick={handleQuickAccessClick}
      aria-label={t('pci_project_quick_access_card_aria_label', {
        title: t(item.labelTranslationKey),
        description: t(item.descriptionTranslationKey),
      })}
    >
      <OdsCard
        color="neutral"
        className="flex flex-row items-center p-4 min-h-[100px] truncate"
        role="button"
        tabIndex={0}
      >
        <div className="bg-[var(--ods-color-information-700)] rounded flex items-center justify-center w-23 h-23">
          {item.iconImage && (
            <img
              src={item.iconImage}
              alt={t('pci_project_quick_access_icon_alt', {
                service: t(item.labelTranslationKey),
              })}
              className="w-20 h-20"
            />
          )}
          {!item.iconImage && item.iconODS && (
            <OdsIcon name={item.iconODS} className="w-20 h-20 text-white" />
          )}
        </div>
        <div className="flex flex-col justify-center ml-6">
          <OdsText preset="heading-4" className="mb-1 leading-tight">
            {t(item.labelTranslationKey)}
          </OdsText>
          <OdsText
            preset="paragraph"
            className="text-primary-500"
            aria-label={t('pci_project_quick_access_link_aria_label', {
              description: t(item.descriptionTranslationKey),
            })}
          >
            {t(item.descriptionTranslationKey)}
          </OdsText>
        </div>
      </OdsCard>
    </a>
  ) : (
    <OdsCard
      key={index}
      color="neutral"
      className="flex flex-row items-center p-4 min-h-[100px] truncate"
      role="button"
      tabIndex={0}
    >
      <div className="bg-[var(--ods-color-information-700)] rounded flex items-center justify-center w-23 h-23">
        {item.iconImage && (
          <img
            src={item.iconImage}
            alt={t('pci_project_quick_access_icon_alt', {
              service: t(item.labelTranslationKey),
            })}
            className="w-20 h-20"
          />
        )}
        {!item.iconImage && item.iconODS && (
          <OdsIcon name={item.iconODS} className="w-20 h-20 text-white" />
        )}
      </div>
      <div className="flex flex-col justify-center ml-6">
        <OdsText preset="heading-4" className="mb-1 leading-tight">
          {t(item.labelTranslationKey)}
        </OdsText>
        <OdsText
          preset="paragraph"
          className="text-primary-500"
          aria-label={t('pci_project_quick_access_link_aria_label', {
            description: t(item.descriptionTranslationKey),
          })}
        >
          {t(item.descriptionTranslationKey)}
        </OdsText>
      </div>
    </OdsCard>
  );
}

export default QuickAccessCard;
