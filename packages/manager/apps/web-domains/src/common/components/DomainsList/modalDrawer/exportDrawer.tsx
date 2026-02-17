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
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ExportSelection,
  DomainColumn,
  ContactColumn,
} from '@/domain/types/export.types';

interface ExportDrawerProps {
  readonly isDrawerOpen: boolean;
  readonly onClose: () => void;
  readonly serviceNames: string[];
  readonly onExport: (selection: ExportSelection) => Promise<void>;
}

export default function ExportDrawer({
  isDrawerOpen,
  onClose,
  serviceNames,
  onExport,
}: ExportDrawerProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const defaultSelection: ExportSelection = {
    domainColumns: ['domain', 'domain-utf8', 'expiration', 'dns-server'],
    contactColumns: ['owner'],
  };
  const [selection, setSelection] = useState<ExportSelection>(defaultSelection);

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    if (!open) {
      setSelection(defaultSelection);
      onClose();
    }
  };

  const handleDomainSelectionChange = (ids: DomainColumn[]) => {
    setSelection((prev) => ({ ...prev, domainColumns: ids }));
  };

  const handleContactSelectionChange = (ids: ContactColumn[]) => {
    setSelection((prev) => ({ ...prev, contactColumns: ids }));
  };

  const handleValidate = () => {
    onExport(selection);
  };

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-[--ods-color-primary-500] opacity-75 z-40"
          onClick={onClose}
        />
      )}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={handleOpenChange}
        closeOnEscape
        closeOnInteractOutside
      >
        <DrawerContent
          position={DRAWER_POSITION.right}
          className="min-w-[28rem]"
        >
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
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              <Button variant="default" onClick={handleValidate}>
                {t(`${NAMESPACES.ACTIONS}:validate`)}
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
