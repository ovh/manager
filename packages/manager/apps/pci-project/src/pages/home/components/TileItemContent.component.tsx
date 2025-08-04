import { useTranslation } from 'react-i18next';
import { BottomSection, BottomSectionItem } from './useDashboardSections.hook';
import BillingItem from './BillingItem.component';
import StandardItem from './StandardItem.component';
import VoucherLink from './VoucherLink.component';

interface TileItemContentProps {
  item: BottomSectionItem;
  section: BottomSection;
  isLoading: boolean;
  projectId: string;
}

export default function TileItemContent({
  item,
  section,
  isLoading,
  projectId,
}: TileItemContentProps) {
  const { t } = useTranslation('project');

  // Determine element type once
  const elementType = item.isVoucherLink ? 'voucher' : section.type;

  const getAriaLabel = () => {
    const ariaLabelMap = {
      voucher: t('pci_project_project_link_credits_vouchers_aria'),
      billing: t('pci_project_project_billing_item_aria', {
        label: item.label,
      }),
      documentation: t('pci_project_project_documentation_link_aria', {
        label: item.label,
      }),
      community: t('pci_project_project_community_link_aria', {
        label: item.label,
      }),
    };

    return ariaLabelMap[elementType] || item.label;
  };

  const renderContent = () => {
    const contentMap = {
      voucher: <VoucherLink projectId={projectId} />,
      billing: <BillingItem item={item} isLoading={isLoading} />,
      documentation: <StandardItem item={item} />,
      community: <StandardItem item={item} />,
    };

    return contentMap[elementType] || <StandardItem item={item} />;
  };

  return <div aria-label={getAriaLabel()}>{renderContent()}</div>;
}
