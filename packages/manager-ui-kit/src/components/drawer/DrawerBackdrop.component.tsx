import { useTranslation } from 'react-i18next';

type DrawerBackdropProps = {
  onClick: () => void;
};

const DrawerBackdrop = ({ onClick }: DrawerBackdropProps) => {
  const { t } = useTranslation('drawer');
  return (
    <button
      data-testid="drawer-backdrop"
      type="button"
      aria-label={t('close')}
      tabIndex={0}
      className="fixed inset-0 bg-[var(--ods-color-information-500)] z-40 mrc-drawer-backdrop-fade-in"
      onClick={onClick}
    />
  );
};

export default DrawerBackdrop;
