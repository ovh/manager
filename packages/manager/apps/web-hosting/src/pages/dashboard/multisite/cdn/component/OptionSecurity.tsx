import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsInput,
  OdsMessage,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { CdnFormValues, CdnOption } from '@/data/types/product/cdn';
import { subRoutes, urls } from '@/routes/routes.constants';
import {
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
  SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
} from '@/utils';
import { hasSecurityOption } from '@/utils/cdn';

import { ToggleCard } from './CdnToogleCard';

interface OptionSecurityProps {
  controlValues: CdnFormValues;
  control: Control<CdnFormValues, unknown, CdnFormValues>;
  optionsData: CdnOption[];
}

export const OptionSecurity: React.FC<OptionSecurityProps> = ({
  controlValues,
  control,
  optionsData,
}) => {
  const { t } = useTranslation(['dashboard']);
  const { serviceName, domain } = useParams();
  const navigate = useNavigate();

  if (!hasSecurityOption(optionsData)) return null;
  return (
    <div className="flex flex-col space-y-6">
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('cdn_shared_option_category_security')}
      </OdsText>

      <Controller
        name="cors"
        control={control}
        render={({ field }) => (
          <ToggleCard
            title="Cross-Origin Resource Sharing (CORS)"
            info={t('cdn_shared_option_cors_description')}
            toggleValue={field.value}
            onToggle={field.onChange}
          />
        )}
      />
      {controlValues?.cors && (
        <OdsButton
          label={t('cdn_shared_option_cors_edit')}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.primary}
          onClick={() =>
            navigate(
              urls.cdnCorsResourceSharing
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain),
            )
          }
        />
      )}
      <Controller
        name="httpsRedirect"
        control={control}
        render={({ field }) => (
          <ToggleCard
            title="HTTPS-Redirect"
            info={t('cdn_shared_option_https_redirect_description')}
            toggleValue={!!field.value}
            onToggle={field.onChange}
          >
            {field.value && (
              <OdsMessage
                color={ODS_MESSAGE_COLOR.warning}
                isDismissible={false}
                className="w-full"
              >
                {t('cdn_ssl_required_warning')}
              </OdsMessage>
            )}
          </ToggleCard>
        )}
      />
      {controlValues?.httpsRedirect && (
        <Controller
          name="httpsRedirectCode"
          control={control}
          render={({ field }) => (
            <OdsSelect
              className="w-2/6"
              name="httpsRedirectCode"
              value={field.value?.toString()}
              onOdsChange={(e) => field.onChange(e.target.value)}
            >
              <option key="redirect_301" value={301}>
                {t('cdn_shared_option_https_redirect_301')}
              </option>
              <option key="redirect_302" value={302}>
                {t('cdn_shared_option_https_redirect_302')}
              </option>
            </OdsSelect>
          )}
        />
      )}
      <Controller
        name="hsts"
        control={control}
        render={({ field }) => (
          <ToggleCard
            title="HTTP Strict Transport Security (HSTS)"
            info={t('cdn_shared_option_hsts_description')}
            toggleValue={!!field.value}
            onToggle={field.onChange}
          >
            {field.value && (
              <OdsMessage
                color={ODS_MESSAGE_COLOR.warning}
                isDismissible={false}
                className="w-full"
              >
                {t('cdn_ssl_required_warning')}
              </OdsMessage>
            )}
          </ToggleCard>
        )}
      />
      {controlValues?.hsts && (
        <>
          <div className="flex flex-row">
            <Controller
              name="hstsAge"
              control={control}
              render={({ field }) => (
                <OdsInput
                  name="hstsAge"
                  type="number"
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="hstUnit"
              control={control}
              render={({ field }) => (
                <OdsSelect
                  className="w-1/12"
                  name="hstUnit"
                  value={field.value?.toString()}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                >
                  <option key="max_age_seconds" value={SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND}>
                    {t('cdn_shared_option_hsts_max_age_seconds')}
                  </option>
                  <option key="max_age_days" value={SHARED_CDN_SETTINGS_RULE_FACTOR_DAY}>
                    {t('cdn_shared_option_hsts_max_age_days')}
                  </option>
                  <option key="max_age_months" value={SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH}>
                    {t('cdn_shared_option_hsts_max_age_months')}
                  </option>
                </OdsSelect>
              )}
            />
          </div>
        </>
      )}
      <Controller
        name="mixedContent"
        control={control}
        render={({ field }) => (
          <ToggleCard
            title="Mixed-Content"
            info={t('cdn_shared_option_mixed_content_description')}
            toggleValue={!!field.value}
            onToggle={field.onChange}
          />
        )}
      />
      <Controller
        name="waf"
        control={control}
        render={({ field }) => (
          <ToggleCard
            title="Web Application Firewall (WAF)"
            info={t('cdn_shared_option_waf_description')}
            toggleValue={!!field.value}
            onToggle={field.onChange}
          />
        )}
      />
    </div>
  );
};
