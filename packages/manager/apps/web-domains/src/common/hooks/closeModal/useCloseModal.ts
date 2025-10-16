import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to close a modal by navigating back to the background location
 * @returns A function to close the modal
 */
export const useCloseModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => {
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation);
    } else {
      navigate(-1);
    }
  };

  return closeModal;
};
