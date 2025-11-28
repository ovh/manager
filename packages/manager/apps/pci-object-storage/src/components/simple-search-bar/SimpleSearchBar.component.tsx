import { Input, Button } from '@datatr-ux/uxlib';
import { Search } from 'lucide-react';

interface SimpleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimpleSearchBar = ({
  value,
  onChange,
  placeholder,
}: SimpleSearchBarProps) => {
  return (
  <div className="flex items-stretch border rounded-md overflow-hidden [&>div]:border-none [&>div>svg]:hidden">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-none text-sm"
      />
      <Button className="rounded-l-none rounded-r-[5px] h-auto">
        <Search />
      </Button>
    </div>
  );
};

export default SimpleSearchBar;
