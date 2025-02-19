import { StoryResult } from '../Stories';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';

export default {
  story: 'With action',
  customComponentExemple: () => {
    const toast = useToast();
    return (
      <Button
        size="sm"
        onClick={() =>
          toast.toast({
            title: 'My toast',
            description: 'Hello world',
            action: <ToastAction altText="Try again">Try again</ToastAction>,
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
