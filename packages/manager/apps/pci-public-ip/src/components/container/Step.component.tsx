import { OsdsButton, OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

type TStepProps = {
  id: string;
  title: string;
  open: boolean;
  order?: number;
  next: { action?: (id: string) => void; label?: string };
  onEdit?: (id: string) => void;
  children: JSX.Element | JSX.Element[];
};

export const StepComponent = ({
  id,
  title,
  open,
  order,
  children,
  next,
  onEdit,
}: TStepProps): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const { t: tStepper } = useTranslation('stepper');

  useEffect(() => {
    setChecked(() => false);
    setDone(() => false);
  }, [open]);

  return (
    <section className="flex flex-row border-0 border-t-[1px] border-solid border-t-[#b3b3b3] pt-5">
      <div className="basis-[40px]">
        {checked ? (
          <OsdsIcon
            size={ODS_ICON_SIZE.sm}
            name={ODS_ICON_NAME.CHECK}
            className={'mr-2'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        ) : (
          <div
            className={clsx(
              'flex justify-center items-center font-bold border-2 border-solid rounded-full h-10 w-10',
              open
                ? 'border-[#0050d7] text-[#0050d7]'
                : 'border-[grey] text-[grey]',
            )}
          >
            {order}
          </div>
        )}
      </div>
      <div className="basis-full px-5">
        <div className="flex flex-col md:flex-row">
          <div
            className={clsx(
              'font-sans font-normal p-0 m-0 w-full md:w-5/6',
              open
                ? 'text-[1.625rem] text-[#00185e]'
                : 'text-[1.25rem] text-[grey]',
            )}
          >
            {title}
          </div>
          {onEdit && done && (
            <div className="text-2xl w-full md:w-1/6">
              <OsdsLink
                className="float-left md:float-right"
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  setDone(false);
                  onEdit(id);
                }}
              >
                {tStepper('common_stepper_modify_this_step')}
              </OsdsLink>
            </div>
          )}
        </div>
        {open && (
          <>
            <div
              className={clsx(
                'mt-5',
                done && 'cursor-not-allowed pointer-events-none opacity-50',
              )}
            >
              {children}
            </div>
            {next.action && !done && (
              <div className="mt-6">
                <OsdsButton
                  size={ODS_BUTTON_SIZE.md}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => {
                    setChecked(true);
                    setDone(true);
                    next.action(id);
                  }}
                  className="w-fit"
                >
                  {next.label || tStepper('common_stepper_next_button_label')}
                </OsdsButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
