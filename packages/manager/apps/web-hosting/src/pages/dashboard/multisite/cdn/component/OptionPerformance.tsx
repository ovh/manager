import React, { useContext } from 'react';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsInput, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';

import { IconLinkAlignmentType, Links } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { SHARED_CDN_OPTIONS } from '@/constants';
import { CdnFormValues, CdnOption, CdnOptionType } from '@/data/types/product/cdn';
import { hasOption } from '@/utils/cdn';

import { ToggleCard } from './CdnToogleCard';

interface OptionPerformanceProps {
  controlValues: CdnFormValues;
  control: Control<CdnFormValues, unknown, CdnFormValues>;
  optionsData: CdnOption[];
}

export const OptionPerformance: React.FC<OptionPerformanceProps> = ({
  controlValues,
  control,
  optionsData,
}) => {
  const { t } = useTranslation(['dashboard']);
  const context = useContext(ShellContext);

  const { ovhSubsidiary } = context.environment.getUser();

  const sharedOptionUrl =
    SHARED_CDN_OPTIONS.PREFETCH.LINKS[
      ovhSubsidiary as keyof typeof SHARED_CDN_OPTIONS.PREFETCH.LINKS
    ] ?? SHARED_CDN_OPTIONS.PREFETCH.LINKS.DEFAULT;

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('cdn_shared_option_category_performance')}
      </OdsText>
      <ToggleCard
        title={t('cdn_shared_option_always_online_title')}
        info={t('cdn_shared_option_always_online_info')}
        isDisabled={true}
        toggleValue={true}
      />
      <ToggleCard
        title={t('cdn_shared_option_http_https_title')}
        info={t('cdn_shared_option_http_https_info')}
        isDisabled={true}
        toggleValue={true}
      />
      {hasOption(optionsData, CdnOptionType.BROTLI) && (
        <Controller
          name="brotli"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_brotli_title')}
              info={t('cdn_shared_option_brotli_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            />
          )}
        />
      )}
      {hasOption(optionsData, CdnOptionType.GEO_HEADERS) && (
        <Controller
          name="geoHeaders"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_http_geolocation_title')}
              info={t('cdn_shared_option_http_geolocation_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            />
          )}
        />
      )}
      {hasOption(optionsData, CdnOptionType.PREFETCH) && (
        <Controller
          name="prefetch"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_prefetch_title')}
              info={t('cdn_shared_option_prefetch_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            >
              <Links
                label={t('cdn_shared_option_prefetch_info_link')}
                href={sharedOptionUrl}
                target="_blank"
                iconAlignment={IconLinkAlignmentType.right}
              />
            </ToggleCard>
          )}
        />
      )}
      {hasOption(optionsData, CdnOptionType.MOBILE_REDIRECT) && (
        <Controller
          name="mobileRedirect"
          control={control}
          render={({ field }) => (
            <ToggleCard
              title={t('cdn_shared_option_mobile_redirect_title')}
              info={t('cdn_shared_option_mobile_redirect_info')}
              toggleValue={!!field.value}
              onToggle={field.onChange}
            />
          )}
        />
      )}
      {controlValues?.mobileRedirect && (
        <>
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
                <option key="redirect_still" value={SHARED_CDN_OPTIONS.MOBILE_REDIRECT.STILL_URL}>
                  {t('cdn_shared_option_mobile_redirect_strategy_still')}
                </option>
                <option key="redirect_keep" value={SHARED_CDN_OPTIONS.MOBILE_REDIRECT.KEEP_URL}>
                  {t('cdn_shared_option_mobile_redirect_strategy_keep')}
                </option>
              </OdsSelect>
            )}
          />
          <Controller
            name="mobileRedirectUrl"
            control={control}
            render={({ field }) => (
              <OdsInput
                name="mobileRedirectUrl"
                className="w-2/6"
                type="text"
                value={field.value}
                onOdsChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </>
      )}
    </>
  );
};
