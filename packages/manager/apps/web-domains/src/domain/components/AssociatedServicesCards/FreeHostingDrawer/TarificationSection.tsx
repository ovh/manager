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
import Section from './Section';

export default function TarificationSection() {
  const { t } = useTranslation(['domain']);

  return (
    <Section title="domain_tab_general_information_associated_services_hosting_drawer_offer_tarification">
      <Card className="w-full p-8 bg-gray-50" color={CARD_COLOR.neutral}>
        <Checkbox checked disabled>
          <CheckboxControl />
          <CheckboxLabel>
            <Text preset={TEXT_PRESET.heading5}>
              {t(
                'domain_tab_general_information_associated_services_hosting_drawer_offer_tarification_content',
              )}
            </Text>
          </CheckboxLabel>
        </Checkbox>
      </Card>
    </Section>
  );
}
