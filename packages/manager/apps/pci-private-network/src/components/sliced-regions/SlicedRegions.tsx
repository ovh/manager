import {
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { FC, useMemo } from 'react';

const SlicedRegions: FC<{ regions: string[]; length: number }> = ({
  regions,
  length,
}) => {
  const { formattedRegion, slicedText } = useMemo(
    () => ({
      formattedRegion: regions.join(', '),
      slicedText:
        regions.length > length
          ? regions
              .slice(0, length)
              .concat('...')
              .join(', ')
          : '',
    }),
    [regions, length],
  );

  return slicedText ? (
    <OsdsTooltip>
      {slicedText}
      <OsdsTooltipContent slot="tooltip-content">
        {formattedRegion}
      </OsdsTooltipContent>
    </OsdsTooltip>
  ) : (
    formattedRegion
  );
};

export default SlicedRegions;
