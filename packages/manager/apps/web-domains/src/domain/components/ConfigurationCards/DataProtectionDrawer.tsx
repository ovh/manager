import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerOpenChangeDetail,
  Icon,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { TDomainResource } from '@/domain/types/domainResource';
import {
  translateContactType,
  translateContactField,
} from '../../utils/dataProtection';

interface DataProtectionDrawerProps {
  readonly isDrawerOpen: boolean;
  readonly onClose: () => void;
  readonly domainResource: TDomainResource;
  readonly visibleContacts: Array<{
    key: string;
    id: string;
    label: string;
    disclosedFields: string[];
  }>;
  readonly selectedContacts: string[];
  readonly onCheckboxChange: (
    contactKey: string,
    checked: boolean | 'indeterminate',
  ) => void;
  readonly onClick: (selectedContacts: string[]) => void;
}

export default function DataProtectionDrawer({
  isDrawerOpen,
  onClose,
  domainResource,
  visibleContacts,
  selectedContacts,
  onCheckboxChange,
  onClick,
}: DataProtectionDrawerProps) {
  const { t } = useTranslation(['domain']);

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    if (!open) onClose();
  };

  const handleValidate = () => {
    onClick(selectedContacts);
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
          <div className="flex-1 overflow-y-auto space-y-8 py-8 pl-4">
            <Text preset={TEXT_PRESET.heading2}>
              {t('domain_tab_general_information_data_drawer_title')}
            </Text>
            <div className="space-y-6">
              <Text preset={TEXT_PRESET.paragraph}>
                {t('domain_tab_general_information_data_drawer_description')}
              </Text>
              <Text preset={TEXT_PRESET.paragraph}>
                <Trans
                  t={t}
                  i18nKey="domain_tab_general_information_data_drawer_description_info"
                  components={{ strong: <span className="font-bold" /> }}
                />
              </Text>
              <div className="space-y-4">
                {visibleContacts.map((contact) => (
                  <div key={contact.key} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedContacts.includes(contact.key)}
                      onCheckedChange={(detail) =>
                        onCheckboxChange(contact.key, detail.checked)
                      }
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>
                          <Trans
                            t={t}
                            i18nKey="domain_tab_general_information_data_drawer_contact_label"
                            components={{
                              strong: <span className="font-bold" />,
                            }}
                            values={{
                              type: t(
                                translateContactType(domainResource)[
                                  contact.key
                                ],
                              ),
                            }}
                          />
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon name="circle-question" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          {t(
                            'domain_tab_general_information_data_drawer_contact_field',
                          )}
                          <Text>
                            {contact.disclosedFields
                              .map((field: string) =>
                                t(
                                  translateContactField[
                                    field as keyof typeof translateContactField
                                  ],
                                ),
                              )
                              .join(', ')}
                          </Text>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 p-6 border-t flex-shrink-0 mb-6">
            <Button variant="ghost" onClick={onClose}>
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              variant="default"
              onClick={handleValidate}
              disabled={selectedContacts.length === 0}
            >
              {t(`${NAMESPACES.ACTIONS}:validate`)}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
