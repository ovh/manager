/**
 * Return first X characters of email + it's domain.
 * If no X provided, a default value of 30 is used.
 * Example : azertyuiop@ovh.net  >  azer...@ovh.net if index=4
 */
const slice = (content, _index) => {
  const index = _index && _index > 0 ? _index : 50;
  let result = content.slice(0, index);

  if (content.length > index) {
    result += '…';
  }

  return result;
};

export default (content, index) => {
  if (content) {
    const indexOfAt = content.indexOf('@');
    const login = content.slice(0, indexOfAt);
    const domain = content.slice(indexOfAt, content.length);

    return slice(login, index) + domain;
  }
  return '';
};
