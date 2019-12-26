import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import remove from 'lodash/remove';
/**
 *  @name CucOrderedHashFactory
 *  @type factory
 *  @description
 *  This factory implement a kind of [HashTable](http://en.wikipedia.org/wiki/Hash_table). This implementation enable to keep items ordered.
 *  A small history :
 *  In /cloud infrastructure, it began to be overkill to always make a _.find to get a VM or an IP.
 *  So to keep sorted items we decide to create a object with this structure :
 *  ```javascript
 *  {
 *      sortedKeys : [],
 *      items : {}
 *  }
 *  ```
 *  So it's more easy to get an item by getting it by its id.
 *
 *  @usage
 *  ```javascript
 *  // inject CucOrderedHashFactory as a dependency of your controller/factory/service/...
 *  .module('myApp')
 *    .controller('myController', function myController(CucOrderedHashFactory) {
 *      // init CucOrderedHashFactory object
 *      this.myHash = new CucOrderedHashFactory();
 *      // push an object
 *      // the myHash object will look like :
 *      // {
 *      //   sortedKeys: [7712],
 *      //   items: { 7712: { id: 7712, firstname: 'Boris', name: 'Yeltsin', country: 'Russia' } }
 *      // }
 *      this.myHash.push({ id: 7712, firstname: 'Boris', name: 'Yeltsin', country: 'Russia' });
 *      // get an item
 *      // will return: { id: 7712, firstname: 'Boris', name: 'Yeltsin', country: 'Russia' }
 *      var myItem = this.myHash.get(7712);
 *      // get all items
 *      // will return: [{ id: 7712, firstname: 'Boris', name: 'Yeltsin', country: 'Russia' }]
 *      var myItems = this.getItems();
 *  });
 *  ```
 */

export default () => {
  // /////////////////////////
  //      CONSTRUCTOR      //
  // /////////////////////////

  const OrderedHash = (function init() {
    return function CucOrderedHashFactory(optionsParam) {
      let options = optionsParam;
      if (!options) {
        options = {};
      }

      this.accessKey = options.accessKey || 'id';
      this.sortedKeys = [];
      this.items = {};
    };
  })();

  // /////////////////////
  //      METHODS      //
  // /////////////////////

  OrderedHash.prototype.push = function push(item) {
    const itemKey = item[this.accessKey];

    if (!item[this.accessKey]) {
      return;
    }

    this.items[itemKey] = item;
    this.sortedKeys.push(itemKey);
  };

  OrderedHash.prototype.getItems = function getItems() {
    const self = this;
    return map(this.sortedKeys, (itemKey) => self.items[itemKey]);
  };

  OrderedHash.prototype.removeItem = function removeItem(item) {
    const itemKey = typeof item === 'object' ? item[this.accessKey] : item;
    delete this.items[itemKey];
    remove(this.sortedKeys, (key) => key === itemKey);
  };

  OrderedHash.prototype.get = function get(item) {
    return this.items[this.checkItemKey(item)];
  };

  OrderedHash.prototype.length = function length() {
    return this.sortedKeys.length;
  };

  OrderedHash.prototype.checkItemKey = function checkItemKey(item) {
    return typeof item === 'object' ? item[this.accessKey] : item;
  };

  OrderedHash.prototype.replaceItem = function replaceItem(oldItem, newItem) {
    const oldItemKey =
      typeof oldItem === 'object' ? oldItem[this.accessKey] : oldItem;

    const oldKeyIndex = indexOf(this.sortedKeys, oldItemKey);

    const newItemKey =
      typeof newItem === 'object' ? newItem[this.accessKey] : newItem;

    const newItemKeyIndex = indexOf(this.sortedKeys, newItemKey);

    if (oldKeyIndex > -1) {
      // if new item is already in the list, we first remove it
      // then it will be added in place of oldItem (it's basically "move item" to oldItem place)
      if (newItemKeyIndex > -1) {
        this.removeItem(newItem);
      }
      this.sortedKeys[oldKeyIndex] = newItemKey;
      delete this.items[oldItemKey];
      this.items[newItemKey] = newItem;
    }
  };

  return OrderedHash;
};
