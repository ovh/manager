import { useContext } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, ICON_NAME, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { CHANGE_OWNER_LINK } from '@/constants';
import {
  useGetServiceDetails,
  useGetServiceInfos,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

export default function Contacts() {
  const { serviceId } = useParams();
  const { data } = useGetServiceInfos(serviceId);
  const { data: serviceDetails } = useGetServiceDetails(data?.serviceId);

  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.DASHBOARD]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const changeOwnerLink =
    CHANGE_OWNER_LINK[ovhSubsidiary as keyof typeof CHANGE_OWNER_LINK] ?? CHANGE_OWNER_LINK.DEFAULT;
  const handleChangeOwnerClick = () => {
    window.open(changeOwnerLink, '_blank');
  };
  const handleManageContactsClick = async () => {
    const fetchedUrl = (await context.shell.navigation?.getURL('account', '/contacts/services', {
      serviceName: serviceId,
      category: 'HOSTING',
    })) as string;
    window.location.href = fetchedUrl;
  };

  const items = [
    {
      id: 1,
      onClick: handleManageContactsClick,
      label: t('video_manager_service_manage_contacts'),
    },
    {
      id: 2,
      onClick: handleChangeOwnerClick,
      label: t('video_manager_service_change_owner'),
    },
  ];

  return (
    <div className="flex flex-row pt-4">
      <div>
        <Text preset={TEXT_PRESET.heading6}>{t(`${NAMESPACES.DASHBOARD}:contacts`)}</Text>
        <Text>{t('video_manager_ga')}</Text>
        {serviceDetails?.customer?.contacts?.map((contact) => (
          <Text key={contact?.customerCode}>
            {t('video_manager_service_contact', {
              customerCode: contact?.customerCode,
              type: contact?.type,
            })}
          </Text>
        ))}
      </div>
      <div className="ml-auto">
        <ActionMenu
          id={'video-manager-subscription-actions'}
          items={items}
          isDisabled
          isCompact
          variant={BUTTON_VARIANT.outline}
          icon={ICON_NAME.ellipsisVertical}
        />
      </div>
    </div>
  );
}
