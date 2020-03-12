import {
  DEFAULT_DISPLAYED_TILES,
  DISPLAYED_PRODUCTS_NUMBER,
} from './constants';

export default class ProductsController {
  constructor() {
    this.DEFAULT_DISPLAYED_TILES = DEFAULT_DISPLAYED_TILES;
    this.DISPLAYED_PRODUCTS_NUMBER = DISPLAYED_PRODUCTS_NUMBER;
    this.expand = false;
  }

  toggleExpand() {
    this.expand = !this.expand;
  }
}
