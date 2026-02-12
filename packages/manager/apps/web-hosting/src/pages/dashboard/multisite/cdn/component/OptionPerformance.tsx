import React, { useContext } from 'react';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Input,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType } from '@ovh-ux/muk';

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
      <Text preset={TEXT_PRESET.heading3}>{t('cdn_shared_option_category_performance')}</Text>
      <ToggleCard
        title={t('cdn_shared_option_always_online_title')}
        info={t('cdn_shared_option_always_online_info')}
        disabled={true}
        toggleValue={true}
      />
      <ToggleCard
        title={t('cdn_shared_option_http_https_title')}
        info={t('cdn_shared_option_http_https_info')}
        disabled={true}
        toggleValue={true}
      />
      {hasOption(optionsData, CdnOptionType.BROTLI) && (
        <Controller
          name="brotli"
          control={control}
          render={({ field }) => (
            <ToggleCard
              name={field.name}
              title={t('cdn_shared_option_brotli_title')}
              info={t('cdn_shared_option_brotli_info')}
              toggleValue={!!field.value}
              onToggle={(detail) => field.onChange(detail.checked)}
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
              name={field.name}
              title={t('cdn_shared_option_http_geolocation_title')}
              info={t('cdn_shared_option_http_geolocation_info')}
              toggleValue={!!field.value}
              onToggle={(detail) => field.onChange(detail.checked)}
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
              name={field.name}
              title={t('cdn_shared_option_prefetch_title')}
              info={t('cdn_shared_option_prefetch_info')}
              toggleValue={!!field.value}
              onToggle={(detail) => field.onChange(detail.checked)}
            >
              <Link href={sharedOptionUrl} target="_blank" type={LinkType.external}>
                {t('cdn_shared_option_prefetch_info_link')}
              </Link>
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
              name={field.name}
              title={t('cdn_shared_option_mobile_redirect_title')}
              info={t('cdn_shared_option_mobile_redirect_info')}
              toggleValue={!!field.value}
              onToggle={(detail) => field.onChange(detail.checked)}
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
              <Select
                className="w-2/6"
                name="mobileRedirectType"
                value={field.value ? [field.value] : []}
                onValueChange={(detail) => field.onChange(detail.value[0])}
                items={[
                  {
                    label: t('cdn_shared_option_mobile_redirect_strategy_still'),
                    value: SHARED_CDN_OPTIONS.MOBILE_REDIRECT.STILL_URL,
                  },
                  {
                    label: t('cdn_shared_option_mobile_redirect_strategy_keep'),
                    value: SHARED_CDN_OPTIONS.MOBILE_REDIRECT.KEEP_URL,
                  },
                ]}
              >
                <SelectControl aria-label={t('cdn_shared_option_mobile_redirect_strategy_still')} />
                <SelectContent />
              </Select>
            )}
          />
          <Controller
            name="mobileRedirectUrl"
            control={control}
            render={({ field }) => (
              <Input
                name="mobileRedirectUrl"
                className="w-2/6"
                type="text"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </>
      )}
    </>
  );
};
