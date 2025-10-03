import { useContext } from 'react';
import { clsx } from 'clsx';
import { Button, BUTTON_VARIANT, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { StepContext } from '../StepContext';
import { StepProps } from '../Step.props';

export const StepHeader = () => {
  const { id, title, edit, locked, open, skip } =
    useContext<StepProps>(StepContext);
  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={clsx(
          'font-normal leading-[43px] flex p-0 m-0 w-full md:w-5/6',
          open ? 'text-[--ods-color-text]' : 'text-[--ods-color-neutral-500]',
        )}
      >
        <Text preset={TEXT_PRESET.heading4}>{title}</Text>
        {skip?.hint && (
          <Text preset={TEXT_PRESET.span} className="ml-2">
            {skip.hint}
          </Text>
        )}
      </div>
      {edit?.action && locked && (
        <div className="text-2xl w-full md:w-1/6" data-testid="edit">
          <Button
            variant={BUTTON_VARIANT.ghost}
            data-testid="edit-cta"
            className="float-left md:float-right"
            disabled={edit.disabled || undefined}
            onClick={() => {
              if (!edit.disabled) {
                edit.action(id as string);
              }
            }}
          >
            {edit.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepHeader;
