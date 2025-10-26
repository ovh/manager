import { FileUpload as OdsFileUpload } from '@ovhcloud/ods-react';

import { FileUploadProps } from '@/components/file-upload/FileUpload.props';

export const FileUpload = ({ children, ...others }: FileUploadProps) => (
  <OdsFileUpload {...others}>{children}</OdsFileUpload>
);
