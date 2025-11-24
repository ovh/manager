import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  CARD_COLOR,
  Card,
  Medium,
  Radio,
  RadioGroup,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainCmsModuleProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
}

export const DomainCmsModule: React.FC<DomainCmsModuleProps> = ({
  control,
  controlValues,
}: DomainCmsModuleProps) => {
  const { t } = useTranslation(['common', 'multisite', 'dashboard']);

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
          <>
            <div className="flex flex-row space-x-4">
              <Card
                className="w-1/3 p-4"
                color={!controlValues.module ? CARD_COLOR.primary : CARD_COLOR.neutral}
              >
                <div className="flex gap-4 items-center">
                  <RadioGroup>
                    <Radio value={null} onChange={() => field.onChange(null)} />
                  </RadioGroup>
                  <label>
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_none')}
                    </Text>
                  </label>
                </div>
                <Text preset={TEXT_PRESET.caption} className="ml-8 m-4">
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
                <div className="flex gap-4 items-center">
                  <RadioGroup>
                    <Radio
                      value={CmsType.WORDPRESS}
                      onChange={() => field.onChange(CmsType.WORDPRESS)}
                    />
                  </RadioGroup>
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <Medium src="cms/wordpress.svg" />
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_wordpress')}
                    </Text>
                  </label>
                </div>
                <Text preset={TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_wordpress_text')}
                </Text>
              </Card>
              <Card
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.DRUPAL ? CARD_COLOR.primary : CARD_COLOR.neutral
                }
              >
                <div className="flex gap-4 items-center">
                  <RadioGroup>
                    <Radio value={CmsType.DRUPAL} onChange={() => field.onChange(CmsType.DRUPAL)} />
                  </RadioGroup>
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <Medium src="cms/drupal.svg" />
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_drupal')}
                    </Text>
                  </label>
                </div>
                <Text preset={TEXT_PRESET.caption} className="ml-8 m-4">
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
                <div className="flex gap-4 items-center">
                  <RadioGroup>
                    <Radio
                      value={CmsType.PRESTASHOP}
                      onChange={() => field.onChange(CmsType.PRESTASHOP)}
                    />
                  </RadioGroup>
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <Medium src="cms/prestashop.svg" />
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_prestashop')}
                    </Text>
                  </label>
                </div>
                <Text preset={TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_prestashop_text')}
                </Text>
              </Card>
              <Card
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.JOOMLA ? CARD_COLOR.primary : CARD_COLOR.neutral
                }
              >
                <div className="flex gap-4 items-center">
                  <RadioGroup>
                    <Radio value={CmsType.JOOMLA} onChange={() => field.onChange(CmsType.JOOMLA)} />
                  </RadioGroup>
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <Medium src="cms/joomla.svg" />
                    <Text preset={TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_joomla')}
                    </Text>
                  </label>
                </div>
                <Text preset={TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_joomla_text')}
                </Text>
              </Card>
            </div>
          </>
        )}
      />
    </div>
  );
};
