import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function EmptyUsers() {
  const { t } = useTranslation([
    'containers/add-user/empty-user',
    'containers/add-user',
  ]);

  const navigate = useNavigate();

  const { objectName } = useParams();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');

  const onCancel = () =>
    objectName ? navigate(`../?region=${region}`) : navigate(`..`);

  return (
    <OdsModal onOdsClose={onCancel} isOpen>
      <OdsText preset="heading-3">
        {t(
          'pci_projects_project_storages_containers_container_empty_user_title',
        )}
      </OdsText>

      <OdsText className="my-8">
        {t(
          'pci_projects_project_storages_containers_container_empty_user_description',
        )}
      </OdsText>

      <OdsButton
        slot="actions"
        onClick={onCancel}
        variant={ODS_BUTTON_VARIANT.outline}
        label={t(
          'containers/add-user:pci_projects_project_storages_containers_container_addUser_cancel_label',
        )}
      />
      <OdsButton
        slot="actions"
        onClick={() =>
          objectName ? navigate(`../../users`) : navigate(`../users`)
        }
        label={t(
          'pci_projects_project_storages_containers_container_empty_user_label',
        )}
      />
    </OdsModal>
  );
}
