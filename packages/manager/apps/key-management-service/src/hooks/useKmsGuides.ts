import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { GuideItem } from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type GuideLinks = Record<string, GuideItem[]>;

export function useKmsGuides() {
  const { ovhSubsidiary } = useEnvironment().getUser();
  const { t } = useTranslation('key-management-service/guide');
  const [kmsGuides, setKmsGuides] = useState<GuideItem[]>([]);

  const KMS_GUIDES: GuideLinks = {
    FR: [
      {
        id: 1,
        href:
          'https://help.ovhcloud.com/csm/fr-documentation-manage-operate?id=kb_browse_cat&kb_id=3d4a8129a884a950f07829d7d5c75243',
        target: OdsHTMLAnchorElementTarget._blank,
        label: t('guides_header_find_out_more'),
      },
    ],
    DEFAULT: [
      {
        id: 1,
        href:
          'https://help.ovhcloud.com/csm/en-gb-documentation-manage-operate?id=kb_browse_cat&kb_id=3d4a8129a884a950f07829d7d5c75243',
        target: OdsHTMLAnchorElementTarget._blank,
        label: t('guides_header_find_out_more'),
      },
    ],
  };

  useEffect(() => {
    setKmsGuides(KMS_GUIDES[ovhSubsidiary] ?? KMS_GUIDES.DEFAULT);
  }, [ovhSubsidiary]);

  return { kmsGuides, kmsOnboardingGuide: kmsGuides[0] };
}
