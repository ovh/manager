import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getZimbraPlatformList } from '@/api/GET/apiv2/services';

export const usePlatform = () => {
  const [platformId, setPlatformId] = useState('');
  const { data }: any = useQuery({
    queryKey: ['get/zimbra/platform'],
    queryFn: () => getZimbraPlatformList(),
  });
  useEffect(() => {
    if (data && data.length > 0) {
      setPlatformId(data[0].id);
    }
  }, []);
  return { platformId };
};
