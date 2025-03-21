import { useEffect, useState } from 'react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  OsdsSpinner,
  OsdsMessage,
  OsdsText,
  OsdsIcon,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useAvailablePrivateNetworks } from '@/api/hooks/useNetwork';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { TNetwork } from '@/api/data/network';

import {
  GatewaySelector,
  GatewaySelectorState,
} from '@/components/network/GatewaySelector.component';
import PrivateNetworkSelect from '@/components/create/PrivateNetworkSelect.component';
import SubnetSelect from '@/components/create/SubnetSelect.component';
import LoadBalancerSelect from '@/components/create/LoadBalancerSelect.component';
import { LoadBalancerWarning } from '@/components/network/LoadBalancerWarning.component';

import { KUBECONFIG_3AZ_GATEWAY } from '@/constants';

export type TNetworkFormState = {
  privateNetwork?: TNetwork;
  subnet?: TPrivateNetworkSubnet;
  gateway?: GatewaySelectorState;
  loadBalancersSubnet?: TPrivateNetworkSubnet;
};

export type NetworkClusterStepProps = {
  region: string;
  type;
  onChange: (networkForm: TNetworkFormState) => void;
};

export default function NetworkClusterStep({
  region,
  type,
  onChange,
}: Readonly<NetworkClusterStepProps>) {
  const { projectId } = useParams();
  const [form, setForm] = useState<TNetworkFormState>({});

  const {
    data: availablePrivateNetworks,
    isPending,
  } = useAvailablePrivateNetworks(projectId, region);
  const { t } = useTranslation(['network-add', 'service']);

  useEffect(() => {
    onChange(form);
  }, [form]);

  const shouldWarnSubnet = form.subnet && !form.subnet?.gatewayIp;

  const shouldWarnLoadBalancerSubnet =
    form.subnet?.gatewayIp &&
    form.loadBalancersSubnet &&
    !form.loadBalancersSubnet?.gatewayIp;

  return (
    <>
      {isPending ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          className="block text-center"
        />
      ) : (
        <>
          {type === 'region-3-az' && (
            <OsdsMessage
              type={ODS_MESSAGE_TYPE.info}
              color={ODS_TEXT_COLOR_INTENT.info}
              className="flex my-2"
            >
              <div>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('kubernetes_network_form_notify_users')}
                </OsdsText>{' '}
                <OsdsLink
                  target={OdsHTMLAnchorElementTarget._blank}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={KUBECONFIG_3AZ_GATEWAY}
                >
                  {t('service:kube_service_file_more_information')}
                  <OsdsIcon
                    className="ml-5"
                    aria-hidden="true"
                    name={ODS_ICON_NAME.ARROW_RIGHT}
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </OsdsLink>
              </div>
            </OsdsMessage>
          )}
          <PrivateNetworkSelect
            network={form.privateNetwork}
            networks={availablePrivateNetworks}
            onSelect={(privateNetwork) =>
              setForm((network) => ({
                ...network,
                privateNetwork,
                subnet: null,
                loadBalancersSubnet: null,
              }))
            }
          />
          {form.privateNetwork && (
            <div>
              <SubnetSelect
                key={form.privateNetwork?.id}
                className="mt-8"
                projectId={projectId}
                privateNetwork={form.privateNetwork}
                onSelect={(subnet) =>
                  setForm((network) => ({
                    ...network,
                    subnet,
                  }))
                }
              />
              {shouldWarnSubnet && <LoadBalancerWarning />}
            </div>
          )}
          {form.privateNetwork && form.subnet && (
            <>
              <GatewaySelector
                className="mt-8"
                onSelect={(gateway) =>
                  setForm((network) => ({
                    ...network,
                    gateway,
                  }))
                }
              />
              <LoadBalancerSelect
                projectId={projectId}
                network={form.privateNetwork}
                onSelect={(loadBalancersSubnet) =>
                  setForm((network) => ({
                    ...network,
                    loadBalancersSubnet,
                  }))
                }
              />
              {shouldWarnLoadBalancerSubnet && <LoadBalancerWarning />}
            </>
          )}
        </>
      )}
    </>
  );
}
