import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useId } from 'react';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export type TModalVariant = 'primary' | 'warning' | 'critical';

const Modal = ({
  title,
  onModalClose,
  children,
  isPending,
  handleInstanceAction,
  variant = 'primary',
}: {
  title: string;
  onModalClose: () => void;
  children: React.ReactNode;
  isPending: boolean;
  handleInstanceAction: () => void;
  variant?: TModalVariant;
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const id = useId();

  return (
    <Dialog defaultOpen onOpenChange={onModalClose}>
      <DialogContent
        aria-describedby={id}
        className="p-0 !rounded-[--ods-border-radius-md] [&>button]:hidden focus-visible:outline-none"
      >
        <DialogHeader
          className={clsx(
            `p-6 rounded-t-md `,
            `bg-[--ods-color-${variant}-100]`,
          )}
        />
        <div id={id} className="p-6 pt-0">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_TEXT_SIZE._400}
            hue={ODS_TEXT_COLOR_HUE._800}
            level={ODS_TEXT_LEVEL.heading}
          >
            {title}
          </OsdsText>
          {children}
        </div>
        <DialogFooter className="flex justify-end p-6 pt-0">
          <DialogClose asChild>
            <OsdsButton
              disabled={isPending || undefined}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('cancel')}
            </OsdsButton>
          </DialogClose>
          <OsdsButton
            disabled={isPending || undefined}
            onClick={handleInstanceAction}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('confirm')}
          </OsdsButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
