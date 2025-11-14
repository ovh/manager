import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
  ODS_SELECT_STRATEGY,
  ODS_TOOLTIP_POSITION,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsMessage,
  OdsSelect,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { HostingCountries } from '@/data/types/product/webHosting';
import { ServiceStatus } from '@/data/types/status';

import { Step1Props } from './types';

export default function Step1({
  control,
  isGitDisabled,
  isCdnAvailable,
  hosting,
  zones,
}: Step1Props) {
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ACTIONS, NAMESPACES.COUNTRIES]);

  const countryIpMap = new Map<string, HostingCountries>();
  hosting?.countriesIp?.forEach((countryIp) => {
    if (countryIp.ip) {
      const displayValue = `${t(`${NAMESPACES.COUNTRIES}:country_${countryIp.country}`)} - ${countryIp.ip}`;
      countryIpMap.set(displayValue, countryIp.country);
    }
  });

  return (
    <div className="flex flex-col space-y-4">
      <OdsText>{t('multisite:multisite_modal_domain_configuration_modify_step1_question')}</OdsText>
      <OdsFormField>
        <label slot="label">{t('web_hosting_status_header_fqdn')}</label>
        <Controller
          name="domain"
          control={control}
          render={({ field }) => <OdsInput {...field} isDisabled className="w-2/3 ml-2" />}
        />
      </OdsFormField>
      <OdsFormField>
        <label slot="label">
          {t('multisite:multisite_modal_domain_configuration_modify_step1_home')}
        </label>
        <div className="flex items-center">
          <OdsButton label="./" variant={ODS_BUTTON_VARIANT.outline} size={ODS_BUTTON_SIZE.sm} />
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <OdsInput
                {...field}
                isDisabled
                placeholder={t('multisite:multisite_modal_domain_configuration_modify_myfolder')}
                className="w-1/3 ml-2"
              />
            )}
          />
        </div>
      </OdsFormField>
      {!isGitDisabled && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          {t('multisite:multisite_modal_domain_configuration_modify_git_warning')}
        </OdsMessage>
      )}
      <OdsFormField>
        <label slot="label">
          {t('multisite:multisite_modal_domain_configuration_modify_options_choose')}
        </label>
        {isCdnAvailable && (
          <Controller
            name="cdn"
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-2">
                <OdsCheckbox
                  name="cdn"
                  isChecked={field.value === ServiceStatus.ACTIVE}
                  isDisabled={!isGitDisabled}
                  onOdsChange={(e) =>
                    field.onChange(e.detail.checked ? ServiceStatus.ACTIVE : ServiceStatus.INACTIVE)
                  }
                />
                <OdsText className="ml-2">
                  {t('multisite:multisite_modal_domain_configuration_modify_step1_cdn')}
                </OdsText>
                <OdsText id="cdn-tooltip">
                  <OdsIcon
                    name={ODS_ICON_NAME.circleQuestion}
                    className="color-disabled cursor-pointer ml-4"
                  />
                  <OdsTooltip triggerId="cdn-tooltip" strategy={ODS_SELECT_STRATEGY.fixed}>
                    {t('multisite:multisite_modal_domain_configuration_cdn_help')}
                  </OdsTooltip>
                </OdsText>
              </div>
            )}
          />
        )}
        <Controller
          name="firewall"
          control={control}
          render={({ field }) => (
            <div className="flex items-center mt-2">
              <OdsCheckbox
                name="firewall"
                isChecked={field.value === ServiceStatus.ACTIVE}
                isDisabled={!isGitDisabled}
                onOdsChange={(e) =>
                  field.onChange(e.detail.checked ? ServiceStatus.ACTIVE : ServiceStatus.NONE)
                }
              />
              <OdsText className="ml-2">
                {t('multisite:multisite_modal_domain_configuration_modify_firewall')}
              </OdsText>
              <OdsText id="firewall-tooltip">
                <OdsIcon
                  name={ODS_ICON_NAME.circleQuestion}
                  className="color-disabled cursor-pointer ml-4"
                />
                <OdsTooltip
                  triggerId="firewall-tooltip"
                  position={ODS_TOOLTIP_POSITION.right}
                  strategy={ODS_SELECT_STRATEGY.fixed}
                >
                  {t('multisite:multisite_modal_domain_configuration_modify_firewall_help')}
                </OdsTooltip>
              </OdsText>
            </div>
          )}
        />
        <Controller
          name="countriesIpEnabled"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col mt-2">
              <div className="flex items-center">
                <OdsCheckbox
                  name="countriesIpEnabled"
                  isChecked={field.value}
                  isDisabled={!isGitDisabled}
                  onOdsChange={(e) => field.onChange(e.detail.checked)}
                />
                <OdsText className="ml-2">
                  {t('multisite:multisite_modal_domain_configuration_modify_countriesIp')}
                </OdsText>
              </div>
              {field.value && (
                <Controller
                  name="ipLocation"
                  control={control}
                  render={({ field }) => {
                    const currentDisplayValue =
                      [...countryIpMap.entries()].find((entry) => entry[1] === field.value)?.[0] ??
                      '';

                    return (
                      <OdsSelect
                        name="ipLocation"
                        value={currentDisplayValue}
                        isDisabled={!isGitDisabled}
                        onOdsChange={(e: CustomEvent<{ value: string }>) => {
                          const selectedDisplayValue = e.detail.value;
                          const countryCode = countryIpMap.get(selectedDisplayValue);
                          field.onChange(countryCode);
                        }}
                        className="mt-2"
                      >
                        {hosting?.countriesIp?.map((countryIp) => (
                          <optgroup
                            key={countryIp.country}
                            label={t(`${NAMESPACES.COUNTRIES}:country_${countryIp.country}`)}
                          >
                            {countryIp.ip && (
                              <option
                                value={`${t(`${NAMESPACES.COUNTRIES}:country_${countryIp.country}`)} - ${countryIp.ip}`}
                              >
                                {countryIp.ip}
                              </option>
                            )}
                          </optgroup>
                        ))}
                      </OdsSelect>
                    );
                  }}
                />
              )}
            </div>
          )}
        />
        <Controller
          name="enableOwnLog"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col mt-2">
              <div className="flex items-center">
                <OdsCheckbox
                  name="ownLog"
                  isChecked={!!field.value}
                  isDisabled={!isGitDisabled}
                  onOdsChange={(e) => field.onChange(e.detail.checked)}
                />
                <OdsText className="ml-2">
                  {t('multisite:multisite_modal_domain_configuration_modify_ownlog')}
                </OdsText>
              </div>
              {field.value && (
                <Controller
                  name="ownLog"
                  control={control}
                  render={({ field }) => (
                    <OdsSelect
                      name="ownLog"
                      onOdsChange={(e) => field.onChange(e.detail.value)}
                      isDisabled={!isGitDisabled}
                      className="mt-2"
                    >
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </OdsSelect>
                  )}
                />
              )}
            </div>
          )}
        />
      </OdsFormField>
    </div>
  );
}
