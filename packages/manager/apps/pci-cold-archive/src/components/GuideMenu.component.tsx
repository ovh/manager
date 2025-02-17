import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsButton, OdsLink, OdsPopover } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { GUIDE_MENU_ITEMS } from '@/constants';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

export default function GuideMenu() {
  const { t } = useTranslation(['cold-archive', 'pci-guides-header']);

  const {
    shell: { tracking },
    environment,
  } = useContext(ShellContext);

  const { ovhSubsidiary } = environment.getUser();

  const onGuideClick = (guideId: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.GUIDE}_${guideId}`,
      type: 'action',
    });
  };

  const guides = GUIDE_MENU_ITEMS.reduce(
    (list, guide) => [
      ...list,
      {
        ...guide,
        title: t(
          `pci_projects_project_storages_cold_archives_guides_${guide.id}_title`,
        ),
        description: t(
          `pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
        ),
        link: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
      },
    ],
    [],
  );

  return (
    <>
      <div id="guides-menu-trigger">
        <OdsButton
          slot={'menu-title'}
          variant={'ghost'}
          icon={'book'}
          label={t('pci-guides-header:pci_project_guides_header')}
        />
      </div>
      <OdsPopover triggerId="guides-menu-trigger">
        {guides.map((guide) => (
          <div className="flex flex-col gap-2 my-1" key={guide.id}>
            <OdsLink
              href={guide.link}
              label={guide.title}
              icon="external-link"
              target="_blank"
              onClick={() => onGuideClick(guide.id)}
            />
          </div>
        ))}
      </OdsPopover>
    </>
  );
}
