import React from 'react';
import { useParams } from 'react-router-dom';
import { ServiceKeyEditNameModal } from '@/components/serviceKey/modals/ServiceKeyEditNameModal.component';
import Loading from '@/components/Loading/Loading';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';

const EditServiceKeyNameModal = () => {
  const { okmsId, keyId } = useParams();

  const { data, isLoading, error } = useOkmsServiceKeyById({ okmsId, keyId });

  if (isLoading) return <Loading />;

  // TODO: handle error
  if (error) return <div>{error.response.data.message}</div>;

  return (
    <ServiceKeyEditNameModal
      okmsId={okmsId}
      keyId={keyId}
      name={data.data.name}
    ></ServiceKeyEditNameModal>
  );
};

export default EditServiceKeyNameModal;
