import * as React from 'react';
import { useNavigation, useShell } from '@ovh-ux/manager-react-shell-client';
import {
  LinkProps,
  NavLink as RouterNavLink,
  Link as RouterLink,
  NavLinkProps,
} from 'react-router-dom';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { cn } from '@/lib/utils';

function H1({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName = 'block';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._800}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}

function H2({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName = 'block';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._600}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}

function H3({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName = 'block';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._500}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}

function H4({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName = 'block';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._400}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}

function H5({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName = 'block';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._200}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}
function P({
  className,
  children,
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const baseClassName = 'block';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}

function A({
  className,
  children,
  disabled,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { disabled?: boolean }) {
  const baseClassName =
    'text-primary-500 font-semibold outiline-none cursor-pointer no-underline hover:text-primary-700 hover:underline';
  const disabledClass = 'opacity-50 cursor-not-allowed hover:text-primary-500';
  const combinedClassName = cn(
    baseClassName,
    className,
    disabled && disabledClass,
  );
  if (disabled) {
    // eslint-disable-next-line no-unused-vars
    const { href, onClick, tabIndex, ...otherProps } = props;
    return (
      <a
        className={combinedClassName}
        {...otherProps}
        aria-disabled="true"
        tabIndex={-1}
      >
        {children}
      </a>
    );
  }

  return (
    <a className={combinedClassName} {...props}>
      {children}
    </a>
  );
}

function Span({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  const baseClassName = 'inline';
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      className={cn(baseClassName, className)}
    >
      {children}
    </OsdsText>
  );
}

function Link({
  className,
  disabled,
  children,
  to,
  ...props
}: LinkProps & { disabled?: boolean }) {
  const shell = useShell();
  const baseClassName =
    'text-primary-500 font-semibold outiline-none cursor-pointer no-underline hover:text-primary-700 hover:underline';
  const disabledClass = 'opacity-50 cursor-not-allowed hover:text-primary-500';
  const combinedClassName = cn(
    baseClassName,
    className,
    disabled && disabledClass,
  );
  return (
    <RouterLink
      to={to}
      className={combinedClassName}
      {...props}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        } else {
          shell.ux.showPreloader();
        }
      }}
    >
      {children}
    </RouterLink>
  );
}

function NavLink({
  className,
  disabled,
  children,
  to,
  end,
  ...props
}: NavLinkProps & { disabled?: boolean }) {
  const shell = useShell();
  const baseClassName =
    'whitespace-nowrap w-fit text-primary-500 text-base font-semibold m-0 py-2 hover:text-primary-700';
  const activeClass = 'border-b-2 border-primary-500';
  const disabledClass = 'cursor-not-allowed opacity-50 hover:text-primary-500';

  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          baseClassName,
          isActive && activeClass,
          className,
          disabled && disabledClass,
        )
      }
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        } else {
          shell.ux.showPreloader();
        }
      }}
      {...props}
    >
      {children}
    </RouterNavLink>
  );
}

interface OvhLinkProps {
  application: string;
  path: string;
  params?: Record<string, string | number | boolean>;
}
function OvhLink({
  application,
  path,
  params = {},
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> &
  OvhLinkProps & { disabled?: boolean }) {
  const navigation = useNavigation();
  const [url, setUrl] = React.useState('');
  React.useEffect(() => {
    const fetchUrl = async (urlParams: OvhLinkProps) => {
      const goTo = (await navigation.getURL(
        urlParams.application,
        urlParams.path,
        urlParams.params,
      )) as string;
      setUrl(goTo);
    };
    fetchUrl({ application, path, params });
  }, [application, path, params, navigation]);
  return (
    <A href={url} {...props}>
      {children}
    </A>
  );
}
export { H1, H2, H3, H4, H5, P, A, Span, Link, NavLink, OvhLink };
