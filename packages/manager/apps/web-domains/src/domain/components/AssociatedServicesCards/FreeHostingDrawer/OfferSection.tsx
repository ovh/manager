import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import PriceCard from '@/common/components/Card/PriceCard';
import Section from './Section';

export default function OfferSection() {
  const { t } = useTranslation(['domain']);

  return (
    <Section title="domain_tab_general_information_associated_services_hosting_drawer_offer">
      <PriceCard
        title={t(
          'domain_tab_general_information_associated_services_hosting_drawer_offer_title',
        )}
        checked
        disabled
        footer={
          <Text preset={TEXT_PRESET.heading4} className="pl-5">
            {t('domain_tab_DNS_anycast_order_include')}
          </Text>
        }
      />
    </Section>
  );
}
