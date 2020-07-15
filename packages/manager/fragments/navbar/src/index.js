import registerFragment from '@ovh-ux/ufrontend/fragment'; // eslint-disable-line

registerFragment('navbar').then(({ parent, config }) => {
  const template = document.createElement('div');
  template.innerHTML = `Hello ${config.region}`;
  parent.appendChild(template);
});
