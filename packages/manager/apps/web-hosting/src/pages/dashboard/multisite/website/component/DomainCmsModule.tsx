import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCard, OdsMedium, OdsRadio, OdsText } from '@ovhcloud/ods-components/react';

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
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_module_cms_title')}
      </OdsText>
      <OdsText>{t('multisite:multisite_add_website_module_cms_text')}</OdsText>
      <Controller
        name="module"
        control={control}
        render={({ field }) => (
          <>
            <div className="flex flex-row space-x-4">
              <OdsCard
                className="w-1/3 p-4"
                color={!controlValues.module ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral}
              >
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    name="NONE"
                    value={null}
                    isChecked={!field.value}
                    onOdsChange={() => field.onChange(null)}
                  />
                  <label>
                    <OdsText preset={ODS_TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_none')}
                    </OdsText>
                  </label>
                </div>
                <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_none_text')}
                </OdsText>
              </OdsCard>
              <OdsCard
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.WORDPRESS
                    ? ODS_CARD_COLOR.primary
                    : ODS_CARD_COLOR.neutral
                }
              >
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    name={CmsType.WORDPRESS}
                    value={CmsType.WORDPRESS}
                    isChecked={field.value === CmsType.WORDPRESS}
                    onOdsChange={() => field.onChange(CmsType.WORDPRESS)}
                  />
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <OdsMedium src="cms/wordpress.svg" />
                    <OdsText preset={ODS_TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_wordpress')}
                    </OdsText>
                  </label>
                </div>
                <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_wordpress_text')}
                </OdsText>
              </OdsCard>
              <OdsCard
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.DRUPAL
                    ? ODS_CARD_COLOR.primary
                    : ODS_CARD_COLOR.neutral
                }
              >
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    name={CmsType.DRUPAL}
                    value={CmsType.DRUPAL}
                    isChecked={field.value === CmsType.DRUPAL}
                    onOdsChange={() => field.onChange(CmsType.DRUPAL)}
                  />
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <OdsMedium src="cms/drupal.svg" />
                    <OdsText preset={ODS_TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_drupal')}
                    </OdsText>
                  </label>
                </div>
                <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_drupal_text')}
                </OdsText>
              </OdsCard>
            </div>
            <div className="flex flex-row space-x-4">
              <OdsCard
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.PRESTASHOP
                    ? ODS_CARD_COLOR.primary
                    : ODS_CARD_COLOR.neutral
                }
              >
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    name={CmsType.PRESTASHOP}
                    value={CmsType.PRESTASHOP}
                    isChecked={field.value === CmsType.PRESTASHOP}
                    onOdsChange={() => field.onChange(CmsType.PRESTASHOP)}
                  />
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <OdsMedium src="cms/prestashop.svg" />
                    <OdsText preset={ODS_TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_prestashop')}
                    </OdsText>
                  </label>
                </div>
                <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_prestashop_text')}
                </OdsText>
              </OdsCard>
              <OdsCard
                className="w-1/3 p-4"
                color={
                  controlValues.module === CmsType.JOOMLA
                    ? ODS_CARD_COLOR.primary
                    : ODS_CARD_COLOR.neutral
                }
              >
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    name={CmsType.JOOMLA}
                    value={CmsType.JOOMLA}
                    isChecked={field.value === CmsType.JOOMLA}
                    onOdsChange={() => field.onChange(CmsType.JOOMLA)}
                  />
                  <label className="flex items-center space-x-5 cursor-pointer">
                    <OdsMedium src="cms/joomla.svg" />
                    <OdsText preset={ODS_TEXT_PRESET.heading6}>
                      {t('multisite:multisite_add_website_module_cms_choice_joomla')}
                    </OdsText>
                  </label>
                </div>
                <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                  {t('multisite:multisite_add_website_module_cms_choice_joomla_text')}
                </OdsText>
              </OdsCard>
            </div>
          </>
        )}
      />
    </div>
  );
};
