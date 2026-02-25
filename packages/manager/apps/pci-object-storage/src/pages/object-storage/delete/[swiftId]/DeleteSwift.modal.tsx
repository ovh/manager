import { useNavigate, useParams } from 'react-router-dom';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';
import DeleteSwift from '../../_components/storages/DeleteSwift.component';

const DeleteSwiftModal = () => {
  const { projectId, swiftId } = useParams<{
    projectId: string;
    swiftId: string;
  }>();
  const navigate = useNavigate();
  const swiftQuery = useGetSwift({
    projectId,
    containerId: swiftId,
    noObjects: true,
  });

  return (
    <DeleteSwift
      swiftId={swiftId}
      onSuccess={() => navigate('../')}
      swift={swiftQuery.data}
    />
  );
};

export default DeleteSwiftModal;
