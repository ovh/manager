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
  variant?: 'primary' | 'warning';
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const id = useId();

  return (
    <Dialog defaultOpen onOpenChange={onModalClose}>
      <DialogContent
        aria-describedby={id}
        className="p-0 !rounded-[--ods-border-radius-md] [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-0 [&_button:focus-visible]:ring-offset-0 [&_button]:text-[--ods-color-info-500] [&_button]:top-3.5 [&_button_svg]:w-8 [&_button_svg]:h-8"
      >
        <DialogHeader
          className={clsx(
            `p-6 rounded-t-md `,
            variant === 'warning'
              ? 'bg-[--ods-color-warning-100]'
              : 'bg-[--ods-color-primary-100]',
          )}
        />
        <div id={id} className="p-6 pt-0">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_TEXT_SIZE._400}
            hue={ODS_TEXT_COLOR_HUE._500}
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
