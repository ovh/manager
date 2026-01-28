import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  INPUT_TYPE,
  Input,
  MESSAGE_COLOR,
  Message,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

import { useGetDomainZone } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { AssociationType } from '@/data/types/product/website';
import { websiteFormSchema } from '@/utils/formSchemas.utils';
import { isValidDomain } from '@/utils/validator';

import { DomainAdvancedConfiguration } from './DomainAdvancedConfiguration';
import { PathField } from './fields/Pathfield';

type FormData = z.infer<ReturnType<typeof websiteFormSchema>>;

interface DomainConfigurationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isNextButtonVisible: boolean;
  isAddingDomain?: boolean;
}

export const DomainConfiguration: React.FC<DomainConfigurationProps> = ({
  control,
  controlValues,
  setStep,
  isNextButtonVisible,
  isAddingDomain = false,
}: DomainConfigurationProps) => {
  const { t } = useTranslation(['multisite', 'dashboard', 'common']);
  const { data } = useGetDomainZone();

  return (
    <div className="flex flex-col space-y-5">
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_configure_domain_title')}
      </Text>
      {controlValues?.associationType === AssociationType.EXISTING ? (
        <>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Text>{t('multisite_add_website_configure_domain_display_name')}</Text>
                <Input
                  className="w-1/3"
                  type={INPUT_TYPE.text}
                  name="website-name"
                  disabled={isAddingDomain}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <Text preset={TEXT_PRESET.caption}>
                  {t('multisite_add_website_configure_domain_display_text')}
                </Text>
              </div>
            )}
          />
          <Controller
            name="fqdn"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Text>{t('multisite_add_website_configure_domain_fqdn')}</Text>
                <Select
                  name={field.name}
                  id="fqdn"
                  data-testid="fqdn"
                  className="w-1/3"
                  items={data?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  value={
                    Array.isArray(field.value) ? field.value : field.value ? [field.value] : []
                  }
                  onValueChange={(detail: { value?: string[] }) =>
                    field.onChange(Array.isArray(detail.value) ? (detail.value[0] ?? '') : '')
                  }
                >
                  <SelectControl />
                  <SelectContent />
                </Select>
              </div>
            )}
          />
          <div className="flex flex-row">
            <Controller
              name="hasSubdomain"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  name="hasSubdomain"
                  onCheckedChange={() => field.onChange(!field.value)}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text>
                      {t('dashboard:hosting_add_step2_mode_OVH_domain_name_subdomain_question')}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
          </div>
          {controlValues?.hasSubdomain && (
            <div className="flew-row flex w-1/3 gap-3">
              <Controller
                name="subdomain"
                control={control}
                render={({ field }) => (
                  <Input
                    type={INPUT_TYPE.text}
                    name="subdomain"
                    className="w-1/3"
                    placeholder={t('dashboard:hosting_add_step2_mode_OVH_domain_name_placeholder')}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <Button
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.primary}
                disabled={!controlValues?.fqdn}
                size={BUTTON_SIZE.sm}
              >
                {`.${controlValues?.fqdn}`}
              </Button>
            </div>
          )}
          <Controller
            name="advancedConfiguration"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Toggle
                  name="advanced-configuration"
                  key="advanced-configuration"
                  id="advanced-configuration"
                  checked={Boolean(field.value)}
                  onCheckedChange={(detail) => field.onChange(detail.checked)}
                >
                  <ToggleControl />
                  <ToggleLabel>
                    <Text>{t('multisite_add_website_configure_domain_advanced')}</Text>
                  </ToggleLabel>
                </Toggle>
              </div>
            )}
          />
          {controlValues?.advancedConfiguration ? (
            <DomainAdvancedConfiguration
              control={control}
              controlValues={controlValues}
              isAddingDomain={isAddingDomain}
            />
          ) : (
            <Message color={MESSAGE_COLOR.information} dismissible={false}>
              {t('multisite_add_website_configure_domain_advanced_message')}
            </Message>
          )}
        </>
      ) : (
        <>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Text>{t('multisite_add_website_configure_domain_display_name')}</Text>
                <Input
                  className="w-1/3"
                  type={INPUT_TYPE.text}
                  name="website-name"
                  disabled={isAddingDomain}
                  value={String(field.value ?? '')}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <Text preset={TEXT_PRESET.caption}>
                  {t?.('multisite_add_website_configure_domain_display_text')}
                </Text>
              </div>
            )}
          />
          <Controller
            name="fqdn"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Text>{t('multisite_add_website_configure_domain_fqdn')}</Text>
                <Input
                  className="w-1/3"
                  type={INPUT_TYPE.text}
                  name="fqdn"
                  value={typeof field.value === 'string' ? field.value : ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </div>
            )}
          />
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <PathField
                label={t('dashboard:hosting_multisite_domain_configuration_home')}
                helpText={t(
                  'multisite:multisite_add_website_configure_domain_advanced_path_message',
                )}
                field={field}
                disabled={isAddingDomain}
              />
            )}
          />
        </>
      )}
      {isNextButtonVisible && (
        <div>
          <Button
            disabled={
              !controlValues.name ||
              !controlValues.fqdn ||
              (controlValues.associationType === AssociationType.EXTERNAL &&
                !isValidDomain(controlValues.fqdn)) ||
              (isAddingDomain && !isValidDomain(controlValues.fqdn)) ||
              (controlValues.hasSubdomain &&
                (!controlValues.subdomain ||
                  !isValidDomain(`${controlValues.subdomain}.${controlValues.fqdn}`)))
            }
            onClick={() =>
              setStep(controlValues?.associationType === AssociationType.EXISTING ? 4 : 3)
            }
          >
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </div>
      )}
    </div>
  );
};
