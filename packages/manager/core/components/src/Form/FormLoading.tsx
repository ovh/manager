import React from 'react';
import { FormControl, FormLabel, Input, Skeleton } from '@chakra-ui/react';

export const FormLoading = (): JSX.Element => {
  return (
    <>
      {Array(4)
        .fill(null)
        .map((loadingItem, loadingIndex) => {
          return (
            <FormControl key={loadingIndex} pb={2}>
              <FormLabel pb={2}>
                <Skeleton width={250}>&nbsp;</Skeleton>
              </FormLabel>
              <Skeleton>
                <Input type="text" />
              </Skeleton>
            </FormControl>
          );
        })}
    </>
  );
};

export default {
  FormLoading,
};
