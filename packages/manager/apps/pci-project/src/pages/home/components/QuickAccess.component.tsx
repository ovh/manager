import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { QuickAccessCard, QuickAccessItem } from './QuickAccessCard.component';

export function QuickAccess({ items }: { items: QuickAccessItem[] }) {
  const { t } = useTranslation('project');

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('pci_project_project_quick_access')}
      </OdsText>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 m-6">
        {items.map((item, idx) => (
          <QuickAccessCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </>
  );
}
