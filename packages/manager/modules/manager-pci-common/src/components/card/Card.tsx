import { ComponentProps, PropsWithChildren } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
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
  ...otherProps
}: PropsWithChildren<ComponentProps<typeof OdsText>>) => (
  <OdsText {...otherProps}>{children}</OdsText>
);

export const CardDescription = ({
  children,
  ...otherProps
}: PropsWithChildren<ComponentProps<typeof OdsText>>) => (
  <OdsText {...otherProps}>{children}</OdsText>
);
