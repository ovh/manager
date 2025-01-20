import { OdsClipboard } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import Clipboard from './Clipboard';

const longLorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error illo molestias aliquid quidem nobis, dolor nisi porro iusto tempora assumenda consectetur voluptatum veritatis expedita! Aut eligendi ex eaque quaerat soluta quasi! Eius eveniet eum doloribus. Sit quaerat vitae doloribus corrupti numquam quidem eos sequi earum saepe soluta enim provident commodi, laborum, nostrum aperiam nobis iusto architecto dolorem. Excepturi minus, error nulla ipsam iste deleniti nobis cupiditate distinctio itaque enim magni iure exercitationem qui animi nesciunt ex officiis delectus corrupti repellat eius accusamus. Temporibus unde facilis ipsam labore, est perspiciatis tempora consectetur quisquam debitis sit? Dicta dolor aliquid, repellat explicabo ipsam totam nostrum necessitatibus quisquam voluptatum quae ad reprehenderit voluptatibus impedit sunt magni veritatis, eius laudantium, possimus repudiandae deleniti commodi adipisci harum. Pariatur labore aliquam praesentium similique. Possimus velit perferendis nam ratione. Consectetur, doloremque cupiditate sunt assumenda dignissimos excepturi. Enim sint quo obcaecati, consequuntur excepturi dicta, impedit sequi blanditiis hic ex ea, ipsum cum quidem distinctio eius doloremque. Explicabo, deleniti ducimus distinctio dolorem saepe quis atque vero sint, assumenda excepturi aperiam impedit accusantium ipsa itaque harum dicta asperiores nulla totam aliquam optio labore incidunt? Quod, aperiam obcaecati dolorem quo molestiae, harum culpa id natus optio officiis corrupti libero assumenda et quia ducimus debitis nulla incidunt, eius accusamus est voluptatum saepe? Repellendus laudantium ea cupiditate, consequatur eligendi dicta eos tempora, architecto maxime nulla nihil impedit officiis voluptatibus illo doloremque aspernatur vero voluptas sapiente hic sit incidunt saepe odio necessitatibus. Officiis nam reiciendis laboriosam. Labore voluptate cupiditate tempore sint. Laudantium molestiae et fugiat culpa ipsam delectus deserunt aliquid sed quasi, placeat nemo hic optio perspiciatis tempora reprehenderit omnis autem, iste laborum. Repellat excepturi, illum nesciunt omnis necessitatibus, cupiditate atque est veniam pariatur architecto saepe earum aut nisi nulla, consequatur impedit. Vel, quam reprehenderit porro ducimus libero nesciunt, quas nostrum ex deleniti quis expedita.';

export default {
  story: 'Long clipboard',
  customComponentExemple: (
    <Clipboard text={longLorem} buttonTooltip="Copier" className="max-w-md" />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsClipboard value={longLorem} className="max-w-md" />,
  ODSComponentResult: StoryResult.warning,
};
