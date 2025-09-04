import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { formatTagsForApi } from '@/utils/formatTagsForApi';
import { useUpdateIamResources } from '@/data/hooks/useIamResources';
import { useResourcesDatagridContext } from '@/components/resourcesDatagrid/ResourcesDatagridContext';
import { TrackPageName } from '@/tracking.constant';

export type AssignTagTopbarProps = {
  tags: string[];
  onSuccessUrl?: string;
};

/** Should be use inside ResourceDatagridContext */
export default function AssignTagTopbar({
  tags,
  onSuccessUrl,
}: AssignTagTopbarProps) {
  const { t } = useTranslation('tag-manager');
  const { selectedResourcesList } = useResourcesDatagridContext();
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { mutate: updateResource } = useUpdateIamResources({
    onSuccess: () => {
      trackPage({
        pageName: TrackPageName.TAG_MANAGEMENT_ASSIGN_TAG,
        pageType: PageType.bannerSuccess,
      });
      navigate(onSuccessUrl);
    },
    onError: () => {
      trackPage({
        pageName: TrackPageName.TAG_MANAGEMENT_ASSIGN_TAG,
        pageType: PageType.bannerError,
      });
    },
  });

  const onClick = () => {
    trackClick({
      actionType: 'action',
      actions: ['datagrid', ButtonType.button, 'assign_tag'],
    });
    updateResource({
      resources: selectedResourcesList,
      tags: formatTagsForApi(tags),
    });
  };

  return (
    <ManagerButton
      id="assign-to-resource"
      label={t('assignToResources')}
      onClick={onClick}
      variant={ODS_BUTTON_VARIANT.default}
      icon={ODS_ICON_NAME.check}
      isDisabled={selectedResourcesList?.length === 0}
    />
  );
}
