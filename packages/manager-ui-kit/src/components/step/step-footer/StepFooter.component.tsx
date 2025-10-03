import { useContext } from 'react';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { StepContext } from '../StepContext';
import { StepProps } from '../Step.props';

export const StepFooter = () => {
  const { id, next, locked, skip } = useContext<StepProps>(StepContext);

  return (
    <div className="flex items-center gap-6 mt-6">
      {next?.action && !locked && (
        <Button
          data-testid="next-cta"
          size={BUTTON_SIZE.md}
          onClick={() => {
            next.action(id as string);
          }}
          className="w-fit"
          disabled={next.disabled || undefined}
        >
          {next.label}
        </Button>
      )}
      {skip?.action && (
        <Button
          variant={BUTTON_VARIANT.ghost}
          size={BUTTON_SIZE.md}
          onClick={() => {
            skip.action(id as string);
          }}
          className="w-fit"
          disabled={skip.disabled || undefined}
        >
          {skip.label}
        </Button>
      )}
    </div>
  );
};

export default StepFooter;
