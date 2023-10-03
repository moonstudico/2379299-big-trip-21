import {FilterType} from '../const.js';
import { filter } from '../utils.js';
import AbstractView from '../framework/view/abstract-stateful-view.js';

function createListFilterTemplate(pointModel) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${Object.values(FilterType).reduce((result, item) => {
      const itemKey = item.toLowerCase();
      result += `<div class="trip-filters__filter">
        <input
          id="filter-${itemKey}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter" value="${itemKey}"
          ${item === FilterType.EVERYTHING ? 'checked' : ''}
          ${filter(item, pointModel).length ? '' : 'disabled'}
        >
        <label class="trip-filters__filter-label" for="filter-${itemKey}" data-filter-type="${item}">${item}</label>
      </div>`;
      return result;
    }, '')}
    </form>`
  );
}
export default class ListFilterView extends AbstractView{

  #handleClickTypeFilter = null;
  #pointModel = null;

  constructor({onClickTypeFilter, pointModel}) {
    super();
    this.#handleClickTypeFilter = onClickTypeFilter;
    this.#pointModel = pointModel;
    this.element.addEventListener('click',this.#ClickTypeFilter);
  }

  #ClickTypeFilter = (evt) => {
    console.log(8888888888888888888888888)
    const filterType = evt.target.getAttribute('data-filter-type');
    const filterInput = this.element.querySelector(`#filter-${filterType?.toLowerCase()}`);
    const isFilterDisabled = filterInput?.hasAttribute('disabled');
    if (evt.target.tagName !== 'LABEL' || isFilterDisabled) {
      return;
    }

    this.#handleClickTypeFilter(evt.target.dataset.filterType);
  };

  get template() {
    return createListFilterTemplate(this.#pointModel);
  }
}
