import {
  Text,
  Button,
  Badge,
  Skeleton,
  Clipboard,
  Icon,
  Link,
  ICON_NAME,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ActionMenu } from '@ovh-ux/muk';

import { DashboardBox } from './dashboard-box';
const actionItems = [
  {
    id: 1,
    href: 'https://ovhcloud.com',
    label: 'Action 1',
  },
  {
    id: 2,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'Action 2',
  },
];

const RecipesComponent = () => {
  return (
    <>
      <div>
        <Text preset={TEXT_PRESET.heading1}>Recipes Page</Text>
      </div>
      <div>
        <Text preset={TEXT_PRESET.heading2}>Dashboard Box</Text>
        <div className="w-1/3">
          <DashboardBox.Root title="Dashboard Box 1">
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Dashboard Box 1" />
              <DashboardBox.Item.Description label="Dashboard Box 1" />
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Dashboard Box 2" />
              <DashboardBox.Item.Description label="Dashboard Box 2" />
            </DashboardBox.Item.Root>
          </DashboardBox.Root>
        </div>
        <br />
        <div className="w-1/3">
          <DashboardBox.Root title="Tile Header">
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Sample Term" />
              <DashboardBox.Item.Description label="Sample Description" />
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term
                label="Edit Desription"
                tooltip="Lorem ipsum dolor sit amet."
              />
              <DashboardBox.Item.Description>
                <div className="flex justify-between">
                  <Text preset="span">Sample Description</Text>
                  <Button variant="ghost" size="xs">
                    <Icon name={ICON_NAME.pen}></Icon>
                  </Button>
                </div>
              </DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Long Text" />
              <DashboardBox.Item.Description>
                <Text preset="paragraph">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
              </DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Item with Description & Link"></DashboardBox.Item.Term>
              <DashboardBox.Item.Description
                label="Lorem ipsum dolor sit amet"
                divider={false}
              ></DashboardBox.Item.Description>
              <DashboardBox.Item.Description>
                <Link href="https://www.ovhcloud.com">
                  Link <Icon name={ICON_NAME.externalLink} />
                </Link>
              </DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Item with Badge"></DashboardBox.Item.Term>
              <DashboardBox.Item.Description>
                <Badge>Coming Soon</Badge>
              </DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Loading" />
              <DashboardBox.Item.Description>
                <Skeleton />
              </DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term label="Clipboard" />
              <DashboardBox.Item.Description>
                <Clipboard className="w-full" value="example value" />
              </DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
            <DashboardBox.Item.Root>
              <DashboardBox.Item.Term
                label="Action Menu"
                actions={
                  <ActionMenu id="action-menu" isCompact items={actionItems} />
                }
              />
              <DashboardBox.Item.Description
                label="Test Value"
                divider={false}
              ></DashboardBox.Item.Description>
            </DashboardBox.Item.Root>
          </DashboardBox.Root>
        </div>
      </div>
    </>
  );
};

export default RecipesComponent;
