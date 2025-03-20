import { PropsWithChildren, ComponentProps } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';

export const Card = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<ComponentProps<'div'>>) => (
  <div
    className={clsx(
      'box-border border-solid rounded-lg border-[.125rem] border-[--ods-color-blue-100] w-full p-[16px] flex flex-col gap-4',
      className,
    )}
    {...otherProps}
  >
    {children}
  </div>
);

export const CardBody = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<ComponentProps<'div'>>) => (
  <div
    className={clsx('flex flex-col w-full items-center gap-4', className)}
    {...otherProps}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  ...otherProps
}: PropsWithChildren<ComponentProps<'div'>>) => (
  <div {...otherProps}>{children}</div>
);

export const CardTitle = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<ComponentProps<typeof OsdsText>>) => (
  <OsdsText
    color={ODS_THEME_COLOR_INTENT.text}
    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
    className={clsx('leading-8', className)}
    {...otherProps}
  >
    {children}
  </OsdsText>
);

export const CardDescription = ({
  children,
  ...otherProps
}: PropsWithChildren<ComponentProps<typeof OsdsText>>) => (
  <OsdsText
    color={ODS_THEME_COLOR_INTENT.text}
    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
    size={ODS_THEME_TYPOGRAPHY_SIZE._100}
    {...otherProps}
  >
    {children}
  </OsdsText>
);
