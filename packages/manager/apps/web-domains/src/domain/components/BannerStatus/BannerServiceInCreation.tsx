import { Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { isServiceInCreation } from '@/domain/utils/helpers';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { Task } from '@/domain/types/domainResource';
import LinkToOngoingOperations from '../LinkToOngoingOperations/LinkToOngoingOperations';

interface BannerServiceInCreationProps {
  readonly serviceName: string;
}

export default function BannerServiceInCreation({
  serviceName,
}: BannerServiceInCreationProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { serviceInfo } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  if (!isServiceInCreation(serviceInfo)) {
    return null;
  }

  const { domainResource } = useGetDomainResource(serviceName);

  const isCreateTask =
    domainResource?.currentTasks.length > 0 &&
    Object.values(domainResource.currentTasks).some(
      (task: Task) => task.type === 'DomainCreate',
    );

  return (
    <Message
      color="warning"
      dismissible={false}
      className="w-full mb-6"
      data-testid={'banner-service-in-creation'}
    >
      <MessageIcon name="triangle-exclamation" />

      <MessageBody data-testid="banner-body">
        <span className="font-bold">
          <Trans
            i18nKey="domain_tab_general_information_banner_service_in_creation_title"
            t={t}
            values={{
              action: isCreateTask
                ? t(
                    'domain_tab_general_information_banner_service_in_creation_title_registration',
                  )
                : t(
                    'domain_tab_general_information_banner_service_in_creation_title_transfer',
                  ),
            }}
          />
        </span>
        <br />
        <Trans
          i18nKey="domain_tab_general_information_banner_service_in_creation_body"
          t={t}
          values={{
            action: isCreateTask
              ? t(
                  'domain_tab_general_information_banner_service_in_creation_body_registration',
                )
              : t(
                  'domain_tab_general_information_banner_service_in_creation_body_transfer',
                ),
          }}
        />
        <br />
        <LinkToOngoingOperations target="domain" />
      </MessageBody>
    </Message>
  );
}
