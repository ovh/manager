import React from 'react';
import { TileSection } from '@ovh-ux/manager-themes';
import { SkeletonText } from '@chakra-ui/react';

export default function DashboardTileLoading({ count = 4 }: any): JSX.Element {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((item: any, index: number) => {
          return (
            <TileSection key={index}>
              <SkeletonText mt="4" noOfLines={2}>
                &nbsp;
              </SkeletonText>
            </TileSection>
          );
        })}
    </>
  );
}
