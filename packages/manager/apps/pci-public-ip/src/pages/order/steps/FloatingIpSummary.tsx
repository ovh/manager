import { useEffect, useState, useContext } from 'react';
import {
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useMe } from '@/api/hooks/useMe';
import { useSubnets } from '@/api/hooks/useSubnets';
import { useGateways } from '@/api/hooks/useGateways';
import { TGateway } from '@/api/data/gateways';
import { useSelectedGateway } from '@/api/hooks/useSelectedGateway';
import { CatalogPriceComponent } from '@/components/CatalogPrice.component';

export const FloatingIpSummary = ({
  projectId,
  ipRegion,
  networkId,
  onSelectedSizeChanged,
}: {
  projectId: string;
  ipRegion: string;
  networkId: string;
  onSelectedSizeChanged: (size: string) => void;
}): JSX.Element => {
  const context = useContext(ShellContext);

  const { me } = useMe();
  const { data: rawGateways, isPending: isGatewaysPending } = useGateways(
    projectId,
    ipRegion,
  );
  const { data: rawSubnets, isPending: isSubnetsPending } = useSubnets(
    projectId,
    networkId,
  );
  const { state: selectedGateway } = useSelectedGateway();

  const { t: tOrder } = useTranslation('order');

  const [gateways, setGateways] = useState<TGateway[]>([]);
  const [gateway, setGateway] = useState<TGateway>(null);
  const [isSnatEnabled, setIsSnatEnabled] = useState(false);

  useEffect(() => {
    onSelectedSizeChanged(
      gateways?.length === 0 ? selectedGateway?.size : null,
    );
  }, [gateways, selectedGateway]);

  useEffect(() => {
    if (rawGateways && rawSubnets) {
      const networkSubnets = rawSubnets.map((subnet) => subnet.id);
      const newGateways = rawGateways.filter((g) => {
        return g.interfaces.find((i) => networkSubnets.includes(i.subnetId));
      });

      setGateways(() => newGateways);

      if (newGateways.length > 0) {
        // there will be only one gateway with selected subnet, select the first one
        const firstGateway = newGateways[0];
        setGateway(() => firstGateway);

        // SNAT is enabled if the gateway has externalInformation
        const snatEnabled =
          firstGateway.externalInformation !== 'undefined' &&
          firstGateway.externalInformation !== null;

        setIsSnatEnabled(() => snatEnabled);
      }
    }
  }, [rawGateways, rawSubnets]);

  return (
    <>
      {!isGatewaysPending && !isSubnetsPending ? (
        <div>
          {gateways.length === 0 && (
            <OsdsMessage
              icon={ODS_ICON_NAME.WARNING}
              color={ODS_THEME_COLOR_INTENT.warning}
            >
              <div>
                <p>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="font-sans"
                  >
                    {tOrder(
                      'pci_additional_ip_create_summary_step_missing_components_description',
                    )}
                  </OsdsText>
                </p>
                <p>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="font-sans"
                  >
                    {tOrder(
                      'pci_additional_ip_create_summary_step_gateway_name',
                      {
                        region: ipRegion,
                      },
                    )}
                  </OsdsText>
                </p>
                {selectedGateway && (
                  <p>
                    <OsdsText className="font-sans">
                      {tOrder(
                        'pci_additional_ip_create_summary_step_gateway_size_and_price',
                        {
                          size: selectedGateway.size?.toUpperCase(),
                        },
                      )}
                      <span> (</span>
                      {tOrder(
                        'pci_additional_ip_create_summary_step_price',
                      )}{' '}
                      <CatalogPriceComponent
                        price={selectedGateway.price.month}
                        user={me}
                        interval="month"
                        maximumFractionDigits={4}
                        locale={context.environment.getUserLocale()}
                      />{' '}
                      {tOrder('pci_additional_ip_create_summary_step_that_is')}{' '}
                      <CatalogPriceComponent
                        price={selectedGateway.price.hour}
                        user={me}
                        maximumFractionDigits={4}
                        interval="hour"
                        locale={context.environment.getUserLocale()}
                      />
                      <span>)*.</span>
                    </OsdsText>
                  </p>
                )}
              </div>
            </OsdsMessage>
          )}

          {gateways.length > 0 && isSnatEnabled && (
            <OsdsMessage
              icon={ODS_ICON_NAME.INFO}
              color={ODS_THEME_COLOR_INTENT.info}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
              >
                {tOrder('pci_additional_ip_create_step_summary_banner2', {
                  gatewayName: gateway.name,
                })}
              </OsdsText>
            </OsdsMessage>
          )}

          {gateways.length > 0 && !isSnatEnabled && (
            <OsdsMessage
              icon={ODS_ICON_NAME.INFO}
              color={ODS_THEME_COLOR_INTENT.info}
            >
              <p>{tOrder('pci_additional_ip_create_step_summary_banner3')}</p>
            </OsdsMessage>
          )}
        </div>
      ) : (
        <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline={true} />
      )}
    </>
  );
};
