import { useNavigate } from 'react-router-dom';
import RestoreServiceModal from '../object/restore/RestoreService.component';

const RestoreModal = () => {
  const navigate = useNavigate();

  const onNavigateBack = () => {
    navigate('../');
  };

  return <RestoreServiceModal backUrl="../" onNavigateBack={onNavigateBack} />;
};

export default RestoreModal;
