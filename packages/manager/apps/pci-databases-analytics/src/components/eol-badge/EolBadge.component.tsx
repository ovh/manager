import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useGetEnginesCapabilities } from '@/hooks/api/database/capabilities/useGetEnginesCapabilities.hook';

interface EolBadgeProps {
  engine: database.EngineEnum;
  version: string;
}

const EolBadge = ({ engine, version }: EolBadgeProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-databases-analytics/components/eol-badge');
  const enginesCapabilitiesQuery = useGetEnginesCapabilities(projectId);
  const lifecycle = enginesCapabilitiesQuery.data
    ?.find((e) => e.name === engine)
    ?.versions.find((v) => v.name === version)?.lifecycle;
  console.log(lifecycle);
  if (!lifecycle) return null;

  const d = new Date(lifecycle.endOfLife);
  const diff = d.getTime() - Date.now();
  // only display the badge 6 months before the end of life
  if (diff > 6 * 30 * 24 * 60 * 60) return null;

  const res = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return (
    <Badge
      data-testid="eol-badge"
      className="whitespace-nowrap"
      variant="warning"
    >
      {t('eolBadgeLabel', { days: res })}
    </Badge>
  );
};

export default EolBadge;
