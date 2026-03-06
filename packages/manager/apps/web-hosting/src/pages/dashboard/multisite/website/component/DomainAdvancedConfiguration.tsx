import { useParams } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BADGE_SIZE,
  CARD_COLOR,
  Card,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Divider,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Badge } from '@ovh-ux/muk';

import { useGetHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { WebsiteFormData } from '@/utils/formSchemas.utils';

import { DomainManagement } from './DomainManagement';
import { PathField } from './fields/Pathfield';

interface DomainAdvancedConfigurationProps {
  control: Control<WebsiteFormData, unknown, WebsiteFormData>;
  controlValues: WebsiteFormData;
  isAddingDomain?: boolean;
}

export const DomainAdvancedConfiguration: React.FC<DomainAdvancedConfigurationProps> = ({
  control,
  controlValues,
  isAddingDomain = false,
}: DomainAdvancedConfigurationProps) => {
  const { serviceName } = useParams();

  const { t } = useTranslation(['multisite', 'dashboard', NAMESPACES.COUNTRIES]);
  const { data } = useGetHostingService(serviceName);

  return (
    <>
      <Controller
        name="path"
        control={control}
        render={({ field }) => (
          <PathField
            label={t('dashboard:hosting_multisite_domain_configuration_home')}
            helpText={t('multisite:multisite_add_website_configure_domain_advanced_path_message')}
            field={field}
            disabled={isAddingDomain}
          />
        )}
      />
      <Divider />
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_advanced_options_title')}
      </Text>
      <div className="flex flex-row space-x-4">
        <Card
          className="w-1/3 p-4"
          color={controlValues.ip ? CARD_COLOR.primary : CARD_COLOR.neutral}
        >
          <div className="flex flex-row">
            <Controller
              name="ip"
              control={control}
              render={({ field }) => (
                <Checkbox
                  name="country-ip"
                  checked={field.value}
                  onCheckedChange={() => field.onChange(!field.value)}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('dashboard:hosting_multisite_domain_configuration_countriesIp')}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
          </div>
          <div className="mb-5 ml-8 mt-4">
            <Text preset={TEXT_PRESET.caption}>
              {t('multisite:multisite_add_website_advanced_options_ip')}
            </Text>
          </div>

          <Controller
            name="selectedIp"
            control={control}
            render={({ field }) => (
              <Select
                name="ip"
                id="ip"
                data-testid="ip"
                disabled={!controlValues.ip}
                value={field.value ? [field.value] : []}
                items={data?.countriesIp?.map((item) => ({
                  label: item.country,
                  options: [
                    {
                      value: item.country,
                      label: item.ip,
                    },
                  ],
                }))}
                onValueChange={(detail: { value?: string[] }) =>
                  field.onChange(Array.isArray(detail.value) ? (detail.value[0] ?? '') : '')
                }
              >
                <SelectControl
                  aria-label={t('multisite:multisite_add_website_advanced_options_ip')}
                />
                <SelectContent />
              </Select>
            )}
          />
        </Card>
        <Card
          className="w-1/3 p-4"
          color={controlValues.firewall ? CARD_COLOR.primary : CARD_COLOR.neutral}
        >
          <div className="flex flex-row">
            <Controller
              name="firewall"
              control={control}
              render={({ field }) => (
                <Checkbox
                  name="firewall"
                  checked={field.value}
                  onCheckedChange={() => field.onChange(!field.value)}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('dashboard:hosting_add_step3_firewall')}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
          </div>
          <div className="mb-5 ml-8 mt-4">
            <Text preset={TEXT_PRESET.caption}>
              {t('multisite:multisite_add_website_advanced_options_firewall')}
            </Text>
          </div>
        </Card>

        <Card
          className="w-1/3 p-4"
          color={controlValues.cdn ? CARD_COLOR.primary : CARD_COLOR.neutral}
        >
          <div className="flex flex-row">
            <Controller
              name="cdn"
              control={control}
              render={({ field }) => (
                <Checkbox
                  name="cdn"
                  checked={field.value}
                  disabled={!data?.hasCdn}
                  onCheckedChange={() => field.onChange(!field.value)}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('dashboard:hosting_multisite_domain_configuration_cdn')}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
          </div>
          <div className="mb-5 ml-8 mt-4">
            <Text preset={TEXT_PRESET.caption}>
              {t('multisite:multisite_add_website_advanced_options_cdn')}
            </Text>
          </div>
        </Card>
      </div>
      <Divider />
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_advanced_options_dns_title')}
      </Text>
      <Controller
        name="autoConfigureDns"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value ? 'auto' : 'manual'}
            onValueChange={(detail: RadioValueChangeDetail) =>
              field.onChange(detail.value === 'auto')
            }
          >
            <div className="flex flex-row space-x-4">
              <Card
                className="w-1/2 p-4"
                color={controlValues.autoConfigureDns ? CARD_COLOR.primary : CARD_COLOR.neutral}
              >
                <div className="flex items-center gap-4">
                  <Radio value="auto">
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_advanced_options_dns_auto')}
                        <Badge size={BADGE_SIZE.sm} className="ml-5">
                          <Text preset={TEXT_PRESET.caption}>
                            {t(
                              'multisite:multisite_add_website_advanced_options_dns_auto_recommanded',
                            )}
                          </Text>
                        </Badge>
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_advanced_options_dns_auto_text')}
                </Text>
              </Card>
              <Card
                className="w-1/2 p-4"
                color={!controlValues.autoConfigureDns ? CARD_COLOR.primary : CARD_COLOR.neutral}
              >
                <div className="flex items-center gap-4">
                  <Radio value="manual">
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_advanced_options_dns_manual')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_advanced_options_dns_manual_text')}
                </Text>
              </Card>
            </div>
          </RadioGroup>
        )}
      />
      {!controlValues?.autoConfigureDns && <DomainManagement controlValues={controlValues} />}
    </>
  );
};
