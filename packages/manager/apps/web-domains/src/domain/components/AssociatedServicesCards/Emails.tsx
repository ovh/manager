import { Text } from '@ovhcloud/ods-react';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useEmailService } from '@/domain/hooks/data/query';
import { AssociatedEmailsServicesEnum } from '@/domain/enum/associatedServices.enum';
import { useContext } from 'react';
import { getOrderURL } from '@ovh-ux/manager-module-order';

interface EmailsProps {
  readonly serviceName: string;
}

interface EmailUrlProps {
  readonly href: string;
  readonly target?: string;
}

export default function Emails({ serviceName }: EmailsProps) {
  const { t } = useTranslation(['domain']);
  const { data } = useEmailService(serviceName);

  const { data: mxPlanURL } = useNavigationGetUrl([
    'web',
    `/email_domain/${serviceName}`,
    {},
  ]);

  const { data: zimbraURL } = useNavigationGetUrl([
    'zimbra',
    `/${data?.data}`,
    {},
  ]);

  const { data: redirectionURL } = useNavigationGetUrl([
    'web',
    `/email_domain/${serviceName}/email/redirection`,
    {},
  ]);

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const region = context.environment.getRegion();
  const orderUrl = getOrderURL('orderEmailPro', region, ovhSubsidiary);

  const getEmailsURL = (): EmailUrlProps => {
    switch (data?.serviceDetected) {
      case AssociatedEmailsServicesEnum.MXPLAN:
        return { href: mxPlanURL as string };
      case AssociatedEmailsServicesEnum.ZIMBRA:
        return { href: zimbraURL as string };
      case AssociatedEmailsServicesEnum.REDIRECTION:
        return { href: redirectionURL as string };
      default:
        return { href: orderUrl, target: '_blank' };
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
              ...getEmailsURL(),
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
