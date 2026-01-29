import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  FormField,
  ProgressBar,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

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
      <Text preset={TEXT_PRESET.heading3}>{t('cdn_shared_option_category_cache')}</Text>
      {hasOption(optionsData, CdnOptionType.DEVMODE) && (
        <Controller
          name="devmode"
          control={control}
          render={({ field }) => (
            <ToggleCard
              name={field.name}
              title={t('cdn_shared_option_dev_mode_title')}
              info={t('cdn_shared_option_dev_mode_info')}
              toggleValue={!!field.value}
              onToggle={(detail) => field.onChange(detail.checked)}
            />
          )}
        />
      )}
      <div className=" flex flex-col space-y-5">
        <Text preset={TEXT_PRESET.heading4}>{t('cdn_shared_option_advanced_flush_title')}</Text>
        <Text>
          {t(
            `cdn_shared_option_advanced_flush_info${
              advancedPurge ? '' : '_for_basic_and_security'
            }`,
          )}
        </Text>
        <FormField className="flex space-x-4">
          <Toggle
            id="advanced-flush-toggle"
            key="advanced-flush-toggle-false"
            checked={false}
            name="advanced-flush"
            onCheckedChange={() => {
              navigate(
                urls.advancedFlushCdn
                  .replace(subRoutes.serviceName, serviceName)
                  .replace(subRoutes.domain, domain),
              );
            }}
          >
            <ToggleControl />
            <ToggleLabel>
              <Text>{t(`${NAMESPACES.SERVICE}:service_state_disabled`)}</Text>
            </ToggleLabel>
          </Toggle>
        </FormField>
      </div>
      {hasOption(optionsData, CdnOptionType.QUERYSTRING) && (
        <Controller
          name="querystring"
          control={control}
          render={({ field }) => (
            <ToggleCard
              name={field.name}
              title={t('cdn_shared_option_query_string_title')}
              info={t('cdn_shared_option_query_string_info')}
              toggleValue={!!field.value}
              onToggle={(detail) => field.onChange(detail.checked)}
            >
              <div className="ml-6 flex flex-col">
                <Text>{t('cdn_shared_option_query_string_sort_ignored')}</Text>
                <Text>{t('cdn_shared_option_query_string_sort_true')}</Text>
                <Text>{t('cdn_shared_option_query_string_sort_false')}</Text>
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
            <Select
              className="w-2/6"
              name="mobileRedirectType"
              value={field.value ? [field.value] : []}
              onValueChange={(detail) => field.onChange(detail.value)}
              items={[
                {
                  label: t('cdn_shared_option_query_string_list_sorted'),
                  value: CdnQueryParameters.SORTED,
                },
                {
                  label: t('cdn_shared_option_query_string_list_ignored'),
                  value: CdnQueryParameters.IGNORED,
                },
              ]}
            >
              <SelectControl aria-label={t('cdn_shared_option_query_string_title')} />
              <SelectContent />
            </Select>
          )}
        />
      )}
      {controlValues?.prewarm && (
        <>
          <Text preset={TEXT_PRESET.heading6}>{t('cdn_shared_option_prewarm_quota')}</Text>
          <Text>{getQuotaUsage(optionsData)}</Text>
          <ProgressBar className="w-80" value={getPrewarmQuotaPercentage(optionsData)} />
          <Button
            variant={BUTTON_VARIANT.default}
            color={BUTTON_COLOR.primary}
            onClick={() =>
              navigate(
                urls.cdnEditUrls
                  .replace(subRoutes.serviceName, serviceName)
                  .replace(subRoutes.domain, domain),
              )
            }
          >
            {t('cdn_shared_option_prewarm_btn_edit_urls')}
          </Button>
        </>
      )}
    </>
  );
};
