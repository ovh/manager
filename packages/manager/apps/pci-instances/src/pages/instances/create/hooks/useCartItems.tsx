import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FlavorDetails } from '../components/cart/FlavorDetails.component';
import { useCatalogPrice } from '@ovh-ux/muk';
import { useInstanceCreation } from './useInstanceCreation';
import CartOptionDetailItem from '../components/cart/CartOptionDetailItem.component';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import { useMemo } from 'react';
import {
  selectQuantityHintParams,
  TQuantityHintParams,
} from '../view-models/cartViewModel';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';

export type TCartItem = {
  id: string;
  title: string;
  name?: string;
  details: TCartItemDetail[];
  expanded: boolean;
  quantityHintParams?: TQuantityHintParams;
};

export type TCartItemDetail = {
  id: string;
  name: string;
  description?: JSX.Element;
  displayPrice: boolean;
  price?: number;
  priceUnit?: string;
};

type TCartItems = {
  cartItems: TCartItem[];
};

export const useCartItems = (): TCartItems => {
  const { getTextPrice } = useCatalogPrice(4);
  const { t } = useTranslation([
    'common',
    'regions',
    'creation',
    NAMESPACES.REGION,
  ]);
  const { control } = useFormContext<TInstanceCreationForm>();

  const { instanceData } = useInstanceCreation();

  const [
    flavorId,
    macroRegion,
    microRegion,
    availabilityZone,
    flavorType,
  ] = useWatch({
    control,
    name: [
      'flavorId',
      'macroRegion',
      'microRegion',
      'availabilityZone',
      'flavorType',
    ],
  });

  const { data: catalog } = useInstancesCatalogWithSelect({
    select: (c) => c,
  });

  const quantityHintParams = useMemo(
    () =>
      catalog
        ? selectQuantityHintParams(catalog)({
            regionalizedFlavorId: flavorId,
            macroRegionId: macroRegion,
            microRegionId: microRegion,
            availabilityZone: availabilityZone,
            flavorType: flavorType ?? null,
          })
        : {
            quota: null,
            type: null,
            region: null,
            regionId: null,
          },
    [catalog, flavorId, macroRegion, microRegion, availabilityZone, flavorType],
  );

  const {
    localizationDetails,
    flavorDetails,
    quantity,
    distributionImageVariantId,
    distributionImageVersionName,
    windowsImageLicensePrice,
    sshKeyId,
    privateNetwork,
    publicNetwork,
    name,
    backupConfigurationPrices,
    billingType,
  } = instanceData;

  const priceUnit = t(
    `creation:pci_instance_creation_table_header_price_${billingType}_unit`,
  );

  const region: TCartItemDetail[] = localizationDetails
    ? [
        {
          id: 'region',
          name: t(`${NAMESPACES.REGION}:localisation`),
          description: (
            <Text preset="heading-6" className="text-[--ods-color-heading]">
              {`${t(`regions:${localizationDetails.cityKey}`)} (${
                localizationDetails.datacenterDetails
              })`}
            </Text>
          ),
          displayPrice: false,
        },
      ]
    : [];

  const flavor = flavorDetails
    ? [
        {
          id: 'flavor',
          name: t('creation:pci_instance_creation_select_flavor_cart_section'),
          description: (
            <FlavorDetails quantity={quantity} flavor={flavorDetails} />
          ),
          price: flavorDetails.price,
          displayPrice: true,
          priceUnit,
        },
      ]
    : [];

  const distributionImage =
    distributionImageVariantId && distributionImageVersionName
      ? [
          {
            id: 'distributionImage',
            name: t(
              'creation:pci_instance_creation_cart_distribution_image_title',
            ),
            description: (
              <Text preset="heading-6" className="text-[--ods-color-heading]">
                {distributionImageVersionName}
              </Text>
            ),
            price: windowsImageLicensePrice,
            displayPrice: !!windowsImageLicensePrice,
            priceUnit: windowsImageLicensePrice ? priceUnit : undefined,
          },
        ]
      : [];

  const sshKey = sshKeyId
    ? [
        {
          id: 'sshKey',
          name: t('common:pci_instances_common_ssh_key_label'),
          description: (
            <Text preset="heading-6" className="text-[--ods-color-heading]">
              {sshKeyId}
            </Text>
          ),
          displayPrice: false,
        },
      ]
    : [];

  const backup = backupConfigurationPrices?.localBackupPrice
    ? [
        {
          id: 'backup',
          name: t('common:pci_instances_common_backup'),
          description: (
            <div className="w-full">
              <CartOptionDetailItem
                label={t(
                  'creation:pci_instance_creation_backup_setting_local_label',
                )}
                price={`~${getTextPrice(
                  backupConfigurationPrices.localBackupPrice,
                )}`}
                priceUnit={t(
                  'creation:pci_instance_creation_backup_setting_price_unit',
                )}
              />
              {backupConfigurationPrices.distantBackupPrice && (
                <CartOptionDetailItem
                  className="mt-2"
                  label={t(
                    'creation:pci_instance_creation_backup_setting_distant_label',
                  )}
                  price={`~${getTextPrice(
                    backupConfigurationPrices.distantBackupPrice,
                  )}`}
                  priceUnit={t(
                    'creation:pci_instance_creation_backup_setting_price_unit',
                  )}
                />
              )}
            </div>
          ),
          price:
            backupConfigurationPrices.localBackupPrice +
            (backupConfigurationPrices.distantBackupPrice ?? 0),
          displayPrice: false,
        },
      ]
    : [];

  const network = privateNetwork
    ? [
        {
          id: 'network',
          name: t(
            'creation:pci_instance_creation_network_private_network_setting_title',
          ),
          description: (
            <div className="w-full">
              <CartOptionDetailItem label={privateNetwork.name} />
              {privateNetwork.willGatewayBeAttached && (
                <CartOptionDetailItem
                  className="mt-2"
                  label={t(
                    'creation:pci_instance_creation_network_gateway_title',
                  )}
                  {...(privateNetwork.gatewayPrice && {
                    price: getTextPrice(privateNetwork.gatewayPrice),
                  })}
                />
              )}
            </div>
          ),
          //TODO: Add condition on public/private/gateway etc
          displayPrice: true,
        },
      ]
    : [];

  const publicNetworkDetails = publicNetwork
    ? [
        {
          id: 'publicNetwork',
          name: t('creation:pci_instance_creation_cart_public_network_title'),
          description: (
            <div className="w-full">
              <CartOptionDetailItem
                label={
                  quantity > 1
                    ? `${quantity} x ${t(publicNetwork.labelKey)}`
                    : t(publicNetwork.labelKey)
                }
                {...(publicNetwork.price !== null && {
                  price: getTextPrice(publicNetwork.price * quantity),
                })}
              />
            </div>
          ),
          //TODO: Add condition on public/private/gateway etc
          displayPrice: true,
        },
      ]
    : [];

  const details = [
    ...region,
    ...flavor,
    ...distributionImage,
    ...sshKey,
    ...backup,
    ...network,
    ...publicNetworkDetails,
  ];

  const cartItems: TCartItem[] = [
    {
      id: 'instanceToCreate',
      title: t('pci_instances_common_instance_title'),
      name,
      details,
      expanded: true,
      quantityHintParams,
    },
  ];

  return { cartItems };
};
