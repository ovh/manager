import React from 'react';

import {
  BaseLayout,
  Breadcrumb,
  Button,
  Link,
  ChangelogMenu,
  Text,
  Datagrid,
  Badge,
  useTranslatedMicroRegions,
  useMe,
} from '@ovh-ux/muk';
import { Button as ODSButton } from '@ovhcloud/ods-react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import {
  Icon,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  TEXT_PRESET,
  BADGE_COLOR,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { dependencies } from '../../../package.json';

console.info('dependencies : ', dependencies);

const changelogLinks = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
};

const changelogChapters: string[] = ['baremetal', 'server', 'dedicated'];

export default function TestPage() {
  const { t } = useTranslation(NAMESPACES.REGION);
  const test = useTranslatedMicroRegions();
  const { me } = useMe();
  const columns = [
    {
      label: 'Name',
      accessorKey: 'name',
    },
    {
      label: 'Age',
      accessorKey: 'age',
    },
  ];
  const data = [
    {
      id: '1',
      name: 'John',
      age: 20,
    },
    {
      id: '2',
      name: 'Jane',
      age: 21,
    },
  ];
  return (
    <BaseLayout
      header={{
        title: 'Test',
        changelogButton: (
          <ChangelogMenu links={changelogLinks} chapters={changelogChapters} />
        ),
      }}
      breadcrumb={<Breadcrumb appName="Test" rootLabel="Test" />}
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      message={
        <Message color={MESSAGE_COLOR.success}>
          <MessageIcon name="circle-check" />
          Votre service a été créé avec succès
        </Message>
      }
    >
      <div>
        <Datagrid columns={columns} data={data} />

        <div className="pt-4">
          <div>
            <Text preset={TEXT_PRESET.heading3}>Text component</Text>
            <Text>hey how are you?</Text>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Button component</Text>
            <Button>Click me</Button>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Link component</Text>
            <Link href="https://www.google.com">Google</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Icon component</Text>
            <Icon name={ICON_NAME.arrowRight} />
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Badge component</Text>
            <Badge color={BADGE_COLOR.information}>Information</Badge>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Tabs component</Text>
            <Link href="#/a-testo/group">TilesInputGroup</Link>
            {/* <TabsComponent items={['Tab 1', 'Tab 2', 'Tab 3']} /> */}
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Recipes component</Text>
            <Link href="#/a-testo/recipes">Recipes</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Web Domains component</Text>
            <Link href="#/a-testo/web-domains">Web Domains</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Listing component</Text>
            <Link href="#/a-testo/listing">Listing</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Nasha component</Text>
            <Link href="#/a-testo/nasha">Nasha</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>All component</Text>
            <Link href="#/a-testo/all">All</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>AgGrid component</Text>
            <Link href="#/a-testo/ag-grid">AgGrid</Link>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Region component</Text>
            <Text>region MAD : {t(`region_MAD`)}</Text>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>Version component</Text>
            <Text>
              version :{' '}
              {dependencies['@ovh-ux/manager-common-translations'] as string}
            </Text>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>
              useTranslatedMicroRegions component
            </Text>
            <Text>
              translateMicroRegion region :{' '}
              {test.translateMicroRegion('EU-WEST-LZ-MAD-A')}
            </Text>
            <Text>
              translateMacroRegion region :{' '}
              {test.translateMacroRegion('EU-WEST-LZ-MAD-A')}
            </Text>
            <Text>
              translateContinentRegion region :{' '}
              {test.translateContinentRegion('EU-WEST-LZ-MAD-A')}
            </Text>
            <Text>
              <div>region_MAD : {t('region_MAD')}</div>
            </Text>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>useMe component</Text>
            <Text>me : {me?.ovhSubsidiary}</Text>
            <Text>me : {me?.currency?.code}</Text>
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>ManagerButton component</Text>
            <ManagerButton
              id="manager-button"
              label="Click me"
              onClick={() => console.info('click')}
            />
          </div>
          <div>
            <Text preset={TEXT_PRESET.heading3}>ODS 19Button component</Text>
            <ODSButton>Click me</ODSButton>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
