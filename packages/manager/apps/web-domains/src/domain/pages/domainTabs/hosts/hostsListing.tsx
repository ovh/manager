import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';
import {
    Button,
    BUTTON_SIZE,
    ICON_NAME,
    Message,
    Text,
    MessageBody,
    MessageIcon,
    Link,
    Icon,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useHostsDatagridColumns } from '@/domain/hooks/domainTabs/useHostsDatagridColumns';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { StatusEnum } from '@/domain/enum/Status.enum';
import HostDrawer from '@/domain/components/Host/HostDrawer';
import Loading from '@/domain/components/Loading/Loading';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import { THost } from '@/domain/types/host';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';
import { DrawerActionEnum } from '@/common/enum/common.enum';
import { DrawerBehavior } from '@/common/types/common.types';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useLinks } from '@/domain/constants/guideLinks';
import UnauthorizedBanner from '@/domain/components/UnauthorizedBanner/UnauthorizedBanner';

export default function HostsListingTab() {
    const { t } = useTranslation([
        'domain',
        NAMESPACES.ACTIONS,
        NAMESPACES.FORM,
        NAMESPACES.ONBOARDING,
    ]);
    const [hostsArray, setHostsArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { serviceName } = useParams<{ serviceName: string }>();
    const navigate = useNavigate();
    const context = useContext(ShellContext);
    const { ovhSubsidiary } = context.environment.getUser();
    const guideUrls = useLinks(ovhSubsidiary);

    const [drawer, setDrawer] = useState<DrawerBehavior>({
        isOpen: false,
        action: null,
    });

    const [hostData, setHostData] = useState<THost>({
        host: '',
        ips: [''],
    });

    const { domainResource } = useGetDomainResource(serviceName);
    const { nichandleInformation } = useNichandleInformation();

    const generalInformationUrl = useGenerateUrl(
        urls.domainTabInformation,
        'path',
        {
            serviceName,
        },
    );
    if (!domainResource.currentState.hostsConfiguration.hostSupported) {
        navigate(generalInformationUrl, { replace: true });
    }

    // We compare the current and the targetSpec to add a status. The status depends of the difference between current and target object.
    useEffect(() => {
        // We get hosts array from current and target Specs
        const hostsCurrentState =
            domainResource?.currentState?.hostsConfiguration?.hosts || [];
        const hostsTargetSpec =
            domainResource?.targetSpec?.hostsConfiguration?.hosts || [];

        const targetMap = new Map(hostsTargetSpec.map((h) => [h.host, h]));

        // We check every host in the currentState and compare ips relied to the host.
        const hostsWithStatus = hostsCurrentState.map((current) => {
            const target = targetMap.get(current.host);

            // Host in current but not in targetSpec, we apply the deleting status
            if (!target) {
                return { ...current, status: StatusEnum.DELETING };
            }

            const targetIpsSet = new Set(target.ips);

            const ipsEqual =
                current.ips.length === target.ips.length &&
                current.ips.every((ip) => targetIpsSet.has(ip));

            // Remove from map so remaining entries represent "activating" hosts
            targetMap.delete(current.host);

            return {
                ...current,
                status: ipsEqual ? StatusEnum.ENABLED : StatusEnum.UPDATING,
            };
        });

        // Hosts not present in current but in the targetSpec
        const activatingHosts = Array.from(targetMap.values()).map((target) => ({
            ...target,
            status: StatusEnum.ACTIVATING,
        }));

        setHostsArray([...hostsWithStatus, ...activatingHosts]);
        setIsLoading(false);
    }, [domainResource]);

    const columns = useHostsDatagridColumns({
        setDrawer,
        setHostData,
    });

    if (isLoading && nichandleInformation) {
        return <Loading />;
    }

    const account = nichandleInformation?.auth?.account;
    const {
        id,
    } = domainResource?.currentState?.contactsConfiguration?.contactAdministrator;

    return id === account ? (
        <section>
            <div className="flex flex-col gap-y-4 mb-6">
                <Message dismissible={false}>
                    <MessageIcon name={ICON_NAME.circleInfo} />
                    <MessageBody className="flex flex-col">
                        <Text>{t('domain_tab_hosts_information_banner_1')}</Text>
                        <Text>{t('domain_tab_hosts_information_banner_2')}</Text>
                        <div className="flex items-center gap-x-4">
                            <Link
                                href={guideUrls.HOST_LINK}
                                className="text-[--ods-color-primary-500]"
                                target="_blank"
                            >
                                {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
                                <Icon name={ICON_NAME.externalLink} />
                            </Link>
                        </div>
                    </MessageBody>
                </Message>
            </div>

            <div data-testid="datagrid">
                <Datagrid
                    columns={columns}
                    items={hostsArray}
                    totalItems={hostsArray.length}
                    topbar={
                        <Button
                            size={BUTTON_SIZE.sm}
                            onClick={() => {
                                setDrawer({
                                    isOpen: true,
                                    action: DrawerActionEnum.Add,
                                });
                            }}
                            data-testid="addButton"
                        >
                            {t(`${NAMESPACES.ACTIONS}:add`)}
                        </Button>
                    }
                />
            </div>
            <HostDrawer
                drawer={drawer}
                setDrawer={setDrawer}
                ipv4Supported={
                    domainResource.currentState.hostsConfiguration.ipv4Supported
                }
                ipv6Supported={
                    domainResource.currentState.hostsConfiguration.ipv6Supported
                }
                multipleIPsSupported={
                    domainResource.currentState.hostsConfiguration.multipleIPsSupported
                }
                serviceName={serviceName}
                checksum={domainResource?.checksum}
                targetSpec={domainResource?.targetSpec}
                hostData={hostData}
            />
            <Outlet />
        </section>
    ) : (
        <UnauthorizedBanner />
    );
}
