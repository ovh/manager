import { Checkbox, Label } from '@datatr-ux/uxlib';

interface CheckboxFieldProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const CheckboxField = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxFieldProps) => (
  <div className={`flex items-start gap-2 ${className ?? ''}`}>
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      disabled={disabled}
      className='mt-1'
    />
    <div>
      <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  </div>
);
