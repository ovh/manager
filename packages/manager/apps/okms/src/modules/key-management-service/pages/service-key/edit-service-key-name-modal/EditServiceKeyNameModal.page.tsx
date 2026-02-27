import { useNavigate } from 'react-router-dom';

import { useOkmsServiceKeyById } from '@key-management-service/data/hooks/useOkmsServiceKeys';

import Loading from '@/common/components/loading/Loading';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { EditServiceKeyNameModal } from './EditServiceKeyNameModal.component';

export const EditServiceKeyNameModalPage = () => {
  const { okmsId, keyId } = useRequiredParams('okmsId', 'keyId');
  const navigate = useNavigate();

  const { data, isLoading, error } = useOkmsServiceKeyById({ okmsId, keyId });

  const closeModal = () => navigate('..');

  if (error) {
    return <div>{error.response.data.message}</div>;
  }

  if (isLoading || !data?.name) {
    return <Loading />;
  }

  return (
    <EditServiceKeyNameModal
      initialName={data.name}
      okmsId={okmsId}
      keyId={keyId}
      onClose={closeModal}
      onSuccess={closeModal}
    />
  );
};

export default EditServiceKeyNameModalPage;
