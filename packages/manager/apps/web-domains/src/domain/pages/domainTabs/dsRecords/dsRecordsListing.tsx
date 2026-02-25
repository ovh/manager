import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Trans, useTranslation } from 'react-i18next';
import {
  Datagrid,
  useAuthorizationIam,
} from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_SIZE,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Spinner,
} from '@ovhcloud/ods-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDomainDsRecordsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDsRecordsDatagridColumns';
import {
  useGetDnssecStatus,
  useGetDomainResource,
  useGetDomainZone,
  useUpdateDnssecService,
} from '@/domain/hooks/data/query';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { areDsRecordsEqual, getSupportedAlgorithm } from '@/domain/utils/utils';
import { DrawerBehavior } from '@/common/types/common.types';
import { DrawerActionEnum } from '@/common/enum/common.enum';
import DsRecordsDrawer from '@/domain/components/DsRecords/DsRecordsDrawer';
import { computeActiveConfiguration } from '@/domain/utils/dnsUtils';
import { flagsValue } from '@/domain/constants/dsRecords';
import DsRecordsDeleteModal from '@/domain/components/DsRecords/DsRecordsDeleteModal';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import DnssecModal from '@/domain/components/ConfigurationCards/DnssecModal';
import LinkToOngoingOperations from '@/domain/components/LinkToOngoingOperations/LinkToOngoingOperations';
import UnauthorizedBanner from '@/domain/components/UnauthorizedBanner/UnauthorizedBanner';
import { useGetIAMResource } from '@/common/hooks/iam/useGetIAMResource';
import Loading from '@/alldoms/components/loading/Loading';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';

export default function DsRecordsListing() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );
  const { data: dnsZoneIAMRessources } = useGetIAMResource(
    domainResource.id,
    'dnsZone',
  );
  const urn = dnsZoneIAMRessources?.[0]?.urn;
  const { isPending, isAuthorized } = useAuthorizationIam(
    ['dnsZone:apiovh:dnssec/create', 'dnsZone:apiovh:dnssec/delete'],
    urn,
  );

  const isInternalDnsConfiguration =
    domainResource?.currentState?.dnsConfiguration.configurationType !==
      DnsConfigurationTypeEnum.EXTERNAL &&
    domainResource?.currentState?.dnsConfiguration.configurationType !==
      DnsConfigurationTypeEnum.MIXED;

  const { domainZone, isFetchingDomainZone } = useGetDomainZone(
    serviceName,
    domainResource,
    isInternalDnsConfiguration,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDnssecModalOpen, setIsDnssecModalOpen] = useState<boolean>(false);
  const [items, setItems] = useState<TDsDataInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drawer, setDrawer] = useState<DrawerBehavior>({
    isOpen: false,
    action: null,
  });
  const [dsRecordsData, setDsRecordsData] = useState<TDsDataInterface>({
    keyTag: null,
    flags: flagsValue,
    algorithm:
      domainResource?.currentState?.dnssecConfiguration?.dsData[0]?.algorithm ??
      0,
    publicKey: '',
  });

  const generalInformationUrl = useGenerateUrl(
    urls.domainTabInformation,
    'path',
    {
      serviceName,
    },
  );
  if (!domainResource.currentState.dnssecConfiguration.dnssecSupported) {
    navigate(generalInformationUrl, { replace: true });
  }

  useEffect(() => {
    const {
      dsData: dsRecordCurrentState,
      supportedAlgorithms,
    } = domainResource?.currentState.dnssecConfiguration;
    const {
      dsData: dsRecordTargetSpec,
    } = domainResource?.targetSpec?.dnssecConfiguration;

    if (!dsRecordCurrentState.length && !dsRecordTargetSpec.length) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const makeKey = (ds: TDsDataInterface) => `${ds.keyTag}-${ds.algorithm}`;

    const targetMap = new Map(
      dsRecordTargetSpec.map((ds) => [makeKey(ds), ds] as const),
    );

    const currentWithStatus: TDsDataInterface[] = dsRecordCurrentState.map(
      (current) => {
        const key = makeKey(current);
        const target = targetMap.get(key);

        if (!target) {
          return {
            ...current,
            supportedAlgorithm: getSupportedAlgorithm(
              current.algorithm,
              supportedAlgorithms,
            ),
            status: StatusEnum.DELETING,
          };
        }

        const isEqual = areDsRecordsEqual(current, target);
        targetMap.delete(key);

        return {
          ...current,
          supportedAlgorithm: getSupportedAlgorithm(
            current.algorithm,
            supportedAlgorithms,
          ),
          status: isEqual ? StatusEnum.ENABLED : StatusEnum.UPDATING,
        };
      },
    );

    const activatingDs: TDsDataInterface[] = Array.from(targetMap.values()).map(
      (target) => ({
        ...target,
        supportedAlgorithm: getSupportedAlgorithm(
          target.algorithm,
          supportedAlgorithms,
        ),
        status: StatusEnum.ACTIVATING,
      }),
    );

    setItems([...currentWithStatus, ...activatingDs]);
    setIsLoading(false);
  }, [domainResource]);

  const activeConfiguration = computeActiveConfiguration(
    domainResource,
    domainZone,
  );

  const columns = useDomainDsRecordsDatagridColumns({
    setDrawer,
    setDsRecordsData,
    setIsModalOpen,
    activeConfiguration,
  });

  const { dnssecStatus, isDnssecStatusLoading } = useGetDnssecStatus(
    domainResource.currentState,
    domainResource.targetSpec,
  );

  let message: JSX.Element = <></>;
  const actionButton = (actionMessage: string) => (
    <span
      className="font-bold flex gap-x-2 items-center cursor-pointer"
      onClick={() => setIsDnssecModalOpen(true)}
    >
      {t(actionMessage)}
    </span>
  );

  if (isInternalDnsConfiguration) {
    switch (dnssecStatus) {
      case DnssecStatusEnum.DISABLED:
        message = actionButton(
          'domain_tab_general_information_dnssec_activation_modal',
        );
        break;
      case DnssecStatusEnum.ENABLED:
        message = actionButton(
          'domain_tab_general_information_dnssec_deactivate_modal',
        );
        break;
      case DnssecStatusEnum.NOT_SUPPORTED:
        message = <span>{t('domain_tab_name_not_supported')}</span>;
        break;
      default:
        // enable/disable in progress
        message = (
          <Trans
            i18nKey="domain_tab_dsrecords_message_information_action_in_progress"
            t={t}
            values={{
              action:
                dnssecStatus === DnssecStatusEnum.ENABLE_IN_PROGRESS
                  ? t(
                      'domain_tab_dsrecords_message_information_action_in_progress_activate',
                    )
                  : t(
                      'domain_tab_dsrecords_message_information_action_in_progress_deactivate',
                    ),
            }}
            components={{
              Link: <LinkToOngoingOperations target="dns" />,
            }}
          />
        );
    }
  }

  const { updateServiceDnssec } = useUpdateDnssecService(
    serviceName,
    dnssecStatus === DnssecStatusEnum.DISABLED,
  );

  const updateDnssec = () => {
    updateServiceDnssec();
    setIsDnssecModalOpen(false);
  };

  if (!isPending && !isAuthorized) {
    return <UnauthorizedBanner />;
  }

  if (
    isDnssecStatusLoading ||
    isFetchingDomainResource ||
    isFetchingDomainZone
  ) {
    return <Loading />;
  }

  return (
    <div data-testid="datagrid">
      <Datagrid
        columns={columns}
        items={items}
        totalItems={items.length}
        isLoading={isLoading || isFetchingDomainZone}
        topbar={
          <div className="flex flex-col gap-y-6 items-start">
            {isInternalDnsConfiguration ? (
              // If the DNS configuration is internal, the customer should not be able to modify their DNSSEC configuration manually
              <>
                <Message
                  color={MESSAGE_COLOR.information}
                  dismissible={false}
                  className="w-full"
                  data-testid="internalConfigMessage"
                >
                  <MessageIcon name={ICON_NAME.circleInfo} />
                  <MessageBody className="flex flex-col items-start">
                    {t('domain_tab_dsrecords_message_information_content')}
                    <br />
                    {isDnssecStatusLoading ? <Spinner /> : message}
                  </MessageBody>
                </Message>
                <DnssecModal
                  isEnableDnssecAction={
                    dnssecStatus === DnssecStatusEnum.DISABLED
                  }
                  open={isDnssecModalOpen}
                  onClose={() => setIsDnssecModalOpen(false)}
                  updateDnssec={updateDnssec}
                />
              </>
            ) : (
              <Button
                name="add-ds-record-button"
                size={BUTTON_SIZE.sm}
                data-testid="addButton"
                onClick={() =>
                  setDrawer({
                    isOpen: true,
                    action: DrawerActionEnum.Add,
                  })
                }
              >
                {t(`${NAMESPACES.ACTIONS}:add`)}
              </Button>
            )}
          </div>
        }
      />
      <DsRecordsDrawer
        drawer={drawer}
        serviceName={serviceName}
        targetSpec={domainResource.targetSpec}
        checksum={domainResource.checksum}
        setDrawer={setDrawer}
        supportedAlgorithms={
          domainResource.currentState.dnssecConfiguration.supportedAlgorithms
        }
        dsRecordsData={dsRecordsData}
      />
      <DsRecordsDeleteModal
        isModalOpen={isModalOpen}
        serviceName={serviceName}
        setIsModalOpen={setIsModalOpen}
        domainResource={domainResource}
        keyTag={dsRecordsData.keyTag}
      />
    </div>
  );
}
