import { LinkProps, Link as RouterLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLoadingIndicatorContext } from '@/contexts/loadingIndicatorContext';

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

export default Link;
