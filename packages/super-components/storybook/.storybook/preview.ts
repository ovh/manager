import { Preview } from '@storybook/html';
import { defineCustomElements as defineAccordion } from '@ovhcloud/ods-components/accordion/custom-elements-bundle';
import { defineCustomElements as defineBreadcrumb } from '@ovhcloud/ods-components/breadcrumb/custom-elements-bundle';
import { defineCustomElements as defineButton } from '@ovhcloud/ods-components/button/custom-elements-bundle';
import { defineCustomElements as defineCart } from '@ovhcloud/ods-components/cart/custom-elements-bundle';
import { defineCustomElements as defineCheckbox } from '@ovhcloud/ods-components/checkbox/custom-elements-bundle';
import { defineCustomElements as defineCheckboxButton } from '@ovhcloud/ods-components/checkbox-button/custom-elements-bundle';
import { defineCustomElements as defineChip } from '@ovhcloud/ods-components/chip/custom-elements-bundle';
import { defineCustomElements as defineClipboard } from '@ovhcloud/ods-components/clipboard/custom-elements-bundle';
import { defineCustomElements as defineCode } from '@ovhcloud/ods-components/code/custom-elements-bundle';
import { defineCustomElements as defineCollapsible } from '@ovhcloud/ods-components/collapsible/custom-elements-bundle';
import { defineCustomElements as defineContentAddon } from '@ovhcloud/ods-components/content-addon/custom-elements-bundle';
import { defineCustomElements as defineDivider } from '@ovhcloud/ods-components/divider/custom-elements-bundle';
import { defineCustomElements as defineFlag } from '@ovhcloud/ods-components/flag/custom-elements-bundle';
import { defineCustomElements as defineFormField } from '@ovhcloud/ods-components/form-field/custom-elements-bundle';
import { defineCustomElements as defineIcon } from '@ovhcloud/ods-components/icon/custom-elements-bundle';
import { defineCustomElements as defineInput } from '@ovhcloud/ods-components/input/custom-elements-bundle';
import { defineCustomElements as defineLink } from '@ovhcloud/ods-components/link/custom-elements-bundle';
import { defineCustomElements as defineMenu } from '@ovhcloud/ods-components/menu/custom-elements-bundle';
import { defineCustomElements as defineMessage } from '@ovhcloud/ods-components/message/custom-elements-bundle';
import { defineCustomElements as defineModal } from '@ovhcloud/ods-components/modal/custom-elements-bundle';
import { defineCustomElements as definePagination } from '@ovhcloud/ods-components/pagination/custom-elements-bundle';
import { defineCustomElements as definePassword } from '@ovhcloud/ods-components/password/custom-elements-bundle';
import { defineCustomElements as definePopover } from '@ovhcloud/ods-components/popover/custom-elements-bundle';
import { defineCustomElements as defineProgressBar } from '@ovhcloud/ods-components/progress-bar/custom-elements-bundle';
import { defineCustomElements as defineQuantity } from '@ovhcloud/ods-components/quantity/custom-elements-bundle';
import { defineCustomElements as defineRadio } from '@ovhcloud/ods-components/radio/custom-elements-bundle';
import { defineCustomElements as defineRadioButton } from '@ovhcloud/ods-components/radio-button/custom-elements-bundle';
import { defineCustomElements as defineRange } from '@ovhcloud/ods-components/range/custom-elements-bundle';
import { defineCustomElements as defineSearchBar } from '@ovhcloud/ods-components/search-bar/custom-elements-bundle';
import { defineCustomElements as defineSelect } from '@ovhcloud/ods-components/select/custom-elements-bundle';
import { defineCustomElements as defineSkeleton } from '@ovhcloud/ods-components/skeleton/custom-elements-bundle';
import { defineCustomElements as defineSpinner } from '@ovhcloud/ods-components/spinner/custom-elements-bundle';
import { defineCustomElements as defineSwitch } from '@ovhcloud/ods-components/switch/custom-elements-bundle';
import { defineCustomElements as defineTabs } from '@ovhcloud/ods-components/tabs/custom-elements-bundle';
import { defineCustomElements as defineText } from '@ovhcloud/ods-components/text/custom-elements-bundle';
import { defineCustomElements as defineTextarea } from '@ovhcloud/ods-components/textarea/custom-elements-bundle';
import { defineCustomElements as defineTile } from '@ovhcloud/ods-components/tile/custom-elements-bundle';
import { defineCustomElements as defineToggle } from '@ovhcloud/ods-components/toggle/custom-elements-bundle';
import { defineCustomElements as defineTooltip } from '@ovhcloud/ods-components/tooltip/custom-elements-bundle';

import './define-super-components';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

defineAccordion();
defineBreadcrumb();
defineButton();
defineCart();
defineCheckbox();
defineCheckboxButton();
defineChip();
defineClipboard();
defineCode();
defineCollapsible();
defineContentAddon();
defineDivider();
defineFlag();
defineFormField();
defineIcon();
defineInput();
defineLink();
defineMenu();
defineMessage();
definePagination();
definePassword();
definePopover();
defineProgressBar();
defineQuantity();
defineRadio();
defineRadioButton();
defineRange();
defineSearchBar();
defineSelect();
defineSkeleton();
defineSpinner();
defineSwitch();
defineTabs();
defineText();
defineTextarea();
defineTile();
defineToggle();
defineTooltip();

export default preview;
