import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FreeHostingOptions } from '../Hosting';
import CheckboxCard from './CheckboxCard';
import Section from './Section';

interface DnsSectionProps {
  readonly onCheckedChange: (
    key: keyof FreeHostingOptions,
    value: boolean,
  ) => void;
}

export default function DnsSection({ onCheckedChange }: DnsSectionProps) {
  const { t } = useTranslation(['domain']);

  return (
    <Section title="domain_tab_general_information_associated_services_hosting_drawer_offer_dns">
      <div className="space-y-4">
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            'domain_tab_general_information_associated_services_hosting_drawer_offer_dns_content',
          )}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            'domain_tab_general_information_associated_services_hosting_drawer_offer_dns_content2',
          )}
        </Text>
      </div>
      <div className="space-y-6">
        <CheckboxCard
          optionKey="dnsA"
          translationKey="domain_tab_general_information_associated_services_hosting_drawer_offer_dns_checkbox_dns_a"
          onCheckedChange={onCheckedChange}
        />
        <CheckboxCard
          optionKey="dnsMx"
          translationKey="domain_tab_general_information_associated_services_hosting_drawer_offer_dns_checkbox_dns_mx"
          onCheckedChange={onCheckedChange}
        />
      </div>
    </Section>
  );
}
