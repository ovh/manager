import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FlavorDetails } from '../components/cart/FlavorDetails.component';
import { useCatalogPrice } from '@ovh-ux/muk';
import { useInstanceCreation } from './useInstanceCreation';
import CartOptionDetailItem from '../components/cart/CartOptionDetailItem.component';
import Banner from '@/components/banner/Banner.component';

export type TCartItem = {
  id: string;
  title: string;
  name?: string;
  details: TCartItemDetail[];
  expanded: boolean;
};

export type TCartItemDetail = {
  name: string;
  description?: JSX.Element;
  price?: number;
};

type TCartItems = {
  cartItems: TCartItem[];
  cartActions: JSX.Element;
};

export const useCartItems = (): TCartItems => {
  const { getTextPrice } = useCatalogPrice(4);
  const { t } = useTranslation([
    'common',
    'regions',
    'creation',
    NAMESPACES.REGION,
  ]);

  const {
    instanceData,
    isCreationEnabled,
    isCreatingInstance,
    handleCreateInstance,
    errorMessage,
  } = useInstanceCreation();

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
  } = instanceData;

  const region: TCartItemDetail[] = localizationDetails
    ? [
        {
          name: t(`${NAMESPACES.REGION}:localisation`),
          description: (
            <Text preset="heading-6" className="text-[--ods-color-heading]">
              {`${t(`regions:${localizationDetails.cityKey}`)} (${
                localizationDetails.datacenterDetails
              })`}
            </Text>
          ),
        },
      ]
    : [];

  const flavor = flavorDetails
    ? [
        {
          name: t('creation:pci_instance_creation_select_flavor_cart_section'),
          description: (
            <>
              <FlavorDetails quantity={quantity} flavor={flavorDetails} />
              {flavorDetails.price && (
                <Text preset="heading-6" className="text-[--ods-color-heading]">
                  {getTextPrice(flavorDetails.price)}
                </Text>
              )}
            </>
          ),
        },
      ]
    : [];

  const distributionImage =
    distributionImageVariantId && distributionImageVersionName
      ? [
          {
            name: t(
              'creation:pci_instance_creation_cart_distribution_image_title',
            ),
            description: (
              <>
                <Text preset="heading-6" className="text-[--ods-color-heading]">
                  {distributionImageVersionName}
                </Text>
                {windowsImageLicensePrice && (
                  <Text
                    preset="heading-6"
                    className="text-[--ods-color-heading]"
                  >
                    {getTextPrice(windowsImageLicensePrice)}
                  </Text>
                )}
              </>
            ),
          },
        ]
      : [];

  const sshKey = sshKeyId
    ? [
        {
          name: t('common:pci_instances_common_ssh_key_label'),
          description: (
            <Text preset="heading-6" className="text-[--ods-color-heading]">
              {sshKeyId}
            </Text>
          ),
        },
      ]
    : [];

  const backups = backupConfigurationPrices?.localBackupPrice
    ? [
        {
          name: t('common:pci_instances_common_backup'),
          description: (
            <div className="w-full">
              <CartOptionDetailItem
                label={t(
                  'creation:pci_instance_creation_backup_setting_local_label',
                )}
                price={t(
                  'creation:pci_instance_creation_backup_setting_price_unit',
                  {
                    price: getTextPrice(
                      backupConfigurationPrices.localBackupPrice,
                    ),
                  },
                )}
              />
              {backupConfigurationPrices.distantBackupPrice && (
                <CartOptionDetailItem
                  className="mt-2"
                  label={t(
                    'creation:pci_instance_creation_backup_setting_distant_label',
                  )}
                  price={t(
                    'creation:pci_instance_creation_backup_setting_price_unit',
                    {
                      price: getTextPrice(
                        backupConfigurationPrices.distantBackupPrice,
                      ),
                    },
                  )}
                />
              )}
            </div>
          ),
        },
      ]
    : [];

  const network = privateNetwork
    ? [
        {
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
        },
      ]
    : [];

  const publicNetworkDetails = publicNetwork
    ? [
        {
          name: t('creation:pci_instance_creation_cart_public_network_title'),
          description: (
            <div className="w-full">
              <CartOptionDetailItem
                label={t(publicNetwork.labelKey)}
                {...(publicNetwork.price !== null && {
                  price: getTextPrice(publicNetwork.price),
                })}
              />
            </div>
          ),
        },
      ]
    : [];

  const details = [
    ...region,
    ...flavor,
    ...distributionImage,
    ...sshKey,
    ...backups,
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
    },
  ];

  const ActionButtons = (
    <>
      {errorMessage && (
        <Banner className="my-4" color="critical">
          <p className="text-critical text-md m-0 font-bold">
            {t('creation:pci_instance_creation_error_title')}
          </p>
          {errorMessage}
        </Banner>
      )}
      <Button
        loading={isCreatingInstance}
        onClick={handleCreateInstance}
        disabled={!isCreationEnabled}
      >
        {t('creation:pci_instance_creation_create_my_instance')}
      </Button>
      <Button variant="outline">
        {t('creation:pci_instance_creation_configuration_code')}
      </Button>
    </>
  );

  return { cartItems, cartActions: ActionButtons };
};
