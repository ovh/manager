import { FC } from 'react';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { TFlavorTag } from '@/types/instance/common.type';

type TFlavorTagProps = {
  tag: TFlavorTag;
};

const getBadgeColor = (tag: TFlavorTag) => {
  switch (tag) {
    case 'savings_plan':
      return BADGE_COLOR.promotion;
    case 'new':
      return BADGE_COLOR.new;
    case 'coming_soon':
      return BADGE_COLOR.neutral;
    default:
      return BADGE_COLOR.information;
  }
};

const FlavorTag: FC<TFlavorTagProps> = ({ tag }) => (
  <Badge color={getBadgeColor(tag)}>{tag}</Badge>
);

export default FlavorTag;
