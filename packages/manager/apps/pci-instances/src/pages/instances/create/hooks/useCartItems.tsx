import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { FlavorDetails } from '../components/cart/FlavorDetails.component';
import { useCatalogPrice } from '@ovh-ux/muk';
import { useInstanceCreation } from './useInstanceCreation';
import CartOptionDetailItem from '../components/cart/CartOptionDetailItem.component';

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
  } = useInstanceCreation();

  const {
    localizationDetails,
    flavorDetails,
    quantity,
    distributionImageVariantId,
    distributionImageVersionName,
    windowsImageLicensePrice,
    sshKeyId,
    networkName,
    name,
    backupSettingPrices,
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

  const backups = backupSettingPrices?.localBackupPrice
    ? [
        {
          name: t('common:pci_instances_common_backup'),
          description: (
            <div className="w-full">
              <CartOptionDetailItem
                label={t(
                  'creation:pci_instance_creation_backup_setting_local_label',
                )}
                price={backupSettingPrices.localBackupPrice}
              />
              {backupSettingPrices.distantBackupPrice && (
                <CartOptionDetailItem
                  className="mt-2"
                  label={t(
                    'creation:pci_instance_creation_backup_setting_distant_label',
                  )}
                  price={backupSettingPrices.distantBackupPrice}
                />
              )}
            </div>
          ),
        },
      ]
    : [];

  const network = networkName
    ? [
        {
          name: t(
            'creation:pci_instance_creation_network_private_network_setting_title',
          ),
          description: (
            <Text preset="heading-6" className="text-[--ods-color-heading]">
              {networkName}
            </Text>
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
