import { cn } from '@/lib/utils';

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
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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
export default A;
