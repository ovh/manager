import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { FlavorDetails } from '../components/cart/FlavorDetails.component';
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
import { useCatalogPrice } from '@ovh-ux/muk';

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
  price: number | null;
  priceUnit?: string;
  isApproximate?: boolean;
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

  const [flavorId, macroRegion, microRegion, availabilityZone] = useWatch({
    control,
    name: ['flavorId', 'macroRegion', 'microRegion', 'availabilityZone'],
  });

  const quantityHintParamsSelect = useMemo(
    () =>
      selectQuantityHintParams({
        regionalizedFlavorId: flavorId,
        macroRegionId: macroRegion,
        microRegionId: microRegion,
        availabilityZone: availabilityZone,
      }),
    [flavorId, macroRegion, microRegion, availabilityZone],
  );
  const { data: quantityHintParams } = useInstancesCatalogWithSelect({
    select: quantityHintParamsSelect,
  });

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
            <CartOptionDetailItem
              label={`${t(`regions:${localizationDetails.cityKey}`)} (${
                localizationDetails.datacenterDetails
              })`}
            />
          ),
          price: null,
        },
      ]
    : [];

  const flavor: TCartItemDetail[] = flavorDetails
    ? [
        {
          id: 'flavor',
          name: t('creation:pci_instance_creation_select_flavor_cart_section'),
          description: (
            <FlavorDetails quantity={quantity} flavor={flavorDetails} />
          ),
          price: flavorDetails.price * quantity,
          priceUnit,
        },
      ]
    : [];

  const distributionImage: TCartItemDetail[] =
    distributionImageVariantId && distributionImageVersionName
      ? [
          {
            id: 'distributionImage',
            name: t(
              'creation:pci_instance_creation_cart_distribution_image_title',
            ),
            description: (
              <CartOptionDetailItem label={distributionImageVersionName} />
            ),
            price: windowsImageLicensePrice
              ? windowsImageLicensePrice * quantity
              : null,
            priceUnit: windowsImageLicensePrice ? priceUnit : undefined,
          },
        ]
      : [];

  const sshKey: TCartItemDetail[] = sshKeyId
    ? [
        {
          id: 'sshKey',
          name: t('common:pci_instances_common_ssh_key_label'),
          description: <CartOptionDetailItem label={sshKeyId} />,
          price: null,
        },
      ]
    : [];

  const backup: TCartItemDetail[] = backupConfigurationPrices?.localBackupPrice
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
              />
              {backupConfigurationPrices.distantBackupPrice && (
                <CartOptionDetailItem
                  className="mt-2"
                  label={t(
                    'creation:pci_instance_creation_backup_setting_distant_label',
                  )}
                />
              )}
            </div>
          ),
          price:
            backupConfigurationPrices.localBackupPrice +
            (backupConfigurationPrices.distantBackupPrice ?? 0),
          priceUnit: t(
            'creation:pci_instance_creation_backup_setting_price_unit',
          ),
          isApproximate: true,
        },
      ]
    : [];

  const network: TCartItemDetail[] = privateNetwork
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
                    price: `${getTextPrice(privateNetwork.gatewayPrice)}`,
                    unit: priceUnit,
                  })}
                />
              )}
            </div>
          ),
          price: null,
        },
      ]
    : [];

  const publicNetworkDetails: TCartItemDetail[] = publicNetwork
    ? [
        {
          id: 'publicNetwork',
          name: t('creation:pci_instance_creation_cart_public_network_title'),
          description: (
            <div>
              <CartOptionDetailItem
                label={
                  quantity > 1
                    ? `${quantity} x ${t(publicNetwork.labelKey)}`
                    : t(publicNetwork.labelKey)
                }
              />
            </div>
          ),
          price: publicNetwork.price ? publicNetwork.price * quantity : null,
          priceUnit,
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
