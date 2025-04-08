import { Dispatch, SetStateAction } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsTile, OsdsText } from '@ovhcloud/ods-components/react';

import {
  selectedTileClass,
  tileClass,
} from '../UpdatePolicySelector.component';
import { NodePoolState } from '../NodePoolStep.component';

const DeploymentZone = ({
  setNodePoolState,
  selectedAvailibilityZone,
  availabilityZones,
}: {
  setNodePoolState: Dispatch<SetStateAction<NodePoolState>>;
  selectedAvailibilityZone: string;
  availabilityZones: string[];
}) => {
  const { t } = useTranslation('node-pool');

  return (
    <div>
      <OsdsText
        className="mb-4 font-bold block"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
      >
        {t('kube_common_node_pool_deploy_title')}
      </OsdsText>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('kube_common_node_pool_deploy_description', {})}
      </OsdsText>
      <div className="flex mt-8 gap-4">
        {availabilityZones?.map((zone) => (
          <OsdsTile
            data-testid={zone}
            role="button"
            key={zone}
            color={ODS_THEME_COLOR_INTENT.primary}
            className={clsx(
              tileClass,
              zone === selectedAvailibilityZone ? selectedTileClass : null,
              'selectedTileClass',
            )}
            onClick={() =>
              setNodePoolState((state) => ({
                ...state,
                availibilityZones: zone,
              }))
            }
            inline
          >
            <OsdsText
              className="block w-[20rem]"
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(`${zone}`, {
                ns: 'service',
              })}
            </OsdsText>
          </OsdsTile>
        ))}
      </div>
    </div>
  );
};

export default DeploymentZone;
