import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';

export type QuickAccessItem = {
  icon: string;
  title: string;
  description: string;
  link: string;
};

type QuickAccessCardProps = {
  item: QuickAccessItem;
  index: number;
};

export function QuickAccessCard({ item, index }: QuickAccessCardProps) {
  const { t } = useTranslation('project');

  return (
    <Link
      to={item.link}
      className="no-underline"
      key={index}
      aria-label={t('pci_project_quick_access_card_aria_label', {
        title: item.title,
        description: item.description,
      })}
    >
      <OdsCard
        color="neutral"
        className="flex flex-row items-center p-4 min-h-[100px] truncate"
        role="button"
        tabIndex={0}
      >
        <div className="bg-[var(--ods-color-information-700)] rounded flex items-center justify-center w-23 h-23">
          <img
            src={item.icon}
            alt={t('pci_project_quick_access_icon_alt', {
              service: item.title,
            })}
            className="w-20 h-20"
          />
        </div>
        <div className="flex flex-col justify-center ml-6">
          <OdsText preset="heading-4" className="mb-1 leading-tight">
            {item.title}
          </OdsText>
          <OdsText
            preset="paragraph"
            className="text-primary-500"
            aria-label={t('pci_project_quick_access_link_aria_label', {
              description: item.description,
            })}
          >
            {item.description}
          </OdsText>
        </div>
      </OdsCard>
    </Link>
  );
}
