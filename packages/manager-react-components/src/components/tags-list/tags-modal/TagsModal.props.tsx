import { ModalOpenChangeDetail } from '@ovhcloud/ods-react';

export type TagsModalProps = {
  heading: string;
  open: boolean;
  tags: string[];
  onCancel: () => void;
  onEditTags?: () => void;
  onOpenChange?: (detail?: ModalOpenChangeDetail) => void;
};
