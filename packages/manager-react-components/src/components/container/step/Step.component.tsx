import React, { Suspense } from 'react';
import {
  OdsButton,
  OdsIcon,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { v4 as uuidV4 } from 'uuid';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { clsx } from 'clsx';

export type TStepProps = {
  id?: string;
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
  order: number;
  next?: {
    action: (id: string) => void;
    label: string | JSX.Element;
    isDisabled?: boolean;
  };
  edit?: {
    action: (id: string) => void;
    label: string | JSX.Element;
    isDisabled?: boolean;
  };
  children?: JSX.Element | JSX.Element[];
};

export const StepComponent = ({
  id = uuidV4(),
  title = '',
  subtitle = '',
  isOpen,
  isChecked,
  isLocked,
  order,
  children,
  next,
  edit,
}: TStepProps): JSX.Element => {
  return (
    <section className="flex flex-row border-0 border-t-[1px] border-solid border-t-[#b3b3b3] pt-5 mb-5">
      <div className="basis-[40px]">
        {isChecked ? (
          <OdsIcon
            name={ODS_ICON_NAME.check}
            className={'mr-2'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        ) : (
          <div
            className={clsx(
              'flex justify-center items-center font-bold border-2 border-solid rounded-full h-10 w-10',
              isOpen ? 'border-[#0050d7]' : 'border-[grey]',
            )}
          >
            <OdsText
              color={
                isOpen
                  ? ODS_THEME_COLOR_INTENT.text
                  : ODS_THEME_COLOR_INTENT.default
              }
            >
              {order}
            </OdsText>
          </div>
        )}
      </div>
      <div className="basis-full px-5">
        <div className="flex flex-col md:flex-row">
          <div
            className={clsx(
              'font-sans font-normal p-0 m-0 w-full md:w-5/6 leading-10',
              isOpen
                ? 'text-[1.625rem] text-[#00185e]'
                : 'text-[1.25rem] text-[grey]',
            )}
          >
            {title}
          </div>
          {edit?.action && isLocked && (
            <div className="text-2xl w-full md:w-1/6" data-testid="edit">
              <OdsButton
                label={edit.label as string}
                data-testid="edit-cta"
                className="float-left md:float-right"
                color={ODS_THEME_COLOR_INTENT.primary}
                {...(edit.isDisabled ? { disabled: true } : {})}
                onClick={() => {
                  if (!edit.isDisabled) {
                    edit.action(id);
                  }
                }}
              />
            </div>
          )}
        </div>
        {isOpen && (
          <>
            {subtitle && <div>{subtitle}</div>}
            <div
              data-testid="content"
              className={clsx(
                'mt-5',
                isLocked && 'cursor-not-allowed pointer-events-none opacity-50',
              )}
            >
              <Suspense fallback={<OdsSpinner size={ODS_SPINNER_SIZE.md} />}>
                {children}
              </Suspense>
            </div>
            {next?.action && !isLocked && (
              <div className="mt-6" data-testid="next">
                <OdsButton
                  data-testid="next-cta"
                  label={next.label as string}
                  size={ODS_BUTTON_SIZE.md}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => {
                    next.action(id);
                  }}
                  className="w-fit"
                  {...(next.isDisabled ? { disabled: true } : {})}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default StepComponent;
