import { FragmentApi } from '@ovh-ux/ovh-ufrontend';
import template from './index.html';

FragmentApi.register('navbar', (element) => {
  const templateElt = document.createElement('template');
  templateElt.innerHTML = template;
  element.appendChild(templateElt.content.firstChild);
});
