import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

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
        <OdsBadge
          key={certification}
          label={formatLabel(certification)}
          color={ODS_BADGE_COLOR.neutral}
          className="[&::part(badge)]:bg-[--ods-color-neutral-100]"
          size="sm"
        />
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
