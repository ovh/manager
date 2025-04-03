import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Button,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useId } from 'react';

const Modal = ({
  title,
  handleModalClose,
  children,
  isPending,
  handleInstanceAction,
  variant = 'primary',
}: {
  title: string;
  handleModalClose: () => void;
  children: React.ReactNode;
  isPending: boolean;
  handleInstanceAction: () => void;
  variant?: 'primary' | 'warning';
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const id = useId();

  return (
    <Dialog defaultOpen onOpenChange={handleModalClose}>
      <DialogContent aria-describedby={id} className="p-0">
        <DialogHeader
          className={clsx(
            `p-6 rounded-t-sm sm:rounded-t-lg`,
            variant === 'warning' ? 'bg-warning-100' : 'bg-primary-100',
          )}
        >
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div id={id} className="p-6 pt-0">
          {children}
        </div>
        <DialogFooter className="flex justify-end p-6 pt-0">
          <DialogClose asChild>
            <Button variant="neutral" mode="ghost">
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            variant="primary"
            onClick={handleInstanceAction}
          >
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
