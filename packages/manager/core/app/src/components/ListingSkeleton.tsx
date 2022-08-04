import React, { useMemo } from 'react';
import { Skeleton, Td, Tr } from '@chakra-ui/react';

export default function ListingSkeleton({
  columnsCount,
  linesCount,
}: {
  columnsCount: number;
  linesCount: number;
}): JSX.Element {
  const lineRange = [...Array(linesCount).keys()];
  const columnRange = [...Array(columnsCount).keys()];

  const skeleton = useMemo(
    () =>
      lineRange.map((row) => (
        <Tr key={`${row}`}>
          {columnRange.map((col) => (
            <Td key={`${col}-${row}`}>
              <Skeleton isLoaded={false}>
                <span>&nbsp;</span>
              </Skeleton>
            </Td>
          ))}
        </Tr>
      )),
    [columnsCount, linesCount],
  );

  return <>{skeleton}</>;
}
