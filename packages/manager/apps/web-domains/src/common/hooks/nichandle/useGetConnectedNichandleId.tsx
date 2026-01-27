import { useNichandleInformation } from './useNichandleInformation';

export const useGetConnectedNichandleId = () => {
  const { nichandleInformation } = useNichandleInformation();
  return { nichandle: nichandleInformation?.auth?.account ?? nichandleInformation?.nichandle ?? '' };
};
