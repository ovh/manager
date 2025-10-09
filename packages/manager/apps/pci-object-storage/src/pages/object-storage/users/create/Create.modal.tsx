import { useNavigate } from 'react-router-dom';
import RouteModal from '@/components/route-modal/RouteModal';
import AddUserForm from './AddUserForm.component';

const CreateUser = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('../');
  };

  return (
    <RouteModal>
      <AddUserForm onClose={handleClose} /> 
    </RouteModal>
  );
};

export default CreateUser;
