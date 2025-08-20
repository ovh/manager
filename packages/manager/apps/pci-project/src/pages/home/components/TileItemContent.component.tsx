import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSection, BottomSectionItem } from './useDashboardSections.hook';
import BillingItem from './BillingItem.component';
import StandardItem from './StandardItem.component';

interface TileItemContentProps {
  item: BottomSectionItem;
  section: BottomSection;
  isLoading: boolean;
  projectId: string;
}

const TileItemContent = memo(function TileItemContent({
  item,
  section,
  isLoading,
}: TileItemContentProps) {
  const { t } = useTranslation('project');

  const getAriaLabel = () => {
    if (section.type === 'billing') {
      return t('pci_project_project_billing_item_aria', {
        label: item.label || item.description,
      });
    }

    const ariaLabelMap = {
      documentation: t('pci_project_project_documentation_link_aria', {
        label: item.label || item.description,
      }),
      community: t('pci_project_project_community_link_aria', {
        label: item.label || item.description,
      }),
    };

    return ariaLabelMap[section.type] || item.label || item.description;
  };

  const renderContent = () => {
    // For billing section: use BillingItem for vouchers with data, StandardItem for links
    if (section.type === 'billing' && item.price) {
      return <BillingItem item={item} isLoading={isLoading} />;
    }

    return <StandardItem item={item} />;
  };

  return <div aria-label={getAriaLabel()}>{renderContent()}</div>;
});

export default TileItemContent;
