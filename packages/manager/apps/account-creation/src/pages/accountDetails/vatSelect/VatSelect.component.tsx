import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Tile,
  Text,
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
} from '@ovhcloud/ods-react';
import './VatSelect.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type VatSelectProps = {
  vatId: string;
  value?: string;
  onValueChange: (value: string | undefined) => void;
};

export default function VatSelect({
  vatId,
  value,
  onValueChange,
}: VatSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);

  const { t } = useTranslation('account-details');
  return (
    <RadioGroup
      onValueChange={({ value: newValue }) => {
        onValueChange(newValue || undefined);
        setSelectedValue(newValue || undefined);
      }}
      defaultValue={vatId}
    >
      <Tile selected={selectedValue === vatId}>
        <Radio value={vatId} className="config-tile">
          <div className="config-tile__info">
            <div className="config-tile__info__radio">
              <RadioControl />

              <RadioLabel className="flex flex-col gap-2">
                <Text
                  className="flex flex-row gap-4 items-center"
                  preset={TEXT_PRESET.heading5}
                >
                  {vatId}
                  <Badge
                    size={BADGE_SIZE.sm}
                    color={BADGE_COLOR.information}
                    className="uppercase"
                  >
                    {t('account_details_vat_select_detected')}
                  </Badge>
                </Text>
              </RadioLabel>
            </div>
            <div className="config-tile__info__description">
              <Text preset={TEXT_PRESET.paragraph}>
                {t('account_details_vat_select_description_detected')}
              </Text>
            </div>
          </div>
        </Radio>
      </Tile>
      <Tile selected={selectedValue === undefined}>
        <Radio value={''} className="config-tile">
          <div className="config-tile__info">
            <div className="config-tile__info__radio">
              <RadioControl />

              <RadioLabel>
                <Text preset={TEXT_PRESET.heading5}>
                  {t('account_details_vat_select_no_vat')}
                </Text>
              </RadioLabel>
            </div>
            <div className="config-tile__info__description">
              <Text preset={TEXT_PRESET.paragraph}>
                {t('account_details_vat_select_description_no_vat')}
              </Text>
            </div>
          </div>
        </Radio>
      </Tile>
    </RadioGroup>
  );
}
