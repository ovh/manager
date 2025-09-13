import { useSearchParams } from 'react-router-dom';

export const useSapSearchParams = () => {
  const [searchParams] = useSearchParams();

  return {
    serviceName: searchParams.get('serviceName'),
    taskId: searchParams.get('taskId'),
  };
};
