import { Trans, useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link } from '@ovhcloud/ods-react';
import { useForm } from 'react-hook-form';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TAttachedInstance } from '@/api/select/instances';
import { useDetachVolume } from '@/api/hooks/useVolume';
import { RetypeConfirmActionForm } from '@/pages/retype/RetypeConfirmActionForm.component';

type RetypeDetachInstanceProps = {
  instance: TAttachedInstance;
  projectId: string;
  volumeId: string;
};

export const RetypeDetachInstance: FC<RetypeDetachInstanceProps> = ({
  instance,
  projectId,
  volumeId,
}) => {
  const { t } = useTranslation(['retype', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const blockListingHref = useHref('..');

  const {
    detachVolume,
    isPending: isDetachPending,
    isError: isDetachingError,
  } = useDetachVolume();

  const handleOnClose = () => {
    navigate('..');
  };

  const handleOnSubmit = () =>
    detachVolume({
      projectId,
      volumeId,
      instanceId: instance.id,
    });

  return (
    <RetypeConfirmActionForm
      warningMessage={t(
        'retype:pci_projects_project_storages_blocks_retype_detach_volume',
        {
          instance: instance.name,
        },
      )}
      confirmWord="DETACH"
      errorElement={
        <Trans
          i18nKey="pci_projects_project_storages_blocks_retype_detach_volume_error"
          ns="retype"
          components={[
            <Link
              key="0"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={blockListingHref}
              className="inline"
            />,
          ]}
        />
      }
      onSubmit={handleOnSubmit}
      onClose={handleOnClose}
      isPending={isDetachPending}
      isError={isDetachingError}
    />
  );
};
