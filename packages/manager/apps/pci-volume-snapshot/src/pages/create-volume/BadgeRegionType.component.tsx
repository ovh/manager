import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import { TRegion } from '@ovh-ux/manager-react-components';

export type BadgeRegionTypeProps = {
  regionType: TRegion['type'];
};

export default function BadgeRegionType({
  regionType,
}: Readonly<BadgeRegionTypeProps>) {
  // FIXME: find why React's useId do not work here.
  const triggerId = 'badge-region-type_trigger';
  const label = `Local Zone (${regionType as string})`;
  const tooltipContent = (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at beatae
      eligendi enim ex in ipsam laboriosam minima nemo, nihil possimus
      praesentium quam qui quisquam, ratione sit sunt unde vitae?
    </p>
  );
  return (
    <>
      <div id={triggerId}>
        <OdsButton
          className="badge-region-type"
          icon="circle-question"
          size="sm"
          variant="ghost"
          label={label}
        />
      </div>
      <OdsPopover triggerId={triggerId} position="bottom-end">
        {tooltipContent}
      </OdsPopover>
    </>
  );
}
