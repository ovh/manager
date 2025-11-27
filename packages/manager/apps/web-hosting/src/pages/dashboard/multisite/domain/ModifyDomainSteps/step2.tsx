import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { Step2Props } from './types';

export default function Step2({ watch, hosting }: Step2Props) {
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ACTIONS, NAMESPACES.COUNTRIES]);

  return (
    <div className="flex flex-col items-center space-y-3">
      <OdsText className="text-center">
        {t('multisite:multisite_modal_domain_configuration_modify_step2_summary')}
      </OdsText>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm w-3/4">
        <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
          {t('web_hosting_status_header_fqdn')}
        </OdsText>
        <OdsText>{watch('domain')}</OdsText>
        <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_myfolder')}
        </OdsText>
        <OdsText>{watch('path')}</OdsText>
        <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_step2_cdn')}
        </OdsText>
        <OdsText>
          {watch('cdn')
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </OdsText>
        <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_step2_ssl')}
        </OdsText>
        <OdsText>
          {hosting?.hasHostedSsl
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </OdsText>
        <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_step2_firewall')}
        </OdsText>
        <OdsText>
          {watch('firewall')
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </OdsText>
        {watch('countriesIpEnabled') && (
          <>
            <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
              {t('multisite:multisite_modal_domain_configuration_modify_countriesIp')}
            </OdsText>
            <OdsText>
              {watch('ipLocation')
                ? `${t(`${NAMESPACES.COUNTRIES}:country_${watch('ipLocation')}`)} - ${hosting?.countriesIp?.find((c) => c.country === watch('ipLocation'))?.ip}`
                : '-'}
            </OdsText>
          </>
        )}
        <OdsText className="text-right" preset={ODS_TEXT_PRESET.heading6}>
          {t('multisite:multisite_modal_domain_configuration_modify_ownlog')}
        </OdsText>
        <OdsText>
          {watch('ownLog')
            ? t('common:web_hosting_status_active')
            : t('common:web_hosting_status_none')}
        </OdsText>
      </div>
    </div>
  );
}
