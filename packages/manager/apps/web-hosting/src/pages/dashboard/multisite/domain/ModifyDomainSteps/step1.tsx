import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  ICON_NAME,
  Icon,
  Input,
  MESSAGE_COLOR,
  Message,
  Select,
  SelectContent,
  SelectControl,
  TOOLTIP_POSITION,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { HostingCountries } from '@/data/types/product/webHosting';
import { ServiceStatus } from '@/data/types/status';

import { Step1Props } from './types';

export default function Step1({
  control,
  isGitDisabled,
  watch,
  domainDetails,
  hosting,
  zones,
}: Step1Props) {
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ACTIONS, NAMESPACES.COUNTRIES]);

  const countryIpMap = new Map<string, HostingCountries>();
  const ipToCountryMap = new Map<string, HostingCountries>();
  hosting?.countriesIp?.forEach((countryIp) => {
    if (countryIp.ip) {
      const displayValue = `${t(`${NAMESPACES.COUNTRIES}:country_${countryIp.country}`)} - ${countryIp.ip}`;
      countryIpMap.set(displayValue, countryIp.country);
      ipToCountryMap.set(countryIp.ip, countryIp.country);
    }
  });

  return (
    <div className="flex flex-col space-y-4">
      <Text>{t('multisite:multisite_modal_domain_configuration_modify_step1_question')}</Text>
      <FormField>
        <label htmlFor="domain">{t('web_hosting_status_header_fqdn')}</label>
        <Controller
          name="domain"
          control={control}
          render={({ field }) => <Input {...field} disabled className="ml-2 w-2/3" />}
        />
      </FormField>
      <FormField>
        <label slot="label">
          {t('multisite:multisite_modal_domain_configuration_modify_step1_home')}
        </label>
        <div className="flex items-center">
          <Button variant={BUTTON_VARIANT.outline} size={BUTTON_SIZE.sm}>
            ./
          </Button>
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                placeholder={t('multisite:multisite_modal_domain_configuration_modify_myfolder')}
                className="ml-2 w-1/3"
              />
            )}
          />
        </div>
      </FormField>
      {!isGitDisabled && (
        <Message color={MESSAGE_COLOR.warning} dismissible={false}>
          {t('multisite:multisite_modal_domain_configuration_modify_git_warning')}
        </Message>
      )}
      <FormField>
        <label slot="label">
          {t('multisite:multisite_modal_domain_configuration_modify_options_choose')}
        </label>
        <Controller
          name="cdn"
          control={control}
          render={({ field }) => (
            <div className="mt-2 flex items-center">
              <Checkbox
                id="cdn-checkbox"
                name="cdn"
                checked={field.value === ServiceStatus.ACTIVE}
                disabled={!isGitDisabled || watch('countriesIpEnabled')}
                onCheckedChange={(detail) =>
                  field.onChange(detail.checked ? ServiceStatus.ACTIVE : ServiceStatus.INACTIVE)
                }
                onBlur={field.onBlur}
              >
                <CheckboxControl />
              </Checkbox>
              <Text className="ml-2">
                {t('multisite:multisite_modal_domain_configuration_modify_step1_cdn')}
              </Text>
              <Text id="cdn-tooltip">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon
                      name={ICON_NAME.circleQuestion}
                      className="color-disabled ml-4 cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('multisite:multisite_modal_domain_configuration_cdn_help')}
                  </TooltipContent>
                </Tooltip>
              </Text>
            </div>
          )}
        />
        <Controller
          name="firewall"
          control={control}
          render={({ field }) => (
            <div className="mt-2 flex items-center">
              <Checkbox
                id="firewall-checkbox"
                name="firewall"
                checked={field.value === ServiceStatus.ACTIVE}
                disabled={!isGitDisabled}
                onCheckedChange={(detail) =>
                  field.onChange(detail.checked ? ServiceStatus.ACTIVE : ServiceStatus.NONE)
                }
                onBlur={field.onBlur}
              >
                <CheckboxControl />
                <CheckboxLabel>
                  <Text>{t('multisite:multisite_modal_domain_configuration_modify_firewall')}</Text>
                </CheckboxLabel>
              </Checkbox>
              <Text id="firewall-tooltip">
                <Tooltip position={TOOLTIP_POSITION.right}>
                  <TooltipTrigger asChild>
                    <Icon
                      name={ICON_NAME.circleQuestion}
                      className="color-disabled ml-4 cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('multisite:multisite_modal_domain_configuration_modify_firewall_help')}
                  </TooltipContent>
                </Tooltip>
              </Text>
            </div>
          )}
        />
        <Controller
          name="countriesIpEnabled"
          control={control}
          render={({ field }) => (
            <div className="mt-2 flex flex-col">
              <div className="flex items-center">
                <Checkbox
                  id="countries-ip-checkbox"
                  name="countriesIpEnabled"
                  checked={field.value}
                  disabled={!isGitDisabled || watch('cdn') === ServiceStatus.ACTIVE}
                  onCheckedChange={(detail) => field.onChange(detail.checked)}
                  onBlur={field.onBlur}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text>
                      {t('multisite:multisite_modal_domain_configuration_modify_countriesIp')}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              </div>
              {field.value && (
                <Controller
                  name="ipLocation"
                  control={control}
                  render={({ field: ipField }) => {
                    const currentValue = ipField.value || domainDetails?.ipLocation;

                    const selectedCountryIp = hosting?.countriesIp?.find(
                      (c) => c.country === currentValue,
                    );

                    return (
                      <Select
                        key="ipLocation-select"
                        id="ipLocation-select"
                        name="ipLocation"
                        value={selectedCountryIp?.ip ? [selectedCountryIp.ip] : []}
                        disabled={!isGitDisabled}
                        onValueChange={(detail) => {
                          const selectedIp = Array.isArray(detail.value)
                            ? detail.value[0]
                            : detail.value;
                          const countryCode = ipToCountryMap.get(selectedIp);
                          ipField.onChange(countryCode);
                        }}
                        items={hosting?.countriesIp?.map((countryIp) => ({
                          label: `${t(`${NAMESPACES.COUNTRIES}:country_${countryIp.country}`)}`,
                          options: [
                            {
                              label: countryIp.ip,
                              value: countryIp.ip,
                            },
                          ],
                        }))}
                      >
                        <SelectControl />
                        <SelectContent createPortal={false} />
                      </Select>
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
            <div className="mt-2 flex flex-col">
              <div className="flex items-center">
                <Checkbox
                  id="own-log-checkbox"
                  name="enableOwnLog"
                  checked={!!field.value}
                  disabled={!isGitDisabled}
                  onCheckedChange={(detail) => field.onChange(detail.checked)}
                  onBlur={field.onBlur}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text>{t('multisite:multisite_modal_domain_configuration_modify_ownlog')}</Text>
                  </CheckboxLabel>
                </Checkbox>
              </div>
              {field.value && (
                <Controller
                  name="ownLog"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key="ownLog-select"
                      id="ownLog-select"
                      name="ownLog"
                      value={[field.value]}
                      items={zones.map((zone) => ({
                        label: zone,
                        value: zone,
                      }))}
                      onValueChange={(detail: { value?: string[] }) => {
                        const selectedValue = Array.isArray(detail.value) ? detail.value[0] : '';
                        field.onChange(selectedValue);
                      }}
                      disabled={!isGitDisabled}
                      className="mt-2"
                    >
                      <SelectControl />
                      <SelectContent createPortal={false} />
                    </Select>
                  )}
                />
              )}
            </div>
          )}
        />
      </FormField>
    </div>
  );
}
