import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';

import { Trans, useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepState } from '@/pages/new/hooks/useStep';
import {
  TVolumeModel,
  useVolumeEncryptions,
  useVolumeModels,
} from '@/api/hooks/useCatalog';
import { TRegion } from '@/api/data/regions';
import { MULTI_ATTACH_INFO_URL } from '@/constants';
import { Encryption } from '@/components/Encryption';
import { EncryptionType } from '@/api/select/volume';
import ExternalLink from '@/components/ExternalLink';
import { Button } from '@/components/button/Button';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';

export interface VolumeTypeStepProps {
  projectId: string;
  region: TRegion;
  step: StepState;
  onSubmit: (
    volumeType: TVolumeModel['name'],
    showAvailabilityZones: boolean,
    encryption: EncryptionType | null,
  ) => void;
}

export function VolumeTypeStep({
  projectId,
  region,
  step,
  onSubmit,
}: Readonly<VolumeTypeStepProps>) {
  const { t } = useTranslation(['stepper', 'add', 'common']);
  const { data } = useVolumeModels(projectId, region.name);
  const { defaultValue: encryptionDefaultValue } = useVolumeEncryptions();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const [volumeModel, setVolumeModel] = useState<TVolumeModel>(undefined);
  const [encryptionType, setEncryptionType] = useState<EncryptionType | null>(
    null,
  );

  useEffect(() => {
    if (volumeModel)
      setEncryptionType(volumeModel.encrypted ? encryptionDefaultValue : null);
  }, [volumeModel]);

  const attachGuideLink =
    MULTI_ATTACH_INFO_URL[ovhSubsidiary] || MULTI_ATTACH_INFO_URL.DEFAULT;

  return (
    <>
      <VolumeModelTilesInput
        value={volumeModel}
        volumeModels={data}
        onChange={setVolumeModel}
        label=""
        locked={step.isLocked}
      />
      {volumeModel?.shouldUseMultiAttachFileSystem && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.warning}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            hue={ODS_TEXT_COLOR_HUE._700}
          >
            <Trans
              t={t}
              i18nKey="add:pci_projects_project_storages_blocks_add_type_multi_attach_banner"
              components={{
                Link: (
                  <ExternalLink href={attachGuideLink} isTargetBlank={false} />
                ),
              }}
            />
          </OsdsText>
        </OsdsMessage>
      )}
      {volumeModel?.encrypted && (
        <Encryption
          encryptionType={encryptionType}
          onChange={setEncryptionType}
          title={t('common:pci_projects_project_storages_blocks_new')}
          description={t(
            'add:pci_projects_project_storages_blocks_add_encryption_description',
          )}
          isNew
        />
      )}
      {volumeModel && !step.isLocked && (
        <div className="mt-8">
          <Button
            size="md"
            color="primary"
            onClick={() =>
              onSubmit(
                volumeModel.name,
                volumeModel.showAvailabilityZones,
                encryptionType,
              )
            }
            actionName="select_volume_add"
            actionValues={[volumeType.name]}
            className="w-fit"
          >
            {t('common_stepper_next_button_label')}
          </Button>
        </div>
      )}
    </>
  );
}
