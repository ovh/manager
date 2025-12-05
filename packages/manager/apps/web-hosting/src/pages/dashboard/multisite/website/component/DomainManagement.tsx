import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Clipboard, Divider, MESSAGE_COLOR, Message, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import {
  useGetAddDomainExisting,
  useGetHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainManagementProps {
  controlValues: FormData;
}

export const DomainManagement: React.FC<DomainManagementProps> = ({
  controlValues,
}: DomainManagementProps) => {
  const { serviceName } = useParams();
  const { t } = useTranslation(['multisite', 'dashboard']);
  const hostingService = useGetHostingService(serviceName);
  const existingDomain = useGetAddDomainExisting(serviceName, true, Boolean(serviceName));

  return (
    <div className="flex flex-col space-y-5">
      <Divider />
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_domain_management')}
      </Text>
      <Text>{t('multisite:multisite_add_website_domain_management_info')}</Text>
      <Text preset={TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_insert_field', {
          domain: `ovhcontrol.${controlValues?.fqdn}`,
        })}
      </Text>
      <Clipboard value={existingDomain?.data?.token} />
      <Text preset={TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_point_field', {
          field: 'A',
          domain: controlValues?.fqdn,
        })}
      </Text>
      <Clipboard value={hostingService?.data?.hostingIp} />
      <Text preset={TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_point_field', {
          field: 'AAAA',
          domain: controlValues?.fqdn,
        })}
      </Text>
      <Clipboard value={hostingService?.data?.hostingIpv6} />
      <Message color={MESSAGE_COLOR.warning} dismissible={false}>
        {t('multisite:multisite_add_website_domain_management_propagation')}
      </Message>
    </div>
  );
};
