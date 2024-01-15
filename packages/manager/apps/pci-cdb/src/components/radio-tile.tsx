import { useId } from 'react';
import { cn } from '@/lib/utils';

interface RadioTileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}
const RadioTile = ({ children, className, ...props }: RadioTileProps) => {
  const id = useId();
  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter') {
      const inputElement = document.getElementById(
        id,
      ) as HTMLInputElement | null;
      if (inputElement) {
        inputElement.click();
      }
    }
  };
  return (
    <div className="flex">
      <input
        onChange={(e) => (props.onChange ? props.onChange(e) : null)}
        className="hidden"
        type="radio"
        id={id}
        checked={props.checked}
        {...props}
      />
      <label
        htmlFor={id}
        tabIndex={0}
        role="button"
        onKeyDown={handleLabelKeyDown}
        className={cn(
          `w-full group text-[#4d5592] border-2 border-primary-100 rounded-md p-4 hover:shadow-sm hover:border-primary-600 hover:bg-primary-100 ${
            props.checked
              ? 'border-primary-600 bg-primary-100 selected'
              : 'bg-white'
          }`,
          className,
        )}
      >
        {children}
      </label>
    </div>
  );
};

RadioTile.Separator = function RadioTileSeparator() {
  return (
    <div className="border-primary-100 border-t mt-2 pt-2 group-hover:border-primary-200 group-[.selected]:border-primary-200"></div>
  );
};

export default RadioTile;
