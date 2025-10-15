import { Text } from '@ovhcloud/ods-react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useEmailService } from '@/domain/hooks/data/query';
import { AssociatedEmailsServicesEnum } from '@/domain/enum/associatedServices.enum';

interface EmailsProps {
  serviceName: string;
}

export default function Emails({ serviceName }: EmailsProps) {
  const { t } = useTranslation(['domain']);
  const { data } = useEmailService(serviceName);

  const { data: mxPlanURL } = useNavigationGetUrl([
    'web/email_domain',
    `/${serviceName}`,
    {},
  ]);

  const { data: zimbraURL } = useNavigationGetUrl([
    'zimbra',
    `/${data?.data}`,
    {},
  ]);

  const { data: redirectionURL } = useNavigationGetUrl([
    'web/email_domain',
    `/${serviceName}/email/redirection`,
    {},
  ]);

  const getEmailsURL = (): string => {
    switch (data?.serviceDetected) {
      case AssociatedEmailsServicesEnum.MXPLAN:
        return mxPlanURL as string;
      case AssociatedEmailsServicesEnum.ZIMBRA:
        return zimbraURL as string;
      default:
        return redirectionURL as string;
    }
  };

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_associated_services_emails')}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>
          {t(
            'domain_tab_general_information_associated_services_emails_content',
          )}
        </Text>
        <ActionMenu
          id="emails-service"
          isCompact
          items={[
            {
              id: 1,
              label: t(
                'domain_tab_general_information_associated_services_emails_action',
              ),
              href: getEmailsURL(),
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
