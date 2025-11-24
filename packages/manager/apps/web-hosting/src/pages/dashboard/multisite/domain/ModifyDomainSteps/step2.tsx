import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ServiceStatus } from '@/data/types/status';

import { Step2Props } from './types';

export default function Step2({ watch, hosting }: Step2Props) {
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ACTIONS, NAMESPACES.COUNTRIES]);

  return (
    <div className="flex flex-col items-center space-y-3">
      <Text className="text-center">
        {t('multisite:multisite_modal_domain_configuration_modify_step2_summary')}
      </Text>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm w-3/4">
        <Text className="text-right" preset={TEXT_PRESET.heading6}>
          {t('web_hosting_status_header_fqdn')}
        </Text>
        <Text>{watch('domain')}</Text>
        <Text className="text-right" preset={TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_myfolder')}
        </Text>
        <Text>{watch('path')}</Text>
        <Text className="text-right" preset={TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_step2_cdn')}
        </Text>
        <Text>
          {watch('cdn') === ServiceStatus.ACTIVE
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </Text>
        <Text className="text-right" preset={TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_step2_ssl')}
        </Text>
        <Text>
          {hosting?.hasHostedSsl
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </Text>
        <Text className="text-right" preset={TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_step2_firewall')}
        </Text>
        <Text>
          {watch('firewall') === ServiceStatus.ACTIVE
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </Text>
        {watch('countriesIpEnabled') && (
          <>
            <Text className="text-right" preset={TEXT_PRESET.heading6}>
              {t('multisite:multisite_modal_domain_configuration_modify_countriesIp')}
            </Text>
            <Text>
              {(() => {
                const ipLocation = watch('ipLocation');
                if (!ipLocation) return '-';
                const countryIp = hosting?.countriesIp?.find((c) => c.country === ipLocation);
                return countryIp?.ip
                  ? `${t(`${NAMESPACES.COUNTRIES}:country_${ipLocation}`)} - ${countryIp.ip}`
                  : '-';
              })()}
            </Text>
          </>
        )}
        <Text className="text-right" preset={TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_ownlog')}
        </Text>
        <Text>
          {watch('ownLog')
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </Text>
      </div>
    </div>
  );
}
