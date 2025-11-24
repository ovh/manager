import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

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

import { usePostWebHostingWebsites } from '@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { AssociationType } from '@/data/types/product/website';
import { ServiceStatus } from '@/data/types/status';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

import { DomainAssociation } from './component/DomainAssociation';
import { DomainCmsModule } from './component/DomainCmsModule';
import { DomainConfiguration } from './component/DomainConfiguration';
import { DomainManagement } from './component/DomainManagement';

export default function AddWebsitePage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { addSuccess, addWarning } = useNotifications();
  const { t } = useTranslation(['common', 'multisite']);
  const [step, setStep] = useState<number>(1);

  type FormData = z.infer<typeof websiteFormSchema>;

  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      path: 'public_html',
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
          fqdn: data.hasSubdomain ? `${data.subdomain}.${data.fqdn}` : data.fqdn,
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
      <Link type={LinkType.back} onClick={() => navigate(-1)} className="mb-4">
        {t('common:web_hosting_common_sites_backlink')}
      </Link>
      <Text preset={TEXT_PRESET.heading3}>{t('multisite:multisite_add_website_title')}</Text>
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_choose_domain_title')}
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon id="cdn-tooltip" name={ICON_NAME.circleInfo} className="cursor-pointer ml-4" />
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
      />
      {step >= 2 && (
        <>
          <Divider />
          <DomainConfiguration
            control={control}
            controlValues={controlValues}
            setStep={setStep}
            isNextButtonVisible={step === 2}
          />
        </>
      )}
      {controlValues.associationType === AssociationType.EXTERNAL && step === 3 && (
        <>
          <DomainManagement controlValues={controlValues} />
          <Button onClick={() => void handleSubmit(onSubmit)()} disabled={!controlValues.fqdn}>
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </>
      )}
      {step === 4 && (
        <>
          <Divider />
          <DomainCmsModule control={control} controlValues={controlValues} />
          <Button onClick={() => void handleSubmit(onSubmit)()} disabled={!controlValues.fqdn}>
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </>
      )}
    </form>
  );
}
