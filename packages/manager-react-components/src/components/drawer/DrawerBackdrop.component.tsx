type DrawerBackdropProps = {
  onClick: () => void;
};

const DrawerBackdrop = ({ onClick }: DrawerBackdropProps) => {
  return (
    <div
      data-testid="drawer-backdrop"
      className="fixed inset-0 bg-[#0050d7] z-40 drawer-backdrop-fade-in"
      onClick={onClick}
    />
  );
};

export default DrawerBackdrop;
