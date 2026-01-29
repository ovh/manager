import { useState } from 'react';

import { Location, useLocation, useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Divider,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { Link, LinkType, useNotifications } from '@ovh-ux/muk';

import { useCreateAttachedDomainService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { HostingCountries, HostingDomainStatus } from '@/data/types/product/webHosting';
import { AssociationType } from '@/data/types/product/website';
import { WebsiteFormData, zForm } from '@/utils/formSchemas.utils';

import { DomainAssociation } from '../website/component/DomainAssociation';
import { DomainConfiguration } from '../website/component/DomainConfiguration';
import { DomainManagement } from '../website/component/DomainManagement';

interface AddDomainPageState {
  site: string;
  path?: string;
}
export default function AddWDomainPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { addSuccess, addWarning, clearNotifications } = useNotifications();
  const { t } = useTranslation(['common', 'multisite']);
  const [step, setStep] = useState<number>(1);

  const { state } = useLocation() as Location<AddDomainPageState>;

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      name: state?.site ?? '',
      path: state?.path ?? 'public_html',
      autoConfigureDns: true,
      advancedInstallation: false,
    },
    resolver: zodResolver(zForm(t).WEBSITE_FORM_SCHEMA),
  });

  const controlValues = watch();

  const { createAttachedDomainService } = useCreateAttachedDomainService(
    serviceName,
    () => {
      addSuccess(
        <>
          <Text className="mr-3">{t('multisite:multisite_add_website_success')}</Text>
          <Link href={`#/${serviceName}/task`}>
            {t('multisite:multisite_add_website_in_progress')}
          </Link>
        </>,
        true,
      );
    },
    (error) => {
      addWarning(
        t('multisite:multisite_add_website_error', {
          error: error?.message,
        }),
        true,
      );
    },
  );

  const onSubmit = (data: WebsiteFormData) => {
    clearNotifications();
    if (data.associationType === AssociationType.EXISTING) {
      const payload = {
        serviceName,
        domain: data.hasSubdomain ? `${data.subdomain}.${data.fqdn}` : data.fqdn,
        ssl: true,
        path: data.path,
        bypassDNSConfiguration: !data.autoConfigureDns,
        ...(data.advancedConfiguration
          ? {
              ...(data.ip ? { ipLocation: data.selectedIp as HostingCountries } : {}),
              firewall: data.firewall ? HostingDomainStatus.ACTIVE : HostingDomainStatus.NONE,
              cdn: data.cdn ? HostingDomainStatus.ACTIVE : HostingDomainStatus.NONE,
            }
          : {}),
      };

      createAttachedDomainService({ ...payload });
    } else {
      const payload = {
        serviceName: serviceName,
        domain: data.fqdn,
        path: data.path ?? null,
      };
      createAttachedDomainService({ ...payload });
    }
    navigate(-1);
  };

  return (
    <form className="flex flex-col space-y-6">
      <Link type={LinkType.back} onClick={() => navigate(-1)} className="mb-4">
        {t('common:web_hosting_common_sites_backlink')}
      </Link>
      <Text preset={TEXT_PRESET.heading3}>{t('multisite:multisite_add_domain_title')}</Text>
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_domain_configuration')}

        <Tooltip>
          <TooltipTrigger asChild>
            <Icon id="cdn-tooltip" name={ICON_NAME.circleInfo} className="ml-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>{t('multisite:multisite_add_website_domain_info')}</TooltipContent>
        </Tooltip>
      </Text>
      <DomainAssociation
        control={control}
        controlValues={controlValues}
        setStep={setStep}
        isNextButtonVisible={step === 1}
        reset={reset}
        isAddingDomain={true}
      />
      {step >= 2 && (
        <>
          <Divider />
          <DomainConfiguration
            control={control}
            controlValues={controlValues}
            setStep={setStep}
            isNextButtonVisible={
              step === 2 && controlValues.associationType === AssociationType.EXTERNAL
            }
            isAddingDomain={true}
          />
        </>
      )}
      {controlValues.associationType === AssociationType.EXTERNAL && step === 3 && (
        <div>
          <DomainManagement controlValues={controlValues} />
          <Button
            onClick={() => void handleSubmit(onSubmit)()}
            disabled={!controlValues.fqdn}
            className="mt-4"
          >
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </div>
      )}
      {controlValues.associationType === AssociationType.EXISTING && step >= 2 && (
        <div>
          <Button
            onClick={() => void handleSubmit(onSubmit)()}
            disabled={!controlValues.fqdn}
            className="mt-4"
          >
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </div>
      )}
    </form>
  );
}
