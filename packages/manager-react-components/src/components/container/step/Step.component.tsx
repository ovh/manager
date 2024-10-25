import React, { Suspense } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { v4 as uuidV4 } from 'uuid';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
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
  skip?: {
    action: (id: string) => void;
    label: string | JSX.Element;
    isDisabled?: boolean;
    hint?: string;
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
  skip,
}: TStepProps): JSX.Element => (
  <section className="flex flex-row border-0 border-t-[1px] border-solid border-t-[#b3b3b3] pt-5 mb-5">
    <div className="basis-[40px]">
      {isChecked ? (
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.CHECK}
          className="mr-2"
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      ) : (
        <div
          className={clsx(
            'flex justify-center items-center font-bold border-2 border-solid rounded-full h-10 w-10',
            isOpen ? 'border-[#0050d7]' : 'border-[grey]',
          )}
        >
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={
              isOpen
                ? ODS_THEME_COLOR_INTENT.text
                : ODS_THEME_COLOR_INTENT.default
            }
          >
            {order}
          </OsdsText>
        </div>
      )}
    </div>
    <div className="basis-full px-5">
      <div className="flex flex-col md:flex-row">
        <div
          className={clsx(
            'font-sans font-normal p-0 m-0 w-full md:w-5/6 flex',
            isOpen ? 'text-[#00185e]' : 'text-[grey]',
          )}
        >
          <div
            className={clsx(
              'leading-10',
              isOpen ? 'text-[1.625rem]' : 'text-[1.25rem]',
            )}
          >
            {title}
          </div>
          {skip?.hint && <div className="leading-10 ml-2">{skip.hint}</div>}
        </div>
        {edit?.action && isLocked && (
          <div className="text-2xl w-full md:w-1/6" data-testid="edit">
            <OsdsLink
              data-testid="edit-cta"
              className="float-left md:float-right"
              color={ODS_THEME_COLOR_INTENT.primary}
              {...(edit.isDisabled ? { disabled: true } : {})}
              onClick={() => {
                if (!edit.isDisabled) {
                  edit.action(id);
                }
              }}
            >
              {edit.label}
            </OsdsLink>
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
            <Suspense
              fallback={<OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
            >
              {children}
            </Suspense>
          </div>
          {!isLocked && (
            <div className="flex mt-6 gap-2">
              {next?.action && (
                <div data-testid="next">
                  <OsdsButton
                    data-testid="next-cta"
                    size={ODS_BUTTON_SIZE.md}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    onClick={() => {
                      next.action(id);
                    }}
                    className="w-fit"
                    {...(next.isDisabled ? { disabled: true } : {})}
                  >
                    {next.label}
                  </OsdsButton>
                </div>
              )}
              {skip?.action && (
                <div>
                  <OsdsButton
                    size={ODS_BUTTON_SIZE.md}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    variant={ODS_BUTTON_VARIANT.ghost}
                    onClick={() => {
                      skip.action(id);
                    }}
                    className="w-fit"
                    {...(skip.isDisabled ? { disabled: true } : {})}
                  >
                    {skip.label}
                  </OsdsButton>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </section>
);

export default StepComponent;
