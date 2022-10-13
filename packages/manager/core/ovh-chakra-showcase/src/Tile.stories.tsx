import { Tile, TileSection, TileSectionGroup } from '@ovh-ux/manager-themes';
import { Button, Progress } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

export default {
  title: 'Example/Tiles',
  component: Tile,
};

const Template = () => (
  <Tile title="An awesome title for an awesome tile">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus sapien
    erat, et molestie magna tristique non. Sed tincidunt eu augue tempor
    consectetur. Nullam iaculis, nibh mollis vulputate elementum, neque est
    iaculis nisi, et gravida turpis erat non dui. Nunc eget tortor et enim
    interdum euismod sed eget purus. Integer in metus ultrices, ultricies lacus
    in, fermentum nisi. Cras sed neque id dui fermentum faucibus. Mauris mollis
    arcu justo, eget convallis massa volutpat ac.
  </Tile>
);
const TemplateButtons = () => (
  <Tile title="An awesome title for an awesome tile">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    <TileSectionGroup>
      <TileSection sectionType="button">Button 1</TileSection>
      <TileSection sectionType="button">Button 2</TileSection>
      <TileSection sectionType="button">Button 3</TileSection>
      <TileSection sectionType="button" isDisabled>
        Button 4 (disabled)
      </TileSection>
      <TileSection sectionType="button" isDisabled>
        Button 5 (disabled)
      </TileSection>
    </TileSectionGroup>
  </Tile>
);

const TemplateDetails = () => (
  <Tile title="An awesome title for an awesome tile">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    <TileSectionGroup>
      <TileSection title="Term" description="This is a description" />
      <TileSection title="Term" description="This is a description" />
      <TileSection
        title="Term"
        description="This is a description with a menu"
      />
      <TileSection
        title="Term"
        description="This is a description with a button"
        action={
          <Button variant="secondary" rightIcon={<ChevronRightIcon />}>
            Action
          </Button>
        }
      />
      <TileSection
        title="Term"
        description={<Progress value={80} colorScheme="success" />}
      ></TileSection>
    </TileSectionGroup>
  </Tile>
);

const TemplateBox = () => (
  <>
    <h2>Default box</h2>
    <Tile title="An awesome title for an awesome tile" variant="box">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus sapien
      erat, et molestie magna tristique non. Sed tincidunt eu augue tempor
      consectetur. Nullam iaculis, nibh mollis vulputate elementum, neque est
      iaculis nisi, et gravida turpis erat non dui. Nunc eget tortor et enim
      interdum euismod sed eget purus. Integer in metus ultrices, ultricies
      lacus in, fermentum nisi. Cras sed neque id dui fermentum faucibus. Mauris
      mollis arcu justo, eget convallis massa volutpat ac.
    </Tile>
    <br />
    <h2>Light box</h2>
    <Tile title="An awesome title for an awesome tile" variant="light-box">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus sapien
      erat, et molestie magna tristique non. Sed tincidunt eu augue tempor
      consectetur. Nullam iaculis, nibh mollis vulputate elementum, neque est
      iaculis nisi, et gravida turpis erat non dui. Nunc eget tortor et enim
      interdum euismod sed eget purus. Integer in metus ultrices, ultricies
      lacus in, fermentum nisi. Cras sed neque id dui fermentum faucibus. Mauris
      mollis arcu justo, eget convallis massa volutpat ac.
    </Tile>
  </>
);

export const Default = Template.bind({});
export const Box = TemplateBox.bind({});
export const Buttons = TemplateButtons.bind({});
export const Details = TemplateDetails.bind({});
