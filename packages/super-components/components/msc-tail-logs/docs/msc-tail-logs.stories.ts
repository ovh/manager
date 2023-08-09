export default {
  title: 'Components/Manager tail logs',
  tags: ['autodocs'],
  render: ({ content }: { content: string }) => `
    <section>
      <msc-tail-logs content="${content}" />
    </section>
  `,
  argTypes: {
    content: { control: 'text', default: 'World' },
  },
};

export const StoryExample = {
  args: {
    content: 'Another Example',
  },
};
