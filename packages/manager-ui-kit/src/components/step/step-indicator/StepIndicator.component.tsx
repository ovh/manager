import { useContext } from 'react';
import { clsx } from 'clsx';
import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { StepContext } from '../StepContext';
import { StepProps } from '../Step.props';

export const StepIndicator = () => {
  const { checked, open, order } = useContext<StepProps>(StepContext);
  return (
    <div className="basis-[40px]">
      {checked ? (
        <Icon
          name={ICON_NAME.check}
          className="block p-[12px] text-[20px] text-[--ods-color-primary-500]"
        />
      ) : (
        <span
          className={clsx(
            'flex justify-center items-center',
            'border-2 border-solid rounded-full',
            'h-10 w-10',
            'font-semibold text-[16px] leading-[20px]',
            open
              ? 'border-[--ods-color-primary-500] text-[--ods-color-text]'
              : 'border-[--ods-color-neutral-500] text-[--ods-color-neutral-500]',
          )}
        >
          {order}
        </span>
      )}
    </div>
  );
};

export default StepIndicator;
