import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Radio as OdsRadio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { EncryptionType } from '@/api/select/volume';
import { useVolumeEncryptions } from '@/api/hooks/useCatalog';

const Radio = ({
  children,
  value,
  disabled,
}: PropsWithChildren<{ value: string; disabled?: boolean }>) => (
  <OdsRadio
    value={value}
    aria-label="encryption"
    {...(disabled ? { disabled: true } : {})}
  >
    <RadioControl />
    <RadioLabel>{children}</RadioLabel>
  </OdsRadio>
);

interface Props {
  encryptionType: EncryptionType | null;
  onChange: (value: EncryptionType | null) => void;
  title: string;
  description?: string;
  isNew?: boolean;
}

export const Encryption = ({
  encryptionType,
  onChange,
  title,
  description,
  isNew = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { data } = useVolumeEncryptions();

  const { enabledEncryptions, disabledEncryptions } = useMemo(() => {
    const radioEncryption = data.map((encryption) => ({
      ...encryption,
      value: encryption.type ?? 'none',
    }));

    return radioEncryption.reduce(
      (acc, encryption) => {
        if (encryption.comingSoon) acc.disabledEncryptions.push(encryption);
        else acc.enabledEncryptions.push(encryption);
        return acc;
      },
      {
        enabledEncryptions: [] as typeof radioEncryption,
        disabledEncryptions: [] as typeof radioEncryption,
      },
    );
  }, [data]);

  return (
    <fieldset className="border-0 p-0" role="radiogroup">
      <legend className="flex items-center p-0 mb-4 gap-4">
        <Text preset={TEXT_PRESET.heading3}>{title}</Text>
        {isNew && (
          <Badge color={BADGE_COLOR.new}>
            {t('common:pci_projects_project_storages_blocks_new')}
          </Badge>
        )}
      </legend>

      {description && <Text>{description}</Text>}

      <RadioGroup
        name="encryption"
        className="pl-6 mt-4"
        value={encryptionType ?? 'none'}
        onValueChange={({ value }) =>
          onChange(value === 'none' ? null : (value as EncryptionType))
        }
      >
        {enabledEncryptions.map(({ value, label }) => (
          <Radio value={value} key={value}>
            {label}
          </Radio>
        ))}
        {/* We need to put it outside radio group because ODS does weird things with disable */}
        {disabledEncryptions.map(({ value, label, comingSoon }) => (
          <div key={value} className="flex items-center">
            <Radio value={value} disabled>
              {label}
            </Radio>

            {comingSoon && (
              <Badge
                color={BADGE_COLOR.neutral}
                className="ml-5"
                size={BADGE_SIZE.sm}
              >
                {t('common:pci_projects_project_storages_blocks_coming_soon')}
              </Badge>
            )}
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
};
