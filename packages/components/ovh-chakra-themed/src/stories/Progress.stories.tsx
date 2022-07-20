import { Progress, ProgressLabel, SimpleGrid, Stack } from '@chakra-ui/react';
import { ComponentMeta } from '@storybook/react';

export default {
  title: 'Example/Progress',
  component: Progress,
} as ComponentMeta<typeof Progress>;

const TemplateBasic = () => (
  <Stack spacing={4} columns={1}>
    <Progress variant='info' value={25} />
    <Progress variant='success' value={50} />
    <Progress variant='warning' value={75} />
    <Progress variant='error' value={100} />
  </Stack>
);
export const Basic = TemplateBasic.bind({});

const TemplateLabel = () => (
  <Progress value={50}>
    <ProgressLabel>50%</ProgressLabel>
  </Progress>
);
export const Label = TemplateLabel.bind({});
