import { v6 } from '@ovh-ux/manager-core-api';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useHref, useNavigate, useSearchParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { addWeeks } from 'date-fns';
import { OPENIO_PRESIGN_EXPIRE, TRACKING_PREFIX } from '@/constants';
import { TObject } from '@/api/data/container';
import { TContainer } from '@/pages/objects/container/object/show/Show.page';

export default function ActionsComponent({
  object,
  container,
  isLocalZone,
}: {
  object: TObject;
  container: TContainer;
  isLocalZone: boolean;
}) {
  const { t } = useTranslation('container');

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const addUserHref = useHref(`./addUser?region=${searchParams.get('region')}`);

  const { trackClick } = useTracking();

  const { data: project } = useProject();

  const download = async () => {
    trackClick({
      name: `${TRACKING_PREFIX}object::download-file`,
      type: 'action',
    });

    if (container.s3StorageType) {
      const url = `/cloud/project/${project?.project_id}/region/${container.region}/${container.s3StorageType}/${container.name}/presign`;
      const options = {
        expire: OPENIO_PRESIGN_EXPIRE,
        method: 'GET',
        object: object.key,
      };

      const { data } = await v6.post<{ url: string }>(url, options);

      window.location.href = data.url;
    } else {
      const expirationDate = addWeeks(new Date(), 1).toISOString();
      const url = `/cloud/project/${project?.project_id}/storage/${container.name}/publicUrl`;
      const options = {
        expirationDate,
        objectName: object.name,
      };
      const { data } = await v6.post<{ getURL: string }>(url, options);
      window.open(data.getURL, '_blank');
    }
  };

  const items = [
    container.s3StorageType &&
      !isLocalZone && {
        id: 0,
        label: t(
          'pci_projects_project_storages_containers_container_add_user_label',
        ),
        href: addUserHref,
      },
    {
      id: 1,
      label: t(
        'pci_projects_project_storages_containers_container_download_label',
      ),
      onClick: download,
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_container_delete_label',
      ),
      onClick: () => {
        navigate(
          `./${object.name || object.name}/delete?region=${container.region}`,
        );
      },
    },
  ].filter(Boolean);

  return <ActionMenu items={items} isCompact />;
}
