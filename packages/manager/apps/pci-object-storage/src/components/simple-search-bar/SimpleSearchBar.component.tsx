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
  placeholder = 'Search...',
}: SimpleSearchBarProps) => {
  return (
    <div className="flex items-stretch border rounded-md overflow-hidden">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-none"
      />
      <Button className="rounded-l-none rounded-r-[5px] h-auto">
        <Search className="size-4" />
      </Button>
    </div>
  );
};

export default SimpleSearchBar;
