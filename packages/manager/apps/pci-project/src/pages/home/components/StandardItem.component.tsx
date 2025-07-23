import { OdsText, OdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { BottomSectionItem } from './useDashboardSections.hook';

interface StandardItemProps {
  item: BottomSectionItem;
}

export default function StandardItem({ item }: StandardItemProps) {
  const { t } = useTranslation('project');

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1 truncate">
        <OdsText preset="heading-6" className="block">
          {item.label}
        </OdsText>
        <OdsLink
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          label={item.description}
          aria-label={`${item.description} - ${t('opens_in_new_tab')}`}
        />
      </div>
    </div>
  );
}
