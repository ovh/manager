import { useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@datatr-ux/uxlib';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Download,
  Trash,
} from 'lucide-react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { octetConverter } from '@/lib/bytesHelper';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/fileIcon/FileIcon.component';

// ---------- Types ----------
interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  versions?: StorageObject[];
}

// ---------- Helpers ----------
function normalizeKey(key?: string): string | null {
  if (!key || typeof key !== 'string') return null;
  return key.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
}

function groupByKey(objects: StorageObject[]): Map<string, StorageObject[]> {
  const map = new Map<string, StorageObject[]>();
  for (const obj of objects) {
    const normalizedKey = normalizeKey(obj.key);
    if (!normalizedKey) continue;
    if (!map.has(normalizedKey)) map.set(normalizedKey, []);
    map.get(normalizedKey)!.push(obj);
  }
  return map;
}

function buildTree(grouped: Map<string, StorageObject[]>): TreeNode {
  const root: TreeNode = { name: '', path: '', type: 'folder', children: [] };

  for (const [key, versions] of grouped.entries()) {
    const parts = key.split('/');
    let current = root;

    parts.forEach((part, index) => {
      let child = current.children?.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: index === parts.length - 1 ? 'file' : 'folder',
          children: [],
        };
        current.children!.push(child);
      }

      if (index === parts.length - 1) {
        child.versions = versions;
      }

      current = child;
    });
  }

  return root;
}

// ---------- Sheet (Detail Panel) ----------
const ObjectSheet = ({
  object,
  onClose,
}: {
  object: TreeNode | null;
  onClose: () => void;
}) => {
  if (!object || !object.versions?.length) return null;

  const latest = object.versions.find((v) => v.isLatest) ?? object.versions[0];
  const sortedVersions = [...object.versions].sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
  );

  return (
    <Sheet open={!!object} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{object.name}</SheetTitle>
          <SheetDescription className="truncate text-muted-foreground">
            {object.path}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <Card>
            <CardHeader>
              <h5 className="font-semibold text-sm">Details</h5>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Size</TableCell>
                    <TableCell>
                      {octetConverter(latest.size, true, 2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">
                      Storage class
                    </TableCell>
                    <TableCell>{latest.storageClass}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">
                      Last modified
                    </TableCell>
                    <TableCell>
                      <FormattedDate
                        date={new Date(latest.lastModified)}
                        options={{
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h5 className="font-semibold text-sm">Versions</h5>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                {sortedVersions.map((v) => (
                  <div
                    key={v.versionId}
                    className={`flex justify-between ${
                      v.isLatest ? 'text-foreground font-medium' : ''
                    }`}
                  >
                    <span>
                      v{v.versionId.split('.')[0]} •{' '}
                      {octetConverter(v.size, true, 2)}
                    </span>
                    <FormattedDate
                      date={new Date(v.lastModified)}
                      options={{
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }}
                    />
                    <Download className="size-4" />
                    <Trash className="size-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// ---------- Recursive Tree ----------
const TreeNodeView = ({
  node,
  depth = 0,
  onSelectFile,
}: {
  node: TreeNode;
  depth?: number;
  onSelectFile: (node: TreeNode) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);

  const paddingLeft = { paddingLeft: `${depth * 1.25}rem` };
  const connectorClasses =
    depth > 0
      ? 'relative before:absolute before:left-[0.5rem] before:top-0 before:bottom-0 before:border-l before:border-muted'
      : '';

  if (node.type === 'folder') {
    return (
      <div className={`${connectorClasses}`} style={paddingLeft}>
        <div
          className="flex items-center cursor-pointer hover:text-primary font-semibold"
          onClick={toggle}
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )}
          <Folder className="w-4 h-4 mr-1 text-yellow-500 shrink-0" />
          {node.name || 'root'}
        </div>

        {expanded && node.children && (
          <div className="space-y-1 mt-1">
            {node.children.map((child) => (
              <TreeNodeView
                key={child.path}
                node={child}
                depth={depth + 1}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- File node ----------
  return (
    <div className={`${connectorClasses}`} style={paddingLeft}>
      <div
        className="flex items-center cursor-pointer hover:text-primary"
        onClick={() => onSelectFile(node)}
      >
        <FileIcon fileName={node.name} className="w-4 h-4 mr-1 text-blue-500" />
        <span>{node.name}</span>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const ObjectTreeView = ({
  objects,
  isLoading = false,
}: {
  objects?: StorageObject[];
  isLoading?: boolean;
}) => {
  const [selected, setSelected] = useState<TreeNode | null>(null);

  const tree = useMemo(() => {
    if (!objects || objects.length === 0) return null;
    const grouped = groupByKey(objects);
    return buildTree(grouped);
  }, [objects]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="w-1/3 h-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!tree || !tree.children?.length) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Object Explorer</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No objects found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Object Explorer</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {tree.children.map((child) => (
              <TreeNodeView
                key={child.path}
                node={child}
                depth={0}
                onSelectFile={(n) => setSelected(n)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ObjectSheet object={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default ObjectTreeView;
