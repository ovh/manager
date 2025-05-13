import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from '@datatr-ux/uxlib';

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  height?: number;
  width?: number;
}
export function DatatableSkeleton({
  height = 16,
  width = 80,
  rows = 5,
  columns = 5,
}: DataTableSkeletonProps) {
  return (
    <Table data-testid="datatable.skeleton">
      <TableHeader className="border bg-gray-50">
        <TableRow>
          {Array.from({ length: columns }).map((colHead, iColHead) => (
            <TableHead
              key={`${colHead}${iColHead}`}
              className="border font-semibold text-primary-800"
            >
              <Skeleton
                className="block"
                style={{ width: `${width}px`, height: `${height}px` }}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="border border-primary-100">
        {Array.from({ length: rows }).map((row, iRow) => (
          <TableRow key={`${row}${iRow}`}>
            {Array.from({ length: columns }).map((col, iCol) => (
              <TableCell key={`${col}${iCol}`}>
                <Skeleton
                  className="block"
                  style={{ width: `${width}px`, height: `${height}px` }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
