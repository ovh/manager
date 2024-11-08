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
import { useCatalog } from '@ovh-ux/manager-pci-common';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { useCreateStore } from '@/pages/create/store';
import { AGORA_GATEWAY_REGEX } from '@/constants';
import { useGetSubnetGateways } from '@/api/hook/useGateways';

export const SubnetNetworksPart = (): JSX.Element => {
  const store = useCreateStore();
  const { t: tCreate } = useTranslation('load-balancer/create');

  const { data: catalog } = useCatalog();

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const { projectId } = useParams();

  const { isFetching: isSubnetGatewaysFetching } = useGetSubnetGateways(
    projectId,
    store.region?.name,
    store.subnet?.id,
  );

  return (
    <>
      {isSubnetGatewaysFetching ? (
        <OsdsSpinner inline />
      ) : (
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
                      {tCreate(
                        'octavia_load_balancer_create_private_network_no_gateway_text',
                      )}
                    </OsdsText>
                  </p>
                  <p>
                    <OsdsText
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {tCreate(
                        'octavia_load_balancer_create_private_network_no_gateway_text_price',
                      )}
                      {getFormattedHourlyCatalogPrice(
                        catalog.addons.filter((addon) =>
                          addon.planCode.match(AGORA_GATEWAY_REGEX),
                        )[0].pricings[0].price,
                      )}
                    </OsdsText>
                  </p>
                </div>
              </OsdsMessage>
            )}
        </>
      )}
    </>
  );
};
