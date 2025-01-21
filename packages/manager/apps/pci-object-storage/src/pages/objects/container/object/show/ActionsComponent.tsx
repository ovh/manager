import { v6 } from '@ovh-ux/manager-core-api';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { addWeeks } from 'date-fns';
import { OPENIO_PRESIGN_EXPIRE, TRACKING_PREFIX } from '@/constants';
import { TObject } from '@/api/data/container';
import { TContainer } from '@/pages/objects/container/object/show/Show.page';

type TIndexedObject = TObject & { index: string };

export default function ActionsComponent({
  object,
  container,
  isLocalZone,
}: Readonly<{
  object: TIndexedObject;
  container: TContainer;
  isLocalZone: boolean;
}>) {
  const { t } = useTranslation('container');

  const [searchParams] = useSearchParams();

  const { trackClick } = useTracking();
  const navigate = useNavigate();

  const { projectId } = useParams();

  const download = async () => {
    trackClick({
      name: `${TRACKING_PREFIX}object::download-file`,
      type: 'action',
    });

    if (container.s3StorageType) {
      const url = `/cloud/project/${projectId}/region/${container.region}/${container.s3StorageType}/${container.name}/presign`;
      const options = {
        expire: OPENIO_PRESIGN_EXPIRE,
        method: 'GET',
        object: object.key,
      };

      const { data } = await v6.post<{ url: string }>(url, options);

      window.location.href = data.url;
    } else {
      const expirationDate = addWeeks(new Date(), 1).toISOString();
      const url = `/cloud/project/${projectId}/storage/${container.id}/publicUrl`;
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
        onClick: () => {
          navigate(
            `./${encodeURIComponent(
              object.name || object.key,
            )}/addUser?region=${searchParams.get('region')}`,
          );
        },
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
          `./${encodeURIComponent(object.name || object.key)}/delete?region=${
            container.region
          }`,
        );
      },
    },
  ].filter(Boolean);

  return <ActionMenu id={object.index} items={items} isCompact />;
}
