import { ObjectBrowserList } from './object-browser-list';
import { ObjectBrowserContentHeader } from './object-browser-toolbar';
import { ObjectBrowserToolbar } from './toolbar';
import { ObjectBrowserTreeView } from './tree-view';

export default function DefaultLayout() {
  return (
    <div className="grid gap-2 grid-cols-[280px_1fr] h-[70vh] min-h-0 overflow-hidden">
      {/* Tree pane */}
      <div className="flex flex-col min-h-0 border rounded-md">
        <ObjectBrowserToolbar />
        <ObjectBrowserTreeView />
      </div>

      {/* Content pane */}
      <div className="flex flex-col min-h-0 border rounded-md relative">
        <ObjectBrowserContentHeader />
        <ObjectBrowserList />
      </div>
    </div>
  );
}
