import { render } from '../../../utils/test.provider';
import { GridLayout } from '../GridLayout.component';
import { Tile } from '../../tile';
import { Text } from '../../text';

describe('GridLayout Snapshot Tests', () => {
  it('should render empty grid layout', () => {
    const { container } = render(<GridLayout />);
    expect(container).toMatchSnapshot();
  });

  it('should render grid layout with children', () => {
    const DashboardTiles = [
      {
        title: 'General Informations',
        label: 'Sample Term',
        description: 'Sample Description',
      },
      {
        title: 'Second child',
        label: 'Second child',
        description: 'Sample Description',
      },
      {
        title: 'Third child',
        label: 'Third child',
        description: 'Sample Description',
      },
    ];
    const { container } = render(
      <GridLayout>
        {DashboardTiles.map((element) => (
          <Tile.Root title={element.title}>
            <Tile.Item.Root>
              <Tile.Item.Term label={element.label}></Tile.Item.Term>
              <Tile.Item.Description>
                <Text>{element.description}</Text>
              </Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>
        ))}
      </GridLayout>,
    );

    expect(container).toMatchSnapshot();
  });
});
