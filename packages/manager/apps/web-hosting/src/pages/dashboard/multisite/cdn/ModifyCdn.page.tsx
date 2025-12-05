import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Links } from '@ovh-ux/manager-react-components';

import { CDN_ADVANCED } from '@/constants';
import { useGetCdnOption, useGetServiceNameCdn } from '@/data/hooks/cdn/useCdn';
import { CdnFormValues } from '@/data/types/product/cdn';
import { subRoutes, urls } from '@/routes/routes.constants';
import { cdnFormDefaultValues } from '@/utils/cdn';

import CdnRuleDatagrid from './component/CdnRuleDatagrid';
import { OptionCache } from './component/OptionCache';
import { OptionPerformance } from './component/OptionPerformance';
import { OptionSecurity } from './component/OptionSecurity';

export default function ModifyCdnPage() {
  const { serviceName, domain } = useParams();
  const navigate = useNavigate();

  const cdn = useGetServiceNameCdn(serviceName);
  const { data } = useGetCdnOption(serviceName, domain);
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const range = cdn?.data?.type?.replace(/[-]+/g, ' ').toUpperCase();

  const defaultValues: CdnFormValues = cdnFormDefaultValues(data);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<CdnFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!data) return;
    const next = cdnFormDefaultValues(data);

    reset(next);
  }, [data, reset]);

  const onSubmit = (formData: CdnFormValues) => {
    navigate(
      urls.cdnConfirmation
        .replace(subRoutes.serviceName, serviceName)
        .replace(subRoutes.domain, domain),
      {
        state: {
          formData,
          optionsData: data,
        },
      },
    );
  };

  const controlValues = watch();

  return (
    <form className="flex flex-col space-y-6">
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('cdn_shared_title', {
          domain,
          range,
        })}
      </OdsText>
      <OdsText>{t('cdn_shared_info')}</OdsText>
      <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false} className="w-full">
        {t('cdn_shared_help')}
        <Links label={t('cdn_shared_help_link')} target="_blank" className="ml-4" />
      </OdsMessage>

      <OptionPerformance controlValues={controlValues} control={control} optionsData={data} />

      <OptionCache
        controlValues={controlValues}
        control={control}
        optionsData={data}
        advancedPurge={range === CDN_ADVANCED}
      />

      <CdnRuleDatagrid range={range} />

      <OptionSecurity controlValues={controlValues} control={control} optionsData={data} />

      <div className="flex space-x-4">
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:cancel`)}
          variant={ODS_BUTTON_VARIANT.outline}
          color={ODS_BUTTON_COLOR.primary}
          onClick={() => navigate(-1)}
        />
        <OdsButton
          label={t('cdn_shared_option_cache_rule_btn_validate')}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!isDirty}
          onClick={() => void handleSubmit(onSubmit)()}
        />
      </div>
    </form>
  );
}
