import { useNavigate, useParams } from 'react-router-dom';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import DeleteS3 from '../../../_components/storages/DeleteS3.component';

const DeleteS3Modal = () => {
  const { projectId, storageId, region } = useParams<{
    projectId: string;
    storageId: string;
    region: string;
  }>();
  const navigate = useNavigate();
  const s3Query = useGetS3({
    projectId,
    region,
    name: storageId,
  });

  return <DeleteS3 onSuccess={() => navigate('../')} s3={s3Query.data} />;
};

export default DeleteS3Modal;
