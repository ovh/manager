import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { Translation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { PAGE_PREFIX } from '@/tracking.constants';
import { downloadObject, downloadStandardS3Object } from '@/api/data/objects';

export default function DownloadObjectPage() {
  const { projectId, storageId } = useParams();
  const [searchParams] = useSearchParams();
  const { tracking } = useContext(ShellContext).shell;
  const { addError } = useNotifications();

  /**
   * TODO
   * Waiting for the objet type,
   * and this function should be implemented on action menu of object datagrid
   */
  const handleObjectDownload = (object) => {
    tracking.trackClick({
      name: `${PAGE_PREFIX}object::download-file`,
      type: 'action',
    });

    let downloadPromise = null;

    if (object.s3StorageType) {
      downloadPromise = downloadStandardS3Object(
        projectId,
        searchParams.get('region'),
        storageId,
        object,
      );
    } else {
      downloadPromise = downloadObject(projectId, storageId, object);
    }

    return downloadPromise
      .then((url: string) => {
        window.top.location = url;
      })
      .catch((error: ApiError) =>
        addError(
          <Translation ns="objects">
            {(_t) =>
              _t(
                `pci_projects_project_storages_containers_container_object_error_download`,
                {
                  message:
                    error?.response?.data?.message || error?.message || null,
                },
              )
            }
          </Translation>,
          true,
        ),
      );
  };

  return <></>;
}
