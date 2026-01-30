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
  TPrivateNetworkData,
} from '../../view-models/networksViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import PublicIpConfiguration from './PublicIpConfiguration.component';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { selectMicroRegionDeploymentMode } from '../../view-models/microRegionsViewModel';

const AddPublicNetworkConfiguration: FC<{
  privateNetworks: TPrivateNetworkData[];
}> = ({ privateNetworks }) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [privateNetworkId, microRegion, ipPublicType] = useWatch({
    control,
    name: ['privateNetworkId', 'microRegion', 'ipPublicType'],
  });

  const { data: deploymentMode } = useInstancesCatalogWithSelect({
    select: selectMicroRegionDeploymentMode(microRegion),
  });

  const publicIpAvailability = useMemo(
    () =>
      getPublicIpAvailability({
        deploymentMode,
        privateNetworks,
        privateNetworkId,
      }),
    [deploymentMode, privateNetworkId, privateNetworks],
  );

  const resetPublicIpFields = useCallback(() => {
    setValue('ipPublicType', null);
    setValue('floatingIpAssignment', null);
    setValue('existingFloatingIp', null);
  }, [setValue]);

  const initializePublicIpFields = useCallback(() => {
    if (!publicIpAvailability) return;

    if (!publicIpAvailability.basicPublicIp.isDisabled) {
      setValue('ipPublicType', 'basicIp');
    } else if (!publicIpAvailability.floatingIp.isDisabled) {
      setValue('ipPublicType', 'floatingIp');
      setValue('floatingIpAssignment', 'createNew');
      setValue('existingFloatingIp', null);
    }
  }, [publicIpAvailability, setValue]);

  const handleAssignPublicIp = ({ checked }: ToggleCheckedChangeDetail) => {
    if (!checked) resetPublicIpFields();
    else initializePublicIpFields();
  };

  useEffect(() => {
    resetPublicIpFields();
    initializePublicIpFields();
  }, [publicIpAvailability, initializePublicIpFields, resetPublicIpFields]);

  if (!publicIpAvailability) return null;

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
          publicIpAvailability.basicPublicIp.isDisabled &&
          publicIpAvailability.floatingIp.isDisabled
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
      {!!ipPublicType && (
        <PublicIpConfiguration privateNetworks={privateNetworks} />
      )}
    </div>
  );
};

export default AddPublicNetworkConfiguration;
