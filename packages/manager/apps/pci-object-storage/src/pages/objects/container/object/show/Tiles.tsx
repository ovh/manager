import { Card, useMe } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { CONTAINER_GUIDES } from '@/constants';

export function Tiles() {
  const { t: tContainer } = useTranslation('container');
  const { t: tOnboarding } = useTranslation('onboarding');

  const { me } = useMe();
  const tileItems = CONTAINER_GUIDES.map((guide) => ({
    id: guide.id,
    href: guide.links[me?.ovhSubsidiary] || guide.links.DEFAULT,
    texts: {
      category: tOnboarding('onboarding_guide_title'),
      description: tContainer(
        `pci_projects_project_storages_containers_container_documentation_description_${guide.id}`,
      ),
      title: tContainer(
        `pci_projects_project_storages_containers_container_documentation_title_${guide.id}`,
      ),
    },
  }));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
      {tileItems.map((tile) => (
        <Card key={tile.id} href={tile.href} texts={tile.texts} />
      ))}
    </div>
  );
}
