import React from 'react';
import { GuideButton } from '@ovh-ux/manager-react-components';
import { useGuideItemManager } from './guide-manager/useGuideItemManager';
import { useGuideItemKV2Api } from './guide-KV2-api/useGuideItemKV2Api';
import { useGuideItemRestApi } from './guide-rest-api/useGuideItemRestApi';

export const SecretManagerGuidesButton = () => {
  const guideItemManager = useGuideItemManager(0);
  const guideItemKV2Api = useGuideItemKV2Api(1);
  const guideItemRestApi = useGuideItemRestApi(2);

  return (
    <GuideButton
      items={[guideItemManager, guideItemKV2Api, guideItemRestApi]}
    />
  );
};
