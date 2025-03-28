import { useEffect, useState, useContext } from 'react';
import {
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation, Trans } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useSubnets } from '@/api/hooks/useSubnets';
import { useGateways } from '@/api/hooks/useGateways';
import { TGateway } from '@/api/data/gateways';
import { useAddons } from '@/api/hooks/useAddons/useAddons';
import { filterProductRegionBySize } from '@/api/hooks/useAddons/useAddons.select';
import PriceLabel from '@/components/PriceLabel.component';
import {
  FLOATING_IP_ADDON_FAMILY,
  GATEWAY_ADDON_FAMILY,
} from '@/api/hooks/useAddons/useAddons.constant';
import TileLabel from '@/components/tile/TileLabel.component';
import { TProductAddonDetail } from '@/types/product.type';
import { useActions } from '@/hooks/order/useActions';
import { useOrderStore } from '@/hooks/order/useStore';
import { StepIdsEnum } from '@/api/types';

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
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { data: rawGateways, isPending: isGatewaysPending } = useGateways(
    projectId,
    ipRegion,
  );
  const { data: rawSubnets, isPending: isSubnetsPending } = useSubnets(
    projectId,
    networkId,
  );

  const addonsParams = {
    ovhSubsidiary,
    projectId,
    select: (addons: TProductAddonDetail[]) =>
      filterProductRegionBySize(addons, ipRegion),
  };

  const { addons: defaultGateways } = useAddons({
    ...addonsParams,
    addonFamily: GATEWAY_ADDON_FAMILY,
  });

  const { addons: floatingIps, isFetching: isFloatingIpFetching } = useAddons({
    ...addonsParams,
    addonFamily: FLOATING_IP_ADDON_FAMILY,
  });
  const { On } = useActions(projectId);
  const { form } = useOrderStore();

  const selectedGateway = defaultGateways[0];

  const { t } = useTranslation('order');

  const [gateways, setGateways] = useState<TGateway[]>([]);
  const [gateway, setGateway] = useState<TGateway>(null);
  const [isSnatEnabled, setIsSnatEnabled] = useState(false);

  const isSearchingGateway = isGatewaysPending || isSubnetsPending;
  const isActionOnProgress = isSearchingGateway || form.isSubmitting;

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

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
    <div>
      <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} className="mb-6" inline>
        <TileLabel title={t('pci_floating_ip_resume_hour')}>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            <strong>{t('pci_floating_ip_resume_price')}</strong>
            <PriceLabel
              value={getFormattedHourlyCatalogPrice(floatingIps[0]?.price)}
              isLoading={isFloatingIpFetching}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              className="font-normal"
            />
          </OsdsText>
        </TileLabel>
      </OsdsTile>
      {!isSearchingGateway && (
        <div className="mb-6">
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
                    <Trans
                      t={t}
                      i18nKey="pci_additional_ip_create_summary_step_missing_components_description"
                    />
                  </OsdsText>
                </p>
                {selectedGateway && (
                  <p>
                    <OsdsText className="font-sans">
                      {t(
                        'pci_additional_ip_create_summary_step_gateway_size_and_price',
                        {
                          size: selectedGateway.size?.toUpperCase(),
                        },
                      )}{' '}
                      ({t('pci_additional_ip_create_summary_step_price')}{' '}
                      <PriceLabel
                        value={getFormattedHourlyCatalogPrice(
                          selectedGateway.price,
                        )}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                        color={ODS_THEME_COLOR_INTENT.default}
                      />
                      ).
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
                {t('pci_additional_ip_create_step_summary_banner2', {
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
              <p>{t('pci_additional_ip_create_step_summary_banner3')}</p>
            </OsdsMessage>
          )}
        </div>
      )}
      {isActionOnProgress && (
        <div>
          <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline />
        </div>
      )}
      <div className="mt-6">
        <OsdsButton
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="w-fit"
          {...(isActionOnProgress && { disabled: true })}
          onClick={() => On.next(StepIdsEnum.FLOATING_SUMMARY)}
        >
          {t('pci_additional_ip_creating_floating_ip')}
        </OsdsButton>
      </div>
    </div>
  );
};
