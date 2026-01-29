import { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Text,
  Toggle,
  ToggleCheckedChangeDetail,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';
import {
  getPublicIpAvailability,
  TPrivateNetworkSubnetData,
} from '../../view-models/networksViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import PublicIpConfiguration from './PublicIpConfiguration.component';

const AddPublicNetworkConfiguration: FC<{
  subnets: TPrivateNetworkSubnetData[];
}> = ({ subnets }) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [subnetId, microRegion, ipPublicType] = useWatch({
    control,
    name: ['networkId', 'microRegion', 'ipPublicType'],
  });

  const availability = useMemo(
    () =>
      getPublicIpAvailability({
        microRegion,
        subnets,
        subnetId,
      }),
    [microRegion, subnetId, subnets],
  );

  const resetPublicIpFields = useCallback(() => {
    setValue('ipPublicType', null);
    setValue('floatingIpAssignment', null);
    setValue('existingFloatingIp', null);
  }, [setValue]);

  const initializePublicIpFields = useCallback(() => {
    if (!availability) return;

    if (!availability.basicPublicIp.isDisabled) {
      setValue('ipPublicType', 'basicIp');
    } else if (!availability.floatingIp.isDisabled) {
      setValue('ipPublicType', 'floatingIp');
      setValue('floatingIpAssignment', 'createNew');
      setValue('existingFloatingIp', null);
    }
  }, [availability, setValue]);

  const handleAssignPublicIp = ({ checked }: ToggleCheckedChangeDetail) => {
    if (!checked) resetPublicIpFields();
    else initializePublicIpFields();
  };

  useEffect(() => {
    resetPublicIpFields();
    initializePublicIpFields();
  }, [availability, initializePublicIpFields, resetPublicIpFields]);

  if (!availability) return null;

  return (
    <div className="mt-4">
      <Text preset="heading-4">
        {t(
          'creation:pci_instance_creation_network_add_public_connectivity.title',
        )}
      </Text>
      <Trans
        t={t}
        i18nKey="creation:pci_instance_creation_network_add_public_connectivity.description"
        components={{
          p: <Text className="mt-4" preset="paragraph" />,
          span: <span className="font-semibold" />,
        }}
      />
      <Toggle
        withLabels
        className="mt-6"
        checked={!!ipPublicType}
        disabled={
          availability.basicPublicIp.isDisabled &&
          availability.floatingIp.isDisabled
        }
        onCheckedChange={handleAssignPublicIp}
      >
        <ToggleControl />
        <ToggleLabel className="flex items-center">
          <Text>
            {t(
              'creation:pci_instance_creation_network_add_public_connectivity.toggle_label',
            )}
          </Text>
        </ToggleLabel>
      </Toggle>
      {!!ipPublicType && <PublicIpConfiguration subnets={subnets} />}
    </div>
  );
};

export default AddPublicNetworkConfiguration;
