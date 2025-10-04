import React, { useId } from 'react';
import { Meta } from '@storybook/react';
import {
  Skeleton,
  Text,
  Link,
  Icon,
  ICON_NAME,
  Badge,
  Button,
} from '@ovhcloud/ods-react';
import { Clipboard, ActionMenu, Tile } from '@ovh-ux/manager-ui-kit';

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

export const SimpleTile = () => (
  <Tile.Root title="Sample Tile Header">
    <Tile.Item.Root>
      <Tile.Item.Term label="Term" />
      <Tile.Item.Description label="Description" />
    </Tile.Item.Root>
    <Tile.Item.Root>
      <Tile.Item.Term label="Last Term" />
      <Tile.Item.Description divider={false}>
        <Text>Description without Divider</Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  </Tile.Root>
);

export const TileWithLink = () => (
  <Tile.Root title="Sample Tile Header">
    <Tile.Item.Root>
      <Tile.Item.Term label="Term" />
      <Tile.Item.Description label="Description" />
    </Tile.Item.Root>
    <Tile.Item.Root>
      <Tile.Item.Term label="Last Term" />
      <Tile.Item.Description divider={false} label="Sample Description" />
      <Tile.Item.Description>
        <Link href="https://www.ovhcloud.com">
          Link <Icon name={ICON_NAME.externalLink} />
        </Link>
      </Tile.Item.Description>
    </Tile.Item.Root>
  </Tile.Root>
);

export const TileWithActionMenuAndTooltip = () => (
  <Tile.Root title="Sample Tile Header">
    <Tile.Item.Root>
      <Tile.Item.Term
        label="Term"
        tooltip="Lorem ipsum dolor sit amet."
        actions={<ActionMenu id="action-menu" items={actionItems} isCompact />}
      />
      <Tile.Item.Description label="Description" />
    </Tile.Item.Root>
    <Tile.Item.Root>
      <Tile.Item.Term label="Last Term" />
      <Tile.Item.Description divider={false} label="Sample Description" />
    </Tile.Item.Root>
  </Tile.Root>
);

export const CompleteExample = () => {
  const id = useId();
  return (
    <div className="w-1/3">
      <Tile.Root title="Tile Header">
        <Tile.Item.Root>
          <Tile.Item.Term label="Sample Term" />
          <Tile.Item.Description label="Sample Description" />
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term
            label="Edit Desription"
            tooltip="Lorem ipsum dolor sit amet."
          />
          <Tile.Item.Description>
            <div className="flex justify-between">
              <Text preset="span">Sample Description</Text>
              <Button variant="ghost" size="xs">
                <Icon name={ICON_NAME.pen}></Icon>
              </Button>
            </div>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Long Text" />
          <Tile.Item.Description>
            <Text preset="paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Item with Description & Link"></Tile.Item.Term>
          <Tile.Item.Description
            label="Lorem ipsum dolor sit amet"
            divider={false}
          ></Tile.Item.Description>
          <Tile.Item.Description>
            <Link href="https://www.ovhcloud.com">
              Link <Icon name={ICON_NAME.externalLink} />
            </Link>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Item with Badge"></Tile.Item.Term>
          <Tile.Item.Description>
            <Badge>Coming Soon</Badge>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Loading" />
          <Tile.Item.Description>
            <Skeleton />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Clipboard" />
          <Tile.Item.Description>
            <Clipboard className="w-full" value="example value" />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term
            label="Action Menu"
            actions={
              <ActionMenu id="action-menu" isCompact items={actionItems} />
            }
          />
          <Tile.Item.Description
            label="Test Value"
            divider={false}
          ></Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
    </div>
  );
};

const meta: Meta = {
  title: 'Manager UI Kit/Content/Tile',
  component: Tile,
  argTypes: {},
  args: {},
};

export default meta;
