import * as React from 'react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  LinkProps,
  NavLink as RouterNavLink,
  Link as RouterLink,
  NavLinkProps,
} from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLoadingIndicatorContext } from '@/contexts/loadingIndicatorContext';

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

function Link({
  className,
  disabled,
  children,
  to,
  ...props
}: LinkProps & { disabled?: boolean }) {
  const { setLoading } = useLoadingIndicatorContext();
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
          setLoading(true);
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
  const { setLoading } = useLoadingIndicatorContext();
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
          setLoading(true);
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
export { A, Link, NavLink, OvhLink };
