import { StoryResult } from '../Stories';
import { Button } from '@/components/ui/button';
import Link from '@/components/links/Link.component';

export default {
  story: 'Button acting like a link',
  customComponentExemple: (
    <Button asChild>
      <Link to="" className="hover:no-underline hover:text-primary-foreground">
        This is a button acting like a link
      </Link>
    </Button>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
