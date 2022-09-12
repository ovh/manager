import React from 'react';
import { TitleFieldProps } from '@rjsf/utils';
import { Box, Heading } from '@chakra-ui/react';

import { getUiTitleOptions } from '../utils';

export const TitleFieldTemplate = ({
  id,
  title,
  uiSchema,
}: TitleFieldProps) => {
  const { size = 'sm', as = 'h5' } = getUiTitleOptions(uiSchema);

  return (
    <Box id={id} mt={1} mb={4}>
      <Heading as={as} size={size}>
        {title}
      </Heading>
    </Box>
  );
};

export default TitleFieldTemplate;
