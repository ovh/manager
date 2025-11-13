import { useState } from 'react';

import { Location, useLocation, useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsDivider,
  OdsIcon,
  OdsLink,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { LinkType, Links, useNotifications } from '@ovh-ux/manager-react-components';

import { usePostWebHostingWebsites } from '@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { AssociationType } from '@/data/types/product/website';
import { ServiceStatus } from '@/data/types/status';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

import { DomainAssociation } from '../website/component/DomainAssociation';
import { DomainConfiguration } from '../website/component/DomainConfiguration';
import { DomainDnsConfiguration } from '../website/component/DomainDnsConfiguration';
import { DomainManagement } from '../website/component/DomainManagement';

interface AddDomainPageState {
  site: string;
  path?: string;
}

export default function AddWDomainPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { addSuccess, addWarning } = useNotifications();
  const { t } = useTranslation(['common', 'multisite']);
  const [step, setStep] = useState<number>(1);

  type FormData = z.infer<typeof websiteFormSchema>;
  const { state } = useLocation() as Location<AddDomainPageState>;

  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      name: state?.site ?? '',
      path: state?.path ?? 'public_html',
      autoConfigureDns: true,
    },
    resolver: zodResolver(websiteFormSchema),
  });

  const controlValues = watch();

  const { postWebHostingWebsites } = usePostWebHostingWebsites(
    serviceName,
    () => {
      addSuccess(
        <>
          <OdsText>{t('multisite:multisite_add_website_success')}</OdsText>
          <OdsLink
            href={`#/${serviceName}/task`}
            label={t('multisite:multisite_add_website_in_progress')}
          />
        </>,
        true,
      );
    },
    (error) => {
      addWarning(
        t('multisite:multisite_add_website_error', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onSubmit = (data: FormData) => {
    if (data.associationType === AssociationType.EXISTING) {
      const payload = {
        targetSpec: {
          name: data.name,
          fqdn: data.fqdn,
          ...(data.module ? { module: { name: data.module as CmsType } } : {}),
          bypassDNSConfiguration: !data.autoConfigureDns,
          ...(data.advancedConfiguration
            ? {
                ...(data.ip ? { ipLocation: data.selectedIp } : {}),
                firewall: {
                  status: data.firewall ? ServiceStatus.ACTIVE : ServiceStatus.NONE,
                },
                cdn: {
                  status: data.cdn ? ServiceStatus.ACTIVE : ServiceStatus.NONE,
                },
                path: data.path,
              }
            : {}),
        },
      };
      postWebHostingWebsites([payload, false]);
    } else {
      const payload = {
        targetSpec: {
          name: data.name,
          fqdn: data.fqdn,
        },
      };
      postWebHostingWebsites([payload, data.wwwNeeded ?? false]);
    }
    navigate(-1);
  };

  return (
    <form className="flex flex-col space-y-6">
      <Links
        type={LinkType.back}
        onClickReturn={() => navigate(-1)}
        label={t('common:web_hosting_common_sites_backlink')}
        className="mb-4"
      />
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('multisite:multisite_add_domain_title')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_domain_configuration')}
        <OdsIcon id="cdn-tooltip" name={ODS_ICON_NAME.circleInfo} className="cursor-pointer ml-4" />
        <OdsTooltip triggerId="cdn-tooltip">
          <OdsText>{t('multisite:multisite_add_website_domain_info')}</OdsText>
        </OdsTooltip>
      </OdsText>
      <DomainAssociation
        control={control}
        controlValues={controlValues}
        setStep={setStep}
        isNextButtonVisible={step === 1}
      />
      <OdsDivider />
      {step >= 2 ? (
        <DomainConfiguration
          control={control}
          controlValues={controlValues}
          setStep={setStep}
          isNextButtonVisible={step === 2}
          isAddingDomain={true}
        />
      ) : (
        <OdsText preset={ODS_TEXT_PRESET.heading4}>
          {t('multisite:multisite_add_website_configure_domain_title')}
        </OdsText>
      )}
      {controlValues.associationType === AssociationType.EXTERNAL && step === 3 && (
        <>
          <DomainManagement controlValues={controlValues} />
          <OdsButton
            label={t('common:web_hosting_common_action_continue')}
            onClick={() => void handleSubmit(onSubmit)()}
            isDisabled={!controlValues.fqdn}
          />
        </>
      )}
      {controlValues.associationType === AssociationType.EXISTING && step >= 3 && (
        <>
          <DomainDnsConfiguration
            control={control}
            controlValues={controlValues}
            setStep={setStep}
            isNextButtonVisible={false}
          />
          <OdsButton
            label={t('common:web_hosting_common_action_continue')}
            onClick={() => void handleSubmit(onSubmit)()}
            isDisabled={!controlValues.fqdn}
          />
        </>
      )}
    </form>
  );
}
