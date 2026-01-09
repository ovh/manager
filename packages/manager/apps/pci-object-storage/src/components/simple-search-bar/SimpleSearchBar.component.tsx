import { Input, Button } from '@datatr-ux/uxlib';
import { Search, X } from 'lucide-react';

interface SimpleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SimpleSearchBar = ({
  value,
  onChange,
  placeholder,
  disabled = false,
}: SimpleSearchBarProps) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="flex items-stretch border rounded-md overflow-hidden [&>div]:border-none [&>div>svg]:hidden">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-none text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={disabled}
      />
      {value && (
        <Button
          className="rounded-none h-auto"
          disabled={disabled}
          onClick={handleClear}
          mode="ghost"
          size="xs"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Button>
      )}
      <Button
        className="rounded-l-none rounded-r-[5px] h-auto"
        disabled={disabled}
      >
        <Search />
      </Button>
    </div>
  );
};

export default SimpleSearchBar;
