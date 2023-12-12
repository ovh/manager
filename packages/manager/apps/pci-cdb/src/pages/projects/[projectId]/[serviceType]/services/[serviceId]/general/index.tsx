import { UseQueryResult } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { database } from '@/models/database';
import ServiceMeter from './_components/meter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequiredParams } from '@/hooks/useRequiredParams';

export const Handle = {
  breadcrumb: () => 'Dashboard',
};

export default function ServiceDashboardPage() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const serviceQuery = useOutletContext() as UseQueryResult<
    database.Service,
    Error
  >;
  return (
    <>
      {serviceQuery.isLoading ? (
        <p>Loading service</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 items-start">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <b>Name: </b>
                {serviceQuery.data?.description}
              </p>
              <p>
                <b>Engine: </b>
                {serviceQuery.data?.engine}
              </p>
              <p>
                <b>Plan: </b>
                {serviceQuery.data?.plan}
              </p>
              <p>
                <b>Flavor: </b>
                {serviceQuery.data?.flavor}
              </p>
              <p>
                <b>Region: </b>
                {serviceQuery.data?.region}
              </p>
              <p>
                <b>Creation: </b>
                {serviceQuery.data?.createdAt}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceMeter
                projectId={projectId!}
                service={serviceQuery.data!}
                metric="cpu_usage_percent"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceMeter
                projectId={projectId!}
                service={serviceQuery.data!}
                metric="disk_usage_percent"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
