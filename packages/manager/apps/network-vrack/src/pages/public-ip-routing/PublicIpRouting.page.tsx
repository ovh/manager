import { Suspense } from 'react';

import { Outlet, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Text } from '@ovhcloud/ods-react';

import { RegionTiles } from '@/components/region-tiles/RegionTiles';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function PublicIpRouting() {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const { serviceName } = useParams<{ serviceName: string }>();

  return (
    <div>
      <div className="mb-4">
        <Text className="mb-2" preset="paragraph">
          {t('publicIpRouting_purpose')}
        </Text>
        <Text className="mb-2" preset="paragraph">
          {t('publicIpRouting_explanation')}
        </Text>
        <Text className="mb-2" preset="paragraph">
          <Text className="align-bottom font-semibold" preset="span">
            <Icon name={ICON_NAME.circleInfo} className="align-bottom leading-none" />
          </Text>
          <Text className="align-bottom font-semibold leading-none" preset="span">
            {t('publicIpRouting_note_label')}
          </Text>
          <Text className="ml-2 align-bottom leading-none" preset="span">
            {t('publicIpRouting_note_value')}
          </Text>
        </Text>
      </div>
      {serviceName && (
        <div className="w-full">
          <RegionTiles serviceName={serviceName} />
        </div>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
