import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Button,
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
  Divider,
  MESSAGE_COLOR,
  Message,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import {
  useGetAddDomainExisting,
  useGetHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { AssociationType } from '@/data/types/product/website';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<ReturnType<typeof websiteFormSchema>>;

interface DomainManagementProps {
  controlValues: FormData;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  isNextButtonVisible?: boolean;
}

export const DomainManagement: React.FC<DomainManagementProps> = ({
  controlValues,
  setStep,
  isNextButtonVisible = false,
}: DomainManagementProps) => {
  const { serviceName } = useParams();
  const { t } = useTranslation(['multisite', 'dashboard', 'common']);
  const hostingService = useGetHostingService(serviceName);
  const existingDomain = useGetAddDomainExisting(serviceName, true, Boolean(serviceName));

  return (
    <div className="flex flex-col space-y-5">
      <Divider />
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_domain_management')}
      </Text>
      <Text>{t('multisite:multisite_add_website_domain_management_info')}</Text>
      {controlValues?.associationType === AssociationType.EXTERNAL && (
        <>
          <Text preset={TEXT_PRESET.heading6}>
            {t('multisite:multisite_add_website_domain_management_insert_field', {
              domain: `ovhcontrol.${controlValues?.fqdn}`,
            })}
          </Text>
          <div>
            <Clipboard value={existingDomain?.data?.token}>
              <ClipboardControl />
              <ClipboardTrigger />
            </Clipboard>
          </div>
        </>
      )}
      <Text preset={TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_point_field', {
          field: 'A',
          domain: controlValues?.fqdn,
        })}
      </Text>
      <div>
        <Clipboard value={hostingService?.data?.hostingIp}>
          <ClipboardControl />
          <ClipboardTrigger />
        </Clipboard>
      </div>
      <Text preset={TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_point_field', {
          field: 'AAAA',
          domain: controlValues?.fqdn,
        })}
      </Text>
      <div>
        <Clipboard value={hostingService?.data?.hostingIpv6}>
          <ClipboardControl />
          <ClipboardTrigger />
        </Clipboard>
      </div>
      <Message color={MESSAGE_COLOR.warning} dismissible={false}>
        {t('multisite:multisite_add_website_domain_management_propagation')}
      </Message>
      {isNextButtonVisible && (
        <div>
          <Button onClick={() => setStep?.(4)}>
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </div>
      )}
    </div>
  );
};
