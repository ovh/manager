import { useGuideContext } from './useGuide.context';

/**
 * Hook to access the guide context and control the guided tour
 * @returns Guide context with navigation and state management
 */
export const useGuide = () => {
  return useGuideContext();
};

export default useGuide;

