import { useNavigate } from 'react-router-dom';

export const useActionClick = () => {
  const navigate = useNavigate();
  return (link: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };
};
