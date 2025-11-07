import {
  Button,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerOpenChangeDetail,
  Message,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DomainTreeView from '../treeViews/domainTreeView';
import ContactTreeView from '../treeViews/contactTreeView';

interface ExportDrawerProps {
  readonly isDrawerOpen: boolean;
  readonly onClose: () => void;
  readonly serviceNames: string[];
  readonly onExport: (selection: ExportSelection) => Promise<void>;
}

interface ExportSelection {
  domainColumns: string[];
  contactColumns: string[];
}

export default function ExportDrawer({
  isDrawerOpen,
  onClose,
  serviceNames,
  onExport,
}: ExportDrawerProps) {
  const { t } = useTranslation('domain');

  const [selection, setSelection] = useState<ExportSelection>({
    domainColumns: ['domain', 'domain-utf8', 'expiration', 'dns-server'],
    contactColumns: ['owner'],
  });

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    if (!open) onClose();
  };

  const handleDomainSelectionChange = (ids: string[]) => {
    setSelection((prev) => ({ ...prev, domainColumns: ids }));
  };

  const handleContactSelectionChange = (ids: string[]) => {
    setSelection((prev) => ({ ...prev, contactColumns: ids }));
  };

  const handleValidate = () => {
    onExport(selection);
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={handleOpenChange}
      closeOnEscape
      closeOnInteractOutside
    >
      <DrawerContent position={DRAWER_POSITION.right} className="min-w-[28rem]">
        <DrawerBody className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-8 py-8">
            <Text preset={TEXT_PRESET.heading2}>
              {t('domain_table_drawer_title')}
            </Text>
            <div className="space-y-6">
              <Text preset={TEXT_PRESET.heading5}>
                {serviceNames.length === 0
                  ? t('domain_table_drawer_selected_all')
                  : t('domain_table_drawer_selected_count', {
                      count: serviceNames.length,
                    })}
              </Text>
              <Text preset={TEXT_PRESET.paragraph}>
                {t('domain_table_drawer_info')}
              </Text>
            </div>
            <div className="space-y-6">
              <Text preset={TEXT_PRESET.heading3}>
                {t('domain_table_drawer_column_domain', {
                  count: serviceNames.length,
                })}
              </Text>
              <DomainTreeView
                selectedIds={selection.domainColumns}
                onSelectionChange={handleDomainSelectionChange}
              />
            </div>
            <div className="space-y-6">
              <Text preset={TEXT_PRESET.heading3}>
                {t('domain_table_drawer_column_contact')}
              </Text>
              <ContactTreeView
                selectedIds={selection.contactColumns}
                onSelectionChange={handleContactSelectionChange}
              />
            </div>
          </div>
          <div className="pt-6 space-y-6">
            <Message dismissible={false}>
              {t('domain_table_drawer_column_info_message')}
            </Message>
          </div>
          <div className="flex gap-4 p-6 border-t flex-shrink-0 mb-6">
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="default" onClick={handleValidate}>
              Valider
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
