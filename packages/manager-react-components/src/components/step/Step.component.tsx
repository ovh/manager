import { v4 as uuidV4 } from 'uuid';
import StepProps from './Step.props';
import { StepIndicator } from './step-indicator/StepIndicator.component';
import { StepHeader } from './step-header/StepHeader.component';
import { StepBody } from './step-body/StepBody.component';
import { StepFooter } from './step-footer/StepFooter.component';
import { StepContext } from './StepContext';

export const Step = ({
  id = uuidV4(),
  title = '',
  subtitle = '',
  open,
  checked,
  locked,
  order,
  children,
  next,
  edit,
  skip,
}: StepProps): JSX.Element => {
  return (
    <StepContext.Provider
      value={{
        id,
        title,
        subtitle,
        open,
        checked,
        locked,
        order,
        next,
        edit,
        skip,
      }}
    >
      <section className="flex flex-row border-0 border-t-[1px] border-solid border-t-[--ods-color-neutral-100] pt-5 mb-5">
        <StepIndicator />
        <div className="basis-full px-5">
          <StepHeader />
          {open && (
            <>
              <StepBody>{children}</StepBody>
              {!locked && <StepFooter />}
            </>
          )}
        </div>
      </section>
    </StepContext.Provider>
  );
};

export default Step;
