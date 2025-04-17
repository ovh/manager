import { useEffect, useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { useCreateStore } from '@/pages/create/store';
import { useSubnetGateways } from '@/api/hook/useGateways/useGateways';
import { FloatingIpSelectionId } from '@/types/floating.type';
import { useAddons } from '@/api/hook/useAddons/useAddons';
import { GATEWAY_ADDON_FAMILY } from '@/api/hook/useAddons/useAddons.constant';
import { TProductAddonDetail } from '@/types/product.type';
import { filterProductRegionBySize } from '@/api/hook/useAddons/useAddons.select';

export const SubnetNetworksPart = (): JSX.Element => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const store = useCreateStore();
  const { t } = useTranslation('load-balancer/create');

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const { projectId } = useParams();

  const region = store.region?.name || '';

  const {
    data: subnetGateways,
    isFetching: isSubnetGatewaysFetching,
  } = useSubnetGateways(projectId, region, store.subnet?.id);

  const { addons } = useAddons({
    ovhSubsidiary,
    projectId,
    addonFamily: GATEWAY_ADDON_FAMILY,
    select: (products: TProductAddonDetail[]) =>
      filterProductRegionBySize(products, region),
  });

  // the smallest gateway is always the first because it is already sorted by size
  const gateway = useMemo(() => (addons ? addons[0] : null), [addons]);

  useEffect(() => {
    store.set.gateways(subnetGateways || []);
  }, [subnetGateways, store.set]);

  if (isSubnetGatewaysFetching) {
    return (
      <div className="mt-8">
        <OsdsSpinner inline />
      </div>
    );
  }

  if (isSubnetGatewaysFetching) {
    return <OsdsSpinner inline />;
  }

  return (
    <>
      {store.subnet &&
        store.gateways.length === 0 &&
        store.publicIp !== FloatingIpSelectionId.UNATTACHED && (
          <OsdsMessage
            className="mt-8"
            type={ODS_MESSAGE_TYPE.info}
            color={ODS_THEME_COLOR_INTENT.info}
          >
            <div className="grid grid-cols-1">
              <p>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(
                    'octavia_load_balancer_create_private_network_no_gateway_text',
                  )}
                </OsdsText>
              </p>
              {gateway && (
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(
                    'octavia_load_balancer_create_private_network_no_gateway_text_price',
                    {
                      size: gateway.size.toUpperCase(),
                      price: getFormattedHourlyCatalogPrice(gateway.price),
                    },
                  )}
                </OsdsText>
              )}
            </div>
          </OsdsMessage>
        )}
    </>
  );
};
