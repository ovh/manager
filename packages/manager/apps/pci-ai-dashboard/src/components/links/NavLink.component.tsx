import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';

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

export default NavLink;
