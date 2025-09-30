import { FC } from 'react';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { TFlavorTypeTag } from '@/types/instance/common.type';

type TFlavorTagProps = {
  tag: TFlavorTypeTag;
};

const getBadgeColor = (tag: TFlavorTypeTag) => {
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

const FlavorTypeTag: FC<TFlavorTagProps> = ({ tag }) => (
  <Badge color={getBadgeColor(tag)}>{tag}</Badge>
);

export default FlavorTypeTag;
