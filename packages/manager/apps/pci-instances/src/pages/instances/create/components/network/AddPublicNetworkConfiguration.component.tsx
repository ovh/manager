import { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Text,
  Toggle,
  ToggleCheckedChangeDetail,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';
import { selectPublicNetworkConfig } from '../../view-models/networksViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import PublicIpConfiguration from './PublicIpConfiguration.component';

const AddPublicNetworkConfiguration: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [networkId, microRegion, ipPublicType] = useWatch({
    control,
    name: ['networkId', 'microRegion', 'ipPublicType'],
  });
  const configurations = useMemo(
    () => selectPublicNetworkConfig(networkId, microRegion),
    [networkId, microRegion],
  );

  const initializePublicIpFields = useCallback(() => {
    if (!configurations) return;

    if (!configurations.basicPublicIp.isDisabled) {
      setValue('ipPublicType', 'basicIp');
    } else if (!configurations.floatingIp.isDisabled) {
      setValue('ipPublicType', 'floatingIp');
      setValue('floatingIpAssignment', 'createNew');
    }
  }, [configurations, setValue]);

  const handleAssignPublicIp = ({ checked }: ToggleCheckedChangeDetail) => {
    if (!checked) {
      setValue('ipPublicType', null);
      setValue('floatingIpAssignment', null);
      setValue('existingFloatingIp', null);
    } else initializePublicIpFields();
  };

  useEffect(() => {
    initializePublicIpFields();
  }, [configurations, initializePublicIpFields]);

  if (!configurations) return null;

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
      {!!ipPublicType && <PublicIpConfiguration />}
    </div>
  );
};

export default AddPublicNetworkConfiguration;
