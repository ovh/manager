/* eslint-disable no-undef */
import { Selector } from 'testcafe';

const elementByXPath = Selector((xpath) => {
  const iterator = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null,
  );
  const items = [];

  let item = iterator.iterateNext();

  while (item) {
    items.push(item);
    item = iterator.iterateNext();
  }

  return items;
});

export default function (xpath) {
  return Selector(elementByXPath(xpath));
}
