import { Info } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'Complex badge',
  customComponentExemple: (
    <Badge>
      <div className="flex gap-2 items-center">
        <Info />
        <span>Badge with icon and badge</span>
        <Badge variant="success">12</Badge>
      </div>
    </Badge>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
