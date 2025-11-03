import {
  Card,
  CARD_COLOR,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FreeHostingOptions } from '../Hosting';

interface CheckboxCardProps {
  optionKey: keyof FreeHostingOptions;
  translationKey: string;
  onCheckedChange: (key: keyof FreeHostingOptions, value: boolean) => void;
}

export default function CheckboxCard({
  optionKey,
  translationKey,
  onCheckedChange,
}: CheckboxCardProps) {
  const { t } = useTranslation(['domain']);

  return (
    <Card className="w-full p-8" color={CARD_COLOR.neutral}>
      <Checkbox
        onCheckedChange={(checked) =>
          onCheckedChange(optionKey, checked.checked as boolean)
        }
      >
        <CheckboxControl />
        <CheckboxLabel>
          <Text preset={TEXT_PRESET.heading5}>{t(translationKey)}</Text>
        </CheckboxLabel>
      </Checkbox>
    </Card>
  );
}
