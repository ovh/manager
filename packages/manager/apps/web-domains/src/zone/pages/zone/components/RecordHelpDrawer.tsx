import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_VARIANT,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  type DrawerOpenChangeDetail,
  Icon,
  ICON_NAME,
  Link,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { RECORD_FORM_CONFIGS } from '@/zone/utils/recordFormConfig';
import type { FormRowConfig } from '@/zone/types/recordFormConfig.types';

export interface RecordHelpEntry {
  readonly name: string;
  readonly labelKey: string;
  readonly descriptionKey: string;
}

export function getRecordHelpEntries(recordType: string): RecordHelpEntry[] {
  const config = RECORD_FORM_CONFIGS[recordType];
  if (!config) {
    return [];
  }

  const fromRows = (rows: readonly FormRowConfig[]): RecordHelpEntry[] =>
    rows.flatMap((row) =>
      row.fields.flatMap((field): RecordHelpEntry[] => {
        if (field === 'subdomain') {
          return config.subDomainReadOnly
            ? []
            : [
                {
                  name: 'subDomain',
                  labelKey: config.subDomainLabelKey ?? 'zone_page_form_subdomain',
                  descriptionKey: config.subDomainTooltipKey,
                },
              ];
        }
        if (field === 'ttl') {
          return [{ name: 'ttl', labelKey: 'zone_page_form_ttl', descriptionKey: 'zone_page_tooltip_ttl' }];
        }
        const children = field.type === 'group' ? field.children : [field];
        return children.flatMap((child) =>
          child.tooltipKey && !child.readOnly
            ? [{ name: child.name, labelKey: child.labelKey, descriptionKey: child.tooltipKey }]
            : [],
        );
      }),
    );

  return [...fromRows(config.rows), ...fromRows(config.advancedRows ?? [])];
}

interface RecordHelpDrawerProps {
  readonly recordType: string;
  readonly guideUrl: string;
  readonly onClose: () => void;
}

export default function RecordHelpDrawer({ recordType, guideUrl, onClose }: RecordHelpDrawerProps) {
  const { t } = useTranslation(['zone', NAMESPACES.ACTIONS]);
  const entries = getRecordHelpEntries(recordType);

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    if (!open) onClose();
  };

  return (
    <Drawer open onOpenChange={handleOpenChange} closeOnEscape closeOnInteractOutside>
      <DrawerContent position={DRAWER_POSITION.right} className="min-w-[28rem] max-w-[34rem]">
        <DrawerBody className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-6 py-8 px-1">
            <div className="space-y-2">
              <Text preset={TEXT_PRESET.heading3}>
                {t('zone_page_form_help_title', { type: recordType })}
              </Text>
              <Text preset={TEXT_PRESET.paragraph}>{t('zone_page_form_help_subtitle')}</Text>
            </div>

            <dl className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.name}>
                  <dt>
                    <Text preset={TEXT_PRESET.heading6}>{t(entry.labelKey)}</Text>
                  </dt>
                  <dd>
                    <Text preset={TEXT_PRESET.paragraph}>{t(entry.descriptionKey)}</Text>
                  </dd>
                </div>
              ))}
            </dl>

            <Link href={guideUrl} target="_blank" rel="noopener noreferrer">
              {t('zone_page_form_help_guide_link')}
              <Icon name={ICON_NAME.externalLink} />
            </Link>
          </div>
          <div className="flex gap-4 p-6 border-t flex-shrink-0 mb-6">
            <Button variant={BUTTON_VARIANT.ghost} onClick={onClose}>
              {t(`${NAMESPACES.ACTIONS}:close`)}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
