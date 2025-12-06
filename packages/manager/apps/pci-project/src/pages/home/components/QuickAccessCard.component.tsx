import { OdsCard, OdsIcon, OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DashboardItem } from '@/data/models/Dashboard.type';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

type QuickAccessCardProps = {
  item: DashboardItem;
  index: number;
};

function QuickAccessCard({ item, index }: QuickAccessCardProps) {
  const { t } = useTranslation('home');
  const { trackClick } = useOvhTracking();

  const handleQuickAccessClick = () => {
    trackClick({
      actionType: 'action',
      actions: ['page', 'button', item.trackingName || ''],
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
        className="flex min-h-[100px] flex-row items-center truncate p-5 transition-colors hover:bg-[--ods-color-primary-100]"
        role="button"
        tabIndex={0}
      >
        <div className="w-23 h-23 flex items-center justify-center">
          {item.iconImage && (
            <img
              src={item.iconImage}
              alt={t('pci_project_quick_access_icon_alt', {
                service: t(item.labelTranslationKey),
              })}
              className="size-20"
            />
          )}
          {!item.iconImage && item.iconODS && (
            <OdsIcon name={item.iconODS} className="size-20 text-white" />
          )}
        </div>
        <div className="ml-5 flex flex-col justify-center">
          <OdsText preset="heading-4" className="mb-1 leading-tight">
            {t(item.labelTranslationKey)}
          </OdsText>
          <OdsLink
            href={item.link}
            color="primary"
            label={t(item.descriptionTranslationKey)}
            aria-label={t('pci_project_quick_access_link_aria_label', {
              description: t(item.descriptionTranslationKey),
            })}
          />
        </div>
      </OdsCard>
    </a>
  ) : (
    <OdsCard
      key={index}
      color="neutral"
      className="flex min-h-[100px] flex-row items-center truncate p-4 hover:bg-[--ods-color-primary-100]"
      role="button"
      tabIndex={0}
    >
      <div className="w-23 h-23 flex items-center justify-center rounded bg-[var(--ods-color-information-700)]">
        {item.iconImage && (
          <img
            src={item.iconImage}
            alt={t('pci_project_quick_access_icon_alt', {
              service: t(item.labelTranslationKey),
            })}
            className="size-20"
          />
        )}
        {!item.iconImage && item.iconODS && (
          <OdsIcon name={item.iconODS} className="size-20 text-white" />
        )}
      </div>
      <div className="ml-6 flex flex-col justify-center">
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
