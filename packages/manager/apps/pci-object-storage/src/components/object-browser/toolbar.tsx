import { Home } from 'lucide-react';
import { Button, Input } from '@datatr-ux/uxlib';
import { useObjectBrowser } from './context';

export function ObjectBrowserToolbar({
  placeholder = 'Search objects...',
}: {
  placeholder?: string;
}) {
  const { setPrefix, query, setQuery } = useObjectBrowser();
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        variant="neutral"
        mode={'outline'}
        className="border border-border"
        onClick={() => setPrefix('')}
      >
        <Home className="size-4" />
      </Button>
    </div>
  );
}
