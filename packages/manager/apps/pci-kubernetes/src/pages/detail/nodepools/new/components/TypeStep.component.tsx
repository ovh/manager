import { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import {
  FlavorSelector,
  TComputedKubeFlavor,
} from '@/components/flavor-selector/FlavorSelector.component';

type TTypeStepProps = {
  projectId: string;
  region: string;
  onFlavorSelect: (flavor: TComputedKubeFlavor) => void;
};

export default function TypeStep({
  projectId,
  region,
  onFlavorSelect,
}: TTypeStepProps): ReactElement {
  const { t } = useTranslation(['common', 'add-form']);

  return (
    <>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
      >
        {t('add-form:kubernetes_add_node_pool_description')}
      </OsdsText>
      <br />
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
      >
        {t('add-form:kubernetes_add_node_pool_node_type')}
      </OsdsText>
      <FlavorSelector projectId={projectId} region={region} onSelect={onFlavorSelect} />
    </>
  );
}
