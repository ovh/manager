import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Icon,
  Link,
  Spinner,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FreeHostingOptions } from '../Hosting';
import { TInitialOrderFreeHosting } from '@/domain/types/hosting';
import Section from './Section';

interface ActivationSectionProps {
  isLoading: boolean;
  freeHostingOptions: FreeHostingOptions;
  orderCartDetails: TInitialOrderFreeHosting;
  onCheckedChange: (key: keyof FreeHostingOptions, value: boolean) => void;
}

export default function ActivationSection({
  isLoading,
  freeHostingOptions,
  orderCartDetails,
  onCheckedChange,
}: ActivationSectionProps) {
  const { t } = useTranslation(['domain']);

  if (isLoading) {
    return (
      <Section title="domain_tab_general_information_associated_services_hosting_drawer_offer_activation">
        <Spinner />
      </Section>
    );
  }

  return (
    <Section title="domain_tab_general_information_associated_services_hosting_drawer_offer_activation">
      <Checkbox
        className="pl-3"
        onCheckedChange={(checked) =>
          onCheckedChange('consent', checked.checked as boolean)
        }
        checked={freeHostingOptions.consent}
      >
        <CheckboxControl />
        <CheckboxLabel>
          <Text preset={TEXT_PRESET.heading5}>
            {t(
              'domain_tab_general_information_associated_services_hosting_drawer_offer_activation_content',
            )}
          </Text>
        </CheckboxLabel>
      </Checkbox>
      {orderCartDetails?.contracts.map((contract) => {
        return (
          <Link key={contract.name} href={contract.url} target="_blank">
            {contract.name}
            <Icon name="external-link" />
          </Link>
        );
      })}
    </Section>
  );
}
