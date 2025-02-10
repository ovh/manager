import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { FlavorSelector, KubeFlavor } from '@ovh-ux/manager-pci-common';
import { OsdsText } from '@ovhcloud/ods-components/react';

import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';

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
        className="ml-4 font-bold"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {tAddForm('kubernetes_add_node_pool_node_type')}
      </OsdsText>
      <FlavorSelector
        projectId={projectId}
        region={region}
        onSelect={onFlavorChange}
      />
    </div>
  );
}
