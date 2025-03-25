import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllDomainAttachedToAllDom,
  getAllDomProperty,
  getallDomService,
} from '@/alldoms/data/api/web-domains';
import { TServiceDetail, TServiceProperty } from '@/alldoms/types';
import { urls } from '@/alldoms/routes/routes.constant';

interface UseGetDatagridServiceInfoListProps {
  readonly domainList: TServiceProperty[];
}

export const useGetDatagridServiceInfoList = ({
  domainList,
}: UseGetDatagridServiceInfoListProps) => {
  const [serviceInfoList, setServiceInfoList] = useState<TServiceDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceInfoDetail: TServiceDetail[] = await Promise.all(
          domainList.map(async (serviceName: TServiceProperty) => {
            const allDomProperty = await getAllDomProperty(serviceName.name);
            const serviceInfo = await getallDomService(serviceName.name);
            const domainAttached = await getAllDomainAttachedToAllDom(
              serviceName.name,
            );

            return {
              allDomProperty,
              serviceInfo,
              domainAttached,
            };
          }),
        );
        setServiceInfoList(serviceInfoDetail);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [domainList]);

  return { serviceInfoList, isLoading };
};
