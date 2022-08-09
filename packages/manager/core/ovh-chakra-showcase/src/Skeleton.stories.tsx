import { SimpleGrid, Skeleton } from '@chakra-ui/react';

export default {
  title: 'Example/Skeletons',
  component: Skeleton,
};

const TemplateBasic = () => <Skeleton height={'.5rem'} />;
export const Basic = TemplateBasic.bind({});

const TemplateWrap = () => (
  <SimpleGrid columns={1} spacingY={'1rem'}>
    <Skeleton>
      <div>contents wrapped</div>
      <div>won't be visible</div>
    </Skeleton>
    <Skeleton>
      <div>contents wrapped</div>
    </Skeleton>
    <Skeleton>
      <div>won't be visible</div>
    </Skeleton>
  </SimpleGrid>
);
export const Wrap = TemplateWrap.bind({});
