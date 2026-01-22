import { Icon, Link, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { isServiceInCreation } from '@/domain/utils/helpers';
import {
  useGetDomainResource,
  useGetDomainZone,
  useGetMeTaskIds,
} from '@/domain/hooks/data/query';
import { Task } from '@/domain/types/domainResource';
import LinkToOngoingOperations from '../LinkToOngoingOperations/LinkToOngoingOperations';
import { TaskTypesEnum } from '@/domain/constants/meTasks';
import { followTransferLink } from '@/domain/constants/serviceDetail';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

interface BannerServiceInCreationProps {
  readonly serviceName: string;
}

export default function BannerServiceInCreation({
  serviceName,
}: BannerServiceInCreationProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );
  const { domainResource } = useGetDomainResource(serviceName);
  const { domainZone, isFetchingDomainZone } = useGetDomainZone(
    serviceName,
    true,
  );

  // Retrieve DomainIncomingTransfer operation id
  const { data: ids } = useGetMeTaskIds(serviceName, TaskTypesEnum.DomainIncomingTransfer);
  const operationId = ids?.length > 0 ? ids[0] : undefined;
  const { data: followTransferURL } = useNavigationGetUrl(
    followTransferLink(operationId),
  );

  if (
    isServiceInfoLoading ||
    !isServiceInCreation(serviceInfo) ||
    isFetchingDomainZone
  ) {
    return null;
  }

  const isIncomingTransferTask =
    domainResource?.currentTasks.length > 0 &&
    Object.values(domainResource.currentTasks).some(
      (task: Task) => task.type === TaskTypesEnum.DomainIncomingTransfer,
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
              action: t(isIncomingTransferTask ? 'domain_tab_general_information_banner_service_in_creation_title_transfer' : 'domain_tab_general_information_banner_service_in_creation_title_registration')
            }}
          />
        </span>
        <br />
        <Trans
          i18nKey="domain_tab_general_information_banner_service_in_creation_body"
          t={t}
          values={{
            action: t(isIncomingTransferTask ? 'domain_tab_general_information_banner_service_in_creation_body_transfer' : 'domain_tab_general_information_banner_service_in_creation_body_registration')
          }}
        />
        {domainZone && (
          <>
            <br />
            <span>
              {t(
                'domain_tab_general_information_banner_service_in_creation_body_zone',
              )}
            </span>
          </>
        )}
        <br />
        {
          isIncomingTransferTask && operationId ?
            <Link href={followTransferURL}>
              {t('domain_tab_general_information_banner_service_in_creation_body_follow_transfer')}
              <Icon name="arrow-right" />
            </Link> :
            <LinkToOngoingOperations target="domain" />
        }
      </MessageBody>
    </Message>
  );
}
