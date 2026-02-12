import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  Input,
  MESSAGE_COLOR,
  Message,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

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
      <Text preset={TEXT_PRESET.heading3}>{t('cdn_shared_option_category_security')}</Text>

      <Controller
        name="cors"
        control={control}
        render={({ field }) => (
          <ToggleCard
            name={field.name}
            title="Cross-Origin Resource Sharing (CORS)"
            info={t('cdn_shared_option_cors_description')}
            toggleValue={field.value}
            onToggle={(detail) => field.onChange(detail.checked)}
          />
        )}
      />
      {controlValues?.cors && (
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.primary}
          onClick={() =>
            navigate(
              urls.cdnCorsResourceSharing
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain),
            )
          }
        >
          {t('cdn_shared_option_cors_edit')}
        </Button>
      )}
      <Controller
        name="httpsRedirect"
        control={control}
        render={({ field }) => (
          <ToggleCard
            name={field.name}
            title="HTTPS-Redirect"
            info={t('cdn_shared_option_https_redirect_description')}
            toggleValue={!!field.value}
            onToggle={(detail) => field.onChange(detail.checked)}
          >
            {field.value && (
              <Message color={MESSAGE_COLOR.warning} dismissible={false} className="w-full">
                {t('cdn_ssl_required_warning')}
              </Message>
            )}
          </ToggleCard>
        )}
      />
      {controlValues?.httpsRedirect && (
        <Controller
          name="httpsRedirectCode"
          control={control}
          render={({ field }) => (
            <Select
              className="w-2/6"
              id="httpsRedirectCode"
              data-testid="httpsRedirectCode"
              name="httpsRedirectCode"
              value={field.value ? [field.value.toString()] : []}
              onValueChange={(detail) => field.onChange(detail.value[0])}
              items={[
                {
                  label: t('cdn_shared_option_https_redirect_301'),
                  value: '301',
                },
                {
                  label: t('cdn_shared_option_https_redirect_302'),
                  value: '302',
                },
              ]}
            >
              <SelectControl aria-label={t('cdn_shared_option_https_redirect_301')} />
              <SelectContent />
            </Select>
          )}
        />
      )}
      <Controller
        name="hsts"
        control={control}
        render={({ field }) => (
          <ToggleCard
            name={field.name}
            title="HTTP Strict Transport Security (HSTS)"
            info={t('cdn_shared_option_hsts_description')}
            toggleValue={!!field.value}
            onToggle={(detail) => field.onChange(detail.checked)}
          >
            {field.value && (
              <Message color={MESSAGE_COLOR.warning} dismissible={false} className="w-full">
                {t('cdn_ssl_required_warning')}
              </Message>
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
                <Input
                  name="hstsAge"
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="hstUnit"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-1/12"
                  name="hstUnit"
                  id="hstUnit"
                  data-testid="hstUnit"
                  value={field.value ? [field.value.toString()] : []}
                  onValueChange={(detail) => field.onChange(detail.value[0])}
                  items={[
                    {
                      label: t('cdn_shared_option_hsts_max_age_seconds'),
                      value: SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND.toString(),
                    },
                    {
                      label: t('cdn_shared_option_hsts_max_age_days'),
                      value: SHARED_CDN_SETTINGS_RULE_FACTOR_DAY.toString(),
                    },
                    {
                      label: t('cdn_shared_option_hsts_max_age_months'),
                      value: SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH.toString(),
                    },
                  ]}
                >
                  <SelectControl aria-label={t('cdn_shared_option_hsts_max_age_seconds')} />
                  <SelectContent />
                </Select>
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
            name={field.name}
            title="Mixed-Content"
            info={t('cdn_shared_option_mixed_content_description')}
            toggleValue={!!field.value}
            onToggle={(detail) => field.onChange(detail.checked)}
          />
        )}
      />
      <Controller
        name="waf"
        control={control}
        render={({ field }) => (
          <ToggleCard
            name={field.name}
            title="Web Application Firewall (WAF)"
            info={t('cdn_shared_option_waf_description')}
            toggleValue={!!field.value}
            onToggle={(detail) => field.onChange(detail.checked)}
          />
        )}
      />
    </div>
  );
};
