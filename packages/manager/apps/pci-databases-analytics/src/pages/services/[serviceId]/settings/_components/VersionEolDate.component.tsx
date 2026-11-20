import { Badge } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useGetEnginesCapabilities } from '@/hooks/api/database/capabilities/useGetEnginesCapabilities.hook';

const VersionEolDate = () => {
  const { service, projectId } = useServiceData();
  const enginesCapabilitiesQuery = useGetEnginesCapabilities(projectId);
  const lifecycle = enginesCapabilitiesQuery.data
    ?.find((e) => e.name === service.engine)
    ?.versions.find((v) => v.name === service.version)?.lifecycle;
  if (!lifecycle) return null;

  const d = new Date(lifecycle.endOfLife);
  const diff = d.getTime() - Date.now();
  // only display the badge 6 months before the end of life
  if (diff > 6 * 30 * 24 * 60 * 60) return null;

  const flag = diff < 0;
  return (
    <Badge
      data-testid="version-eol-date"
      className="whitespace-nowrap ml-2"
      variant={flag ? 'critical' : 'warning'}
    >
      Fin de vie · {d.toLocaleDateString()}
    </Badge>
  );
};

export default VersionEolDate;
