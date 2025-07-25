import { useQuery } from '@tanstack/react-query';
import { getCreditBalance, getStartupProgram } from '../api/credit';

export const useIsStartupProgramAvailable = () => {
  return useQuery({
    queryKey: ['/me/credit/balance'],
    queryFn: getCreditBalance,
    select: (data) => data.includes('STARTUP_PROGRAM'),
  });
};

export const useStartupProgram = (isAvailable: boolean) => {
  return useQuery({
    queryKey: ['/me/credit/balance/STARTUP_PROGRAM'],
    queryFn: getStartupProgram,
    enabled: isAvailable,
  });
};
