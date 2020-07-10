import { fragmentRegister } from '@ovh-ux/ufrontend';

fragmentRegister('navbar', ({ element }) => {
  const template = document.createElement('div');
  template.innerHTML = 'hello world';
  element.appendChild(template);
});
