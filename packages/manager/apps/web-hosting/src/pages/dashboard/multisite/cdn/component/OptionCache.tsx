import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsProgressBar,
  OdsSelect,
  OdsText,
  OdsToggle,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import {
  CdnFormValues,
  CdnOption,
  CdnOptionType,
  CdnQueryParameters,
} from '@/data/types/product/cdn';
import { subRoutes, urls } from '@/routes/routes.constants';
import { getPrewarmQuotaPercentage, getQuotaUsage, hasOption } from '@/utils/cdn';

import { ToggleCard } from './CdnToogleCard';

interface OptionCacheProps {
  controlValues: CdnFormValues;
  control: Control<CdnFormValues, unknown, CdnFormValues>;
  optionsData: CdnOption[];
  advancedPurge: boolean;
}

export const OptionCache: React.FC<OptionCacheProps> = ({
  controlValues,
  control,
  optionsData,
  advancedPurge,
}) => {
  const { t } = useTranslation(['dashboard']);
  const { serviceName, domain } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading3}>{t('cdn_shared_option_category_cache')}</OdsText>
      {hasOption(optionsData, CdnOptionType.DEVMODE) && (
        <Controller
          name="devmode"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_dev_mode_title')}
              info={t('cdn_shared_option_dev_mode_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            />
          )}
        />
      )}
      <div className=" flex flex-col space-y-5">
        <OdsText preset={ODS_TEXT_PRESET.heading4}>
          {t('cdn_shared_option_advanced_flush_title')}
        </OdsText>
        <OdsText>
          {t(
            `cdn_shared_option_advanced_flush_info${
              advancedPurge ? '' : '_for_basic_and_security'
            }`,
          )}
        </OdsText>
        <OdsFormField className="flex space-x-4">
          <OdsToggle
            key="advanced-flush-toggle"
            defaultChecked={false}
            name="advanced-flush"
            onClick={() => {
              navigate(
                urls.advancedFlushCdn
                  .replace(subRoutes.serviceName, serviceName)
                  .replace(subRoutes.domain, domain),
              );
            }}
          />
          <OdsText>{t(`${NAMESPACES.SERVICE}:service_state_disabled`)}</OdsText>
        </OdsFormField>
      </div>
      {hasOption(optionsData, CdnOptionType.QUERYSTRING) && (
        <Controller
          name="querystring"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_query_string_title')}
              info={t('cdn_shared_option_query_string_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            >
              <div className="flex flex-col ml-6">
                <OdsText>{t('cdn_shared_option_query_string_sort_ignored')}</OdsText>
                <OdsText>{t('cdn_shared_option_query_string_sort_true')}</OdsText>
                <OdsText>{t('cdn_shared_option_query_string_sort_false')}</OdsText>
              </div>
            </ToggleCard>
          )}
        />
      )}
      {controlValues?.querystring && (
        <Controller
          name="mobileRedirectType"
          control={control}
          render={({ field }) => (
            <OdsSelect
              className="w-2/6"
              name="mobileRedirectType"
              value={field.value}
              onOdsChange={(e) => field.onChange(e.target.value)}
            >
              <option key="list_sorted" value={CdnQueryParameters.SORTED}>
                {t('cdn_shared_option_query_string_list_sorted')}
              </option>
              <option key="list_ignored" value={CdnQueryParameters.IGNORED}>
                {t('cdn_shared_option_query_string_list_ignored')}
              </option>
            </OdsSelect>
          )}
        />
      )}
      {hasOption(optionsData, CdnOptionType.PREWARM) && (
        <Controller
          name="prewarm"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_prewarm_title')}
              info={t('cdn_shared_option_prewarm_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            />
          )}
        />
      )}
      {controlValues?.prewarm && (
        <>
          <OdsText preset={ODS_TEXT_PRESET.heading6}>
            {t('cdn_shared_option_prewarm_quota')}
          </OdsText>
          <OdsText>{getQuotaUsage(optionsData)}</OdsText>
          <OdsProgressBar className="w-80" value={getPrewarmQuotaPercentage(optionsData)} />
          <OdsButton
            label={t('cdn_shared_option_prewarm_btn_edit_urls')}
            variant={ODS_BUTTON_VARIANT.default}
            color={ODS_BUTTON_COLOR.primary}
            onClick={() =>
              navigate(
                urls.cdnEditUrls
                  .replace(subRoutes.serviceName, serviceName)
                  .replace(subRoutes.domain, domain),
              )
            }
          />
        </>
      )}
    </>
  );
};
