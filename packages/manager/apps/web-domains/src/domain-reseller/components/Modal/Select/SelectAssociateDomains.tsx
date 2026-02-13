import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface SelectAssociateDomainsProps {
  items: { label: string; value: string }[];
  selectedDomains: string[];
  onSelectionChange: (domains: string[]) => void;
}

export default function SelectAssociateDomains({
  items,
  selectedDomains,
  onSelectionChange,
}: SelectAssociateDomainsProps) {
  const { t } = useTranslation(['domain-reseller']);

  const handleValueChange = (event: { value: string[] }) => {
    onSelectionChange(event.value);
  };

  return (
    <Select
      items={items}
      value={selectedDomains}
      onValueChange={handleValueChange}
      multiple
    >
      <SelectControl
        placeholder={t('domain_reseller_associate_modal_placeholder')}
      />
      <SelectContent createPortal={false} />
    </Select>
  );
}
