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
import {
  useGetSubnetGateways,
  useSmallestGatewayByRegion,
} from '@/api/hook/useGateways';

export const SubnetNetworksPart = (): JSX.Element => {
  const store = useCreateStore();
  const { t } = useTranslation('load-balancer/create');

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const { projectId } = useParams();

  const { isFetching: isSubnetGatewaysFetching } = useGetSubnetGateways(
    projectId,
    store.region?.name,
    store.subnet?.id,
  );

  const gateway = useSmallestGatewayByRegion(store.region?.name, projectId);

  if (isSubnetGatewaysFetching) {
    return <OsdsSpinner inline />;
  }

  return (
    <>
      {store.subnet &&
        store.gateways.length === 0 &&
        store.publicIp.type !== 'none' && (
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
