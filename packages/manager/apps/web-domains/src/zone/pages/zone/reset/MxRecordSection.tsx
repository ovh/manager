import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  FormField,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
  INPUT_TYPE,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';
import type { MxEntry, MxType } from '@/zone/pages/zone/reset/reset.types';

interface MxRecordSectionProps {
  readonly mxType: MxType | null;
  readonly mxEntries: MxEntry[];
  readonly availableMxTypes: MxType[];
  readonly onMxTypeChange: (val: MxType) => void;
  readonly onUpdateEntry: (index: number, field: keyof MxEntry, value: string | number) => void;
  readonly onAddEntry: () => void;
  readonly onRemoveEntry: (index: number) => void;
}

export default function MxRecordSection({
  mxType,
  mxEntries,
  availableMxTypes,
  onMxTypeChange,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
}: MxRecordSectionProps) {
  const { t } = useTranslation('zone');

  const mxTypeItems = availableMxTypes.map((v) => ({
    label: t(`zone_page_reset_type_${v}`),
    value: v,
  }));

  return (
    <div>
      <FormField>
        <FormFieldLabel>{t('zone_page_reset_type_mx_label')}</FormFieldLabel>
        <Select
          items={mxTypeItems}
          onValueChange={(detail: { value?: string[] }) =>
            onMxTypeChange((detail.value?.[0] ?? '') as MxType)
          }
        >
          <SelectControl placeholder={t('zone_page_reset_select_placeholder')} />
          <SelectContent createPortal={false} />
        </Select>
      </FormField>

      {mxType === 'CUSTOM' && (
        <div className="mt-3">
          <Text preset={TEXT_PRESET.caption} className="mb-2 block">
            {t('zone_page_reset_type_custom_mx_label')}
          </Text>
          {mxEntries.map((entry, index) => (
            <div key={entry.id} className="flex gap-2 mb-2 items-start">
              <FormField className="flex-1">
                {index === 0 && (
                  <FormFieldLabel className="text-xs">
                    {t('zone_page_reset_mx_server')}
                  </FormFieldLabel>
                )}
                <Input
                  type={INPUT_TYPE.text}
                  value={entry.target}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdateEntry(index, 'target', e.target.value)
                  }
                  placeholder="mail.example.com"
                />
              </FormField>
              <FormField className="w-24">
                {index === 0 && (
                  <FormFieldLabel className="text-xs">
                    {t('zone_page_reset_mx_priority')}
                  </FormFieldLabel>
                )}
                <Input
                  type={INPUT_TYPE.number}
                  value={String(entry.priority)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdateEntry(
                      index,
                      'priority',
                      Number.parseInt(e.target.value, 10) || 0,
                    )
                  }
                  placeholder="0"
                />
              </FormField>
              <div className={`flex gap-1 ${index === 0 ? 'mt-5' : ''}`}>
                {mxEntries.length > 1 && (
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    size={BUTTON_SIZE.sm}
                    onClick={() => onRemoveEntry(index)}
                  >
                    <Icon name={ICON_NAME.trash} />
                  </Button>
                )}
                {index === mxEntries.length - 1 && entry.target.trim() !== '' && (
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    size={BUTTON_SIZE.sm}
                    onClick={onAddEntry}
                  >
                    +
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
