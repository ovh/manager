import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { SHARED_CDN_OPTIONS } from '@/constants';
import { useUpdateCdnOptions } from '@/data/hooks/cdn/useCdn';
import { CdnFormValues, CdnOption, CdnOptionType } from '@/data/types/product/cdn';
import { subRoutes, urls } from '@/routes/routes.constants';

type LocationState = {
  formData?: CdnFormValues;
  optionsData?: CdnOption[];
};

export default function CdnConfirmationModal() {
  const { serviceName, domain } = useParams();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const optionsData = state?.optionsData;
  const modifiedOption = state?.formData;
  const { updateCdnOptions } = useUpdateCdnOptions(serviceName, domain);

  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS, NAMESPACES.SERVICE]);
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  const updateOption = (option: CdnOption): CdnOption => {
    switch (option?.type) {
      case CdnOptionType.CORS:
        return {
          config: {
            resources: modifiedOption?.corsResources,
            ...option?.config,
          },
          ...option,
        };
      case CdnOptionType.PREWARM:
        return {
          config: {
            resources: modifiedOption?.corsResources,
            ...option?.config,
          },
          ...option,
        };
      case CdnOptionType.MOBILE_REDIRECT: {
        const followUri =
          modifiedOption?.mobileRedirectType === SHARED_CDN_OPTIONS.MOBILE_REDIRECT.STILL_URL;
        return {
          config: {
            followUri,
            destination: followUri
              ? option?.config?.destination
              : modifiedOption?.mobileRedirectUrl,
          },
          ...option,
        };
      }
      case CdnOptionType.QUERYSTRING:
        return {
          config: {
            queryParameters: modifiedOption?.querytringParam,
            ...option?.config,
          },
          ...option,
        };
      case CdnOptionType.HSTS:
        return {
          config: {
            ttl: modifiedOption?.hstsAge * modifiedOption?.hstUnit,
            ...option?.config,
          },
          ...option,
        };
      default:
        return option;
    }
  };

  const onConfirm = () => {
    const cdnOptions: CdnOption[] = [];
    Object.entries(modifiedOption).forEach(([key, value]) => {
      const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      if (typeof value === 'boolean') {
        const current = optionsData?.find((item) => item?.name === snakeKey);
        if (current && current?.enabled !== value) {
          const updatedOption = updateOption({ ...current, enabled: value });
          cdnOptions.push(updatedOption);
        }
      }
    });
    updateCdnOptions({ cdnOptions });
    navigate(urls.multisite.replace(subRoutes.serviceName, serviceName));
  };

  return (
    <Modal
      heading={t('cdn_shared_modal_confirm_title')}
      onDismiss={onClose}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      onPrimaryButtonClick={onConfirm}
    >
      <div className="flex flex-col space-y-2">
        <OdsText>{t('cdn_shared_modal_confirm_info')}</OdsText>

        <OdsText className="pt-5">{t('cdn_shared_modal_confirm_perf')}</OdsText>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_always_online_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_http_https_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_brotli_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.brotli && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_http_geolocation_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.geoHeaders && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_prefetch_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.prefetch && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_mobile_redirect_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.mobileRedirect && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>

        <OdsText className="pt-5">{t('cdn_shared_modal_confirm_cache')}</OdsText>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_dev_mode_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.devmode && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_query_string_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.querystring && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            {t('cdn_shared_option_prewarm_title')}
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.prewarm && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>

        <OdsText className="pt-5">{t('cdn_shared_modal_confirm_security')}</OdsText>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            Cross-Origin Resource Sharing (CORS)
          </OdsText>
          <OdsText className="w-1/3 text-right">{modifiedOption?.cors}</OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            HTTPS-Redirect
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.httpsRedirect && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            HTTP Strict Transport Security (HSTS)
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.hsts && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            Mixed-Content
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.mixedContent && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-2/3">
            Web Application Firewall (WAF)
          </OdsText>
          <OdsText className="w-1/3 text-right">
            {modifiedOption?.waf && t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
          </OdsText>
        </div>
      </div>
    </Modal>
  );
}
