import { Badge } from '@ovhcloud/ods-react';

type RegionCertificationBadgesProps = {
  certifications: string[];
};

export const RegionCertificationBadges = ({ certifications }: RegionCertificationBadgesProps) => {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {certifications.map((certification) => (
        <Badge key={certification} color="neutral" size="sm">
          {formatLabel(certification)}
        </Badge>
      ))}
    </div>
  );
};

/**
 * Certifications labels are not translated
 * But they come with underscores instead of dashes
 */
const formatLabel = (label: string) => {
  return label.replace('_', '-');
};
