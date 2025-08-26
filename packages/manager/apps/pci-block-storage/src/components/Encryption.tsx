import React, { PropsWithChildren, useMemo } from 'react';
import {
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Badge } from '@ovh-ux/manager-pci-common';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { EncryptionType } from '@/api/select/volume';
import { useVolumeEncryptions } from '@/api/hooks/useCatalog';

const Radio = ({
  children,
  value,
  disabled,
}: PropsWithChildren<{ value: string; disabled?: boolean }>) => (
  <OsdsRadio
    value={value}
    name="encryption"
    {...(disabled ? { disabled: true } : {})}
  >
    <OsdsRadioButton
      size={ODS_RADIO_BUTTON_SIZE.xs}
      color={ODS_THEME_COLOR_INTENT.primary}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
        slot="end"
        className={clsx(!disabled && 'cursor-pointer')}
      >
        {children}
      </OsdsText>
    </OsdsRadioButton>
  </OsdsRadio>
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
      <legend className="flex items-baseline p-0">
        <Subtitle>{title}</Subtitle>
        {isNew && (
          <Badge
            color="new"
            label={t('common:pci_projects_project_storages_blocks_new')}
            className="ml-4"
          />
        )}
      </legend>

      {description && (
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {description}
        </OsdsText>
      )}

      <div>
        <OsdsRadioGroup
          name="encryption"
          value={encryptionType ?? 'none'}
          onOdsValueChange={({ detail }) =>
            onChange(
              detail.newValue === 'none'
                ? null
                : (detail.newValue as EncryptionType),
            )
          }
        >
          {enabledEncryptions.map(({ value, label }) => (
            <Radio value={value} key={value}>
              {label}
            </Radio>
          ))}
        </OsdsRadioGroup>
        {/* We need to put it outside radio group because ODS does weird things with disable */}
        {disabledEncryptions.map(({ value, label, comingSoon }) => (
          <div key={value} className="flex items-baseline">
            <Radio value={value} disabled>
              {label}
            </Radio>

            {comingSoon && (
              <Badge
                label={t(
                  'common:pci_projects_project_storages_blocks_coming_soon',
                )}
                color="neutral"
                className="ml-5"
              />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};
