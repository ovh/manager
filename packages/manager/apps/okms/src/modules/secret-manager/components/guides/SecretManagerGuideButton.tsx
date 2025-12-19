import { GuideButton } from '@ovh-ux/manager-react-components';

import { useGuideItemKv2Api } from './guide-kv2-api/useGuideItemKv2Api';
import { useGuideItemManager } from './guide-manager/useGuideItemManager';
import { useGuideItemRestApi } from './guide-rest-api/useGuideItemRestApi';

export const SecretManagerGuidesButton = () => {
  const guideItemManager = useGuideItemManager(0);
  const guideItemKv2Api = useGuideItemKv2Api(1);
  const guideItemRestApi = useGuideItemRestApi(2);

  return <GuideButton items={[guideItemManager, guideItemKv2Api, guideItemRestApi]} />;
};
