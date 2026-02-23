import { useTranslation } from 'react-i18next';
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  type RadioValueChangeDetail,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

interface MinimizedSectionProps {
  readonly minimized: boolean;
  readonly onMinimizedChange: (value: boolean) => void;
}

export default function MinimizedSection({
  minimized,
  onMinimizedChange,
}: MinimizedSectionProps) {
  const { t } = useTranslation('zone');

  return (
    <div>
      <Text preset={TEXT_PRESET.label} className="mb-3 block">
        {t('zone_page_reset_minimized_question')}
      </Text>
      <RadioGroup
        value={minimized ? 'yes' : 'no'}
        onValueChange={({ value }: RadioValueChangeDetail) =>
          onMinimizedChange(value === 'yes')
        }
        name="minimized"
        orientation="vertical"
      >
        <Radio value="no">
          <RadioControl />
          <RadioLabel>
            <Text>{t('zone_page_reset_minimized_no')}</Text></RadioLabel>
        </Radio>
        <Radio value="yes">
          <RadioControl />
          <RadioLabel><Text>{t('zone_page_reset_minimized_yes')}</Text></RadioLabel>
        </Radio>
      </RadioGroup>
    </div>
  );
}
