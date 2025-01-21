import { StoryResult } from '../Stories';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default {
  story: 'Simple toast',
  customComponentExemple: () => {
    const toast = useToast();
    return (
      <Button
        size="sm"
        onClick={() =>
          toast.toast({
            description: 'Hello world',
          })
        }
      >
        Trigger toast
      </Button>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
