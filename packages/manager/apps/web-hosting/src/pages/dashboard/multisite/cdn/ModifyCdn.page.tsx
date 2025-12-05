import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  Message,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link } from '@ovh-ux/muk';

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
    <div className="flex flex-col space-y-6">
      <Text preset={TEXT_PRESET.heading3}>
        {t('cdn_shared_title', {
          domain,
          range,
        })}
      </Text>
      <Text>{t('cdn_shared_info')}</Text>
      <Message color={MESSAGE_COLOR.information} dismissible={false} className="w-full">
        {t('cdn_shared_help')}
        <Link target="_blank" className="ml-4">
          {t('cdn_shared_help_link')}
        </Link>
      </Message>

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
        <Button
          variant={BUTTON_VARIANT.outline}
          color={BUTTON_COLOR.primary}
          onClick={() => navigate(-1)}
        >
          {t(`${NAMESPACES.ACTIONS}:cancel`)}
        </Button>
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.primary}
          disabled={!isDirty}
          onClick={() => void handleSubmit(onSubmit)()}
        >
          {t('cdn_shared_option_cache_rule_btn_validate')}
        </Button>
      </div>
    </div>
  );
}
