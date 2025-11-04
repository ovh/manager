/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  type FileUploadAcceptDetail,
  type FileUploadRejectDetail,
  FileUploadProp as OdsFileUploadProps,
} from '@ovhcloud/ods-react';

export type FileUploadProps = PropsWithChildren<OdsFileUploadProps> & {};

export type { FileUploadAcceptDetail, FileUploadRejectDetail };
