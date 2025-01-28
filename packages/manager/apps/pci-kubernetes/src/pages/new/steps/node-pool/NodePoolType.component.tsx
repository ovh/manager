import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { FlavorSelector, KubeFlavor } from '@ovh-ux/manager-pci-common';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

export interface NodeTypeStepProps {
  projectId: string;
  region: string;

  onFlavorChange: Dispatch<SetStateAction<KubeFlavor | null>>;
}

export default function NodePoolType({
  projectId,
  region,
  onFlavorChange,
}: Readonly<NodeTypeStepProps>) {
  const { t: tAddForm } = useTranslation('add-form');

  return (
    <div>
      <OsdsText
        className="mb-4 font-bold block"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
      >
        {tAddForm('kube_common_node_pool_model_type_selector')}
      </OsdsText>
      <FlavorSelector
        projectId={projectId}
        region={region}
        onSelect={onFlavorChange}
      />
    </div>
  );
}
