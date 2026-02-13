import { useNavigate, useSearchParams } from 'react-router-dom';
import RestoreServiceModal from './RestoreService.component';

const RestoreModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const backUrl = `../?${searchParams.toString()}`;

  const onNavigateBack = () => navigate(backUrl);

  return (
    <RestoreServiceModal backUrl={backUrl} onNavigateBack={onNavigateBack} />
  );
};

export default RestoreModal;
