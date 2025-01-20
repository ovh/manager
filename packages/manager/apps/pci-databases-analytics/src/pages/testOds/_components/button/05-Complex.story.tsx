import { Info } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'Complex button',
  customComponentExemple: (
    <Button>
      <div className="flex gap-2">
        <Info />
        <span>Button with icon and badge</span>
        <Badge variant="success">12</Badge>
      </div>
    </Button>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
