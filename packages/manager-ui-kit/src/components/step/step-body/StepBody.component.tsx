import { PropsWithChildren, Suspense, useContext } from 'react';

import { clsx } from 'clsx';

import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

import { StepProps } from '../Step.props';
import { StepContext } from '../StepContext';

export const StepBody = ({ children }: PropsWithChildren) => {
  const { subtitle, locked } = useContext<StepProps>(StepContext);
  return (
    <>
      {subtitle && <div data-testid="subtitle">{subtitle}</div>}
      <div
        data-testid="content"
        className={clsx('mt-5', locked && 'cursor-not-allowed pointer-events-none opacity-50')}
      >
        <Suspense fallback={<Spinner size={SPINNER_SIZE.md} />}>{children}</Suspense>
      </div>
    </>
  );
};

export default StepBody;
