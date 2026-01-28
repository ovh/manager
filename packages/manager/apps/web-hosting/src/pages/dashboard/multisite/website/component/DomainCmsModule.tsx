import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  CARD_COLOR,
  Card,
  Medium,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { AssociationType } from '@/data/types/product/website';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

import { DomainCmsAdvancedOptions } from './DomainCmsAdvancedOptions';

type FormData = z.infer<ReturnType<typeof websiteFormSchema>>;

interface DomainCmsModuleProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
}

export const DomainCmsModule: React.FC<DomainCmsModuleProps> = ({
  control,
  controlValues,
  setValue,
  errors,
}: DomainCmsModuleProps) => {
  const { t } = useTranslation(['common', 'multisite', 'dashboard']);

  const shouldShowAdvancedOptions =
    controlValues.associationType === AssociationType.EXISTING ||
    controlValues.associationType === AssociationType.EXTERNAL;

  return (
    <div className="flex flex-col space-y-5">
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_module_cms_title')}
      </Text>
      <Text>{t('multisite:multisite_add_website_module_cms_text')}</Text>
      <Controller
        name="module"
        control={control}
        render={({ field }) => (
          <RadioGroup value={field.value} onChange={field.onChange}>
            <div className="flex flex-row space-x-4">
              <Card
                className="w-1/3 p-4"
                color={!controlValues.module ? CARD_COLOR.primary : CARD_COLOR.neutral}
              >
                <div className="flex items-center gap-4">
                  <Radio value={CmsType.NONE}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_module_cms_none')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_module_cms_none_text')}
                </Text>
              </Card>
              <Card
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.WORDPRESS
                    ? CARD_COLOR.primary
                    : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={CmsType.WORDPRESS}>
                    <RadioControl />
                    <RadioLabel className="flex cursor-pointer items-center space-x-5">
                      <Medium src="cms/wordpress.svg" />
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_module_cms_choice_wordpress')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_module_cms_choice_wordpress_text')}
                </Text>
              </Card>
              <Card
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.DRUPAL ? CARD_COLOR.primary : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={CmsType.DRUPAL}>
                    <RadioControl />
                    <RadioLabel className="flex cursor-pointer items-center space-x-5">
                      <Medium src="cms/drupal.svg" />
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_module_cms_choice_drupal')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_module_cms_choice_drupal_text')}
                </Text>
              </Card>
            </div>
            <div className="flex flex-row space-x-4">
              <Card
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.PRESTASHOP
                    ? CARD_COLOR.primary
                    : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={CmsType.PRESTASHOP}>
                    <RadioControl />
                    <RadioLabel className="flex cursor-pointer items-center space-x-5">
                      <Medium src="cms/prestashop.svg" />
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_module_cms_choice_prestashop')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_module_cms_choice_prestashop_text')}
                </Text>
              </Card>
              <Card
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.JOOMLA ? CARD_COLOR.primary : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={CmsType.JOOMLA}>
                    <RadioControl />
                    <RadioLabel className="flex cursor-pointer items-center space-x-5">
                      <Medium src="cms/joomla.svg" />
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_module_cms_choice_joomla')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <Text preset={TEXT_PRESET.caption} className="m-4 ml-8">
                  {t('multisite:multisite_add_website_module_cms_choice_joomla_text')}
                </Text>
              </Card>
            </div>
          </RadioGroup>
        )}
      />
      {shouldShowAdvancedOptions && (
        <DomainCmsAdvancedOptions
          control={control}
          controlValues={controlValues}
          setValue={setValue}
          errors={errors}
        />
      )}
    </div>
  );
};
