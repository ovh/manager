import { FC, useCallback, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  FormField,
  FormFieldLabel,
  Icon,
  Select,
  SelectContent,
  SelectControl,
  SelectCustomOptionRendererArg,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import NetworkHelper from './network/NetworkHelper.component';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  selectPrivateNetworks,
  TPrivateNetworkCustomData,
} from '../view-models/networksViewModel';
import AddNetworkForm from './network/AddNetworkForm.component';
import GatewayConfiguration from './network/GatewayConfiguration.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import AddPublicNetworkConfiguration from './network/AddPublicNetworkConfiguration.component';
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';
import Banner from '@/components/banner/Banner.component';
import GuideLink from '@/components/guideLink/GuideLink.component';
import { useGuideLink } from '@/hooks/url/useGuideLink';
import SelectOptionRow from '@/components/selectOptionRow/SelectOptionRow.component';

const Network: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [subnetId, microRegion, ipPublicType, willGatewayBeAttached] = useWatch(
    {
      control,
      name: [
        'subnetId',
        'microRegion',
        'ipPublicType',
        'willGatewayBeAttached',
      ],
    },
  );

  const guide = useGuideLink('NETWORK_PRIVATE_MODE');

  const { data: networks, isPending } = usePrivateNetworks({
    select: selectPrivateNetworks(microRegion),
  });

  const { trackClick } = useOvhTracking();

  const handleSelectNetwork = ({ value }: SelectValueChangeDetail) => {
    const id = value[0];

    if (!id) return;

    setValue('subnetId', id);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.select,
      actionType: 'action',
      actions: ['add_instance', 'associate_existing_private_network'],
    });
  };

  const handleOpenCreateNetwork = () => {
    setValue('subnetId', null);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_instance', 'create_private_network'],
    });
  };

  const initializePrivateNetworkFields = useCallback(() => {
    setValue('subnetId', networks?.[0]?.value ?? null);
    setValue('newPrivateNetwork', null, {
      shouldValidate: true,
    });
  }, [networks, setValue]);

  useEffect(() => {
    initializePrivateNetworkFields();
  }, [networks, initializePrivateNetworkFields]);

  if (isPending || !networks) return null;

  return (
    <section>
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_network_setting_title')}
        </Text>
        <NetworkHelper />
      </div>
      <Text preset="heading-4" className="mt-4">
        {t(
          'creation:pci_instance_creation_network_private_network_setting_title',
        )}
      </Text>
      <Text className="mt-4" preset="paragraph">
        {t(
          'creation:pci_instance_creation_network_private_network_setting_description',
        )}
      </Text>
      {!subnetId ? (
        <>
          <Text className="font-semibold" preset="paragraph">
            {t('creation:pci_instance_creation_network_add_new_warning')}
          </Text>
          <AddNetworkForm />
          {networks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={initializePrivateNetworkFields}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
          )}
        </>
      ) : (
        <>
          <FormField className="my-4 max-w-[45%]">
            <FormFieldLabel>
              {t(
                'creation:pci_instance_creation_select_network_dropdown_label',
              )}
            </FormFieldLabel>
            <Select
              items={networks}
              value={[subnetId]}
              onValueChange={handleSelectNetwork}
            >
              <SelectControl
                customItemRenderer={({ selectedItems }) => (
                  <>
                    {selectedItems[0] && (
                      <SelectOptionRow
                        label={selectedItems[0].label}
                        {...((selectedItems[0]
                          .customRendererData as TPrivateNetworkCustomData)
                          .hasGateway && {
                          badge: t(
                            'creation:pci_instance_creation_network_gateway_attached_badge',
                          ),
                          badgeProps: {
                            color: 'information',
                          },
                        })}
                      />
                    )}
                  </>
                )}
              />
              <SelectContent
                className="[&>div>span:first-child]:w-full"
                customOptionRenderer={({
                  label,
                  customData,
                }: SelectCustomOptionRendererArg) => (
                  <SelectOptionRow
                    label={label}
                    {...((customData as TPrivateNetworkCustomData)
                      .hasGateway && {
                      badge: t(
                        'creation:pci_instance_creation_network_gateway_attached_badge',
                      ),
                      badgeProps: {
                        color: 'information',
                      },
                    })}
                  />
                )}
              />
            </Select>
          </FormField>
          <Button variant="outline" onClick={handleOpenCreateNetwork}>
            <Icon name="plus" />
            {t('creation:pci_instance_creation_network_add_new')}
          </Button>
        </>
      )}
      <GatewayConfiguration privateNetworks={networks} />
      <AddPublicNetworkConfiguration privateNetworks={networks} />
      {ipPublicType === null && !willGatewayBeAttached && (
        <Banner className="mt-6">
          <Trans
            i18nKey="creation:pci_instance_creation_network_full_private_warning"
            components={{
              p: <Text preset="paragraph" />,
              semibold: <span className="font-semibold" />,
              Link: <GuideLink className="mt-4" href={guide} />,
            }}
          />
        </Banner>
      )}
    </section>
  );
};

export default Network;
