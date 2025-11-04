import { PropsWithChildren } from 'react';

import { FileUploadList as ODSFileUploadList } from '@ovhcloud/ods-react';

import { FileUploadListProps } from './FileUploadList.props';

export const FileUploadList = ({ children, ...props }: PropsWithChildren<FileUploadListProps>) => (
  <ODSFileUploadList {...props}>{children}</ODSFileUploadList>
);
