import { useServiceData } from '../serviceData.hook';
import ServiceMeter from './_components/meter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Handle = {
  breadcrumb: () => 'Dashboard',
};

export default function ServiceDashboardPage() {
  const { projectId, service } = useServiceData();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <b>Name: </b>
              {service.description}
            </p>
            <p>
              <b>Engine: </b>
              {service.engine}
            </p>
            <p>
              <b>Plan: </b>
              {service.plan}
            </p>
            <p>
              <b>Flavor: </b>
              {service.flavor}
            </p>
            <p>
              <b>Region: </b>
              {service.region}
            </p>
            <p>
              <b>Creation: </b>
              {service.createdAt}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceMeter
              projectId={projectId}
              service={service}
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
              projectId={projectId}
              service={service}
              metric="disk_usage_percent"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
