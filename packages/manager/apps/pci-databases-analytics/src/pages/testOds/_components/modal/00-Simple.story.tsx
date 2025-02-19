/* eslint-disable import/no-extraneous-dependencies */
import {
  OdsButton,
  OdsCard,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { StoryResult } from '../Stories';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default {
  story: 'Simple modal',
  customComponentExemple: (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <OdsButton label="Trigger modal" onClick={() => setOpen(true)} />
        <OdsModal isOpen={open} onOdsClose={(e) => setOpen(false)}>
          <OdsText preset="heading-3">Are you absolutely sure?</OdsText>
          <OdsText preset="paragraph">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </OdsText>
        </OdsModal>
      </>
    );
  },
  ODSComponentResult: StoryResult.success,
};
