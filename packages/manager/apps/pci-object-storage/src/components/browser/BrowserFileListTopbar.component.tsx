import { useBrowser } from './BrowserRoot.component';

const BrowserFileListTopbar = <T extends { name: string }>() => {
  const { prefix } = useBrowser<T>();
  return (
    <div className="py-2 px-3 border-b bg-muted/50 text-sm shrink-0">
      <strong>Prefix:</strong>{' '}
      <code className="font-mono">{prefix || '(root)'}</code>
    </div>
  );
};

export { BrowserFileListTopbar };
