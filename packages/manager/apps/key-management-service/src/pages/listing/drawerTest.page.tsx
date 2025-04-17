import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from '@/components/drawer/Drawer.component';

export default function DrawerTestPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  return (
    <Drawer
      title="Drawer Test"
      isOpen
      isLoading={isLoading}
      onClose={() => navigate('..')}
      primaryLabel="Ajouter"
      onPrimaryButtonClick={() => console.log('Ajouter')}
      secondaryLabel="Annuler"
      onSecondaryButtonClick={() => navigate('..')}
    >
      <div>
        This is the content of the drawer. You can put any content here, such as
        text, images, or other components.
      </div>
    </Drawer>
  );
}
