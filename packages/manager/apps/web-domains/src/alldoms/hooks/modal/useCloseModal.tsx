import { useLocation, useNavigate } from 'react-router-dom';

export function useCloseModal() {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    const removeSuffixFromOriginalPath = location.pathname.replace(
      /\/terminate(?:\/cancel)?(\/[^/]*)?$/,
      '',
    );
    navigate(removeSuffixFromOriginalPath, { replace: true });
  };
}
