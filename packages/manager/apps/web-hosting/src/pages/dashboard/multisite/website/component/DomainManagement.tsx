import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsClipboard, OdsDivider, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

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
      <OdsDivider />
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_domain_management')}
      </OdsText>
      <OdsText>{t('multisite:multisite_add_website_domain_management_info')}</OdsText>
      <OdsText preset={ODS_TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_insert_field', {
          domain: `ovhcontrol.${controlValues?.fqdn}`,
        })}
      </OdsText>
      <OdsClipboard value={existingDomain?.data?.token} />
      <OdsText preset={ODS_TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_point_field', {
          field: 'A',
          domain: controlValues?.fqdn,
        })}
      </OdsText>
      <OdsClipboard value={hostingService?.data?.hostingIp} />
      <OdsText preset={ODS_TEXT_PRESET.heading6}>
        {t('multisite:multisite_add_website_domain_management_point_field', {
          field: 'AAAA',
          domain: controlValues?.fqdn,
        })}
      </OdsText>
      <OdsClipboard value={hostingService?.data?.hostingIpv6} />
      <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
        {t('multisite:multisite_add_website_domain_management_propagation')}
      </OdsMessage>
    </div>
  );
};
