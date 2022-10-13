import {
  Badge,
  Checkbox,
  CheckboxGroup,
  HStack,
  Stack,
  chakra,
} from '@chakra-ui/react';
import {
  CheckIcon,
  IndeterminateIcon,
  ThumbnailCheckbox,
} from '@ovh-ux/manager-themes';
import { useState } from 'react';

export default {
  title: 'Example/Checkboxs',
  component: Checkbox,
};

const Template = () => (
  <CheckboxGroup>
    <Stack>
      <Checkbox icon={<CheckIcon />}>Value A</Checkbox>
      <Checkbox icon={<CheckIcon />}>Value B</Checkbox>
      <Checkbox icon={<CheckIcon />}>Value C</Checkbox>
    </Stack>
  </CheckboxGroup>
);

const TemplateDisabled = () => (
  <CheckboxGroup>
    <Stack>
      <Checkbox icon={<CheckIcon />} isDisabled>
        Value B
      </Checkbox>
      <Checkbox icon={<CheckIcon />} isChecked isDisabled>
        Value C
      </Checkbox>
      <Checkbox icon={<CheckIcon />} isChecked isInvalid isDisabled>
        Value D
      </Checkbox>
    </Stack>
  </CheckboxGroup>
);

const TemplateInvalid = () => (
  <CheckboxGroup>
    <Stack>
      <Checkbox icon={<CheckIcon />} isInvalid>
        Value B
      </Checkbox>
      <Checkbox icon={<CheckIcon />} isChecked isInvalid>
        Value C
      </Checkbox>
    </Stack>
  </CheckboxGroup>
);

const TemplateThumbnail = () => (
  <>
    <CheckboxGroup defaultValue={['ax', 'bx']}>
      <HStack>
        <ThumbnailCheckbox
          isInvalid
          checkboxTitle="Value Ax"
          value="ax"
        ></ThumbnailCheckbox>
        <ThumbnailCheckbox
          checkboxTitle="Value Bx"
          value="bx"
        ></ThumbnailCheckbox>
        <ThumbnailCheckbox
          checkboxTitle="Value Cx"
          value="cx"
          isDisabled
        ></ThumbnailCheckbox>
        <ThumbnailCheckbox
          checkboxTitle="Value Dx"
          value="dx"
        ></ThumbnailCheckbox>
      </HStack>
    </CheckboxGroup>

    <ThumbnailCheckbox
      checkboxTitle="Value A"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      footerText="Lorem ipsum dolor sit amet"
      value="va"
      isInvalid
    ></ThumbnailCheckbox>
    <ThumbnailCheckbox
      checkboxTitle="Value B"
      description="Pellentesque euismod magna rutrum lectus gravida semper."
      footerText="Pellentesque habitant morbi tristique"
      value="vb"
      defaultChecked
    ></ThumbnailCheckbox>
    <ThumbnailCheckbox
      checkboxTitle={
        <>
          <HStack spacing="1">
            <chakra.span>Value C </chakra.span>
            <Badge variant="new">New</Badge>
          </HStack>
        </>
      }
      description="Pellentesque euismod magna rutrum lectus gravida semper."
      footerText="Pellentesque habitant morbi tristique"
      value="vc"
    ></ThumbnailCheckbox>
  </>
);

const TemplateIndeterminate = () => {
  const [checkedItems, setCheckedItems] = useState([false, false]);

  const indeterminate = !checkedItems.some(Boolean);

  return (
    <CheckboxGroup>
      <Stack>
        <Checkbox
          icon={<CheckIcon />}
          isChecked={checkedItems[0]}
          onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
        >
          Value A
        </Checkbox>
        <Checkbox
          icon={indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
          isChecked={checkedItems[1]}
          isIndeterminate={indeterminate}
        >
          Value B
        </Checkbox>
      </Stack>
    </CheckboxGroup>
  );
};

export const Default = Template.bind({});
export const Indeterminate = TemplateIndeterminate.bind({});
export const Disabled = TemplateDisabled.bind({});
export const Invalid = TemplateInvalid.bind({});
export const Thumbnail = TemplateThumbnail.bind({});
