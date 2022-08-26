import AbstractView from '../framework/view/abstract-view';

const createFilterItemsTemplate = (filters) =>
  Object.entries(filters).map(([,filter]) =>{
    const filterName = filter.name;
    const isChecked = filter.isChecked;
    const isDisabled = filter.isDisabled;

    return `<div class="trip-filters__filter">
      <input
        id="filter-${filterName}"
        class="trip-filters__filter-input
        visually-hidden" type="radio"
        name="trip-filter"
        value="${filterName}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>`;}).join('');

const createFilterTemplate = (filters) => (
  `<form class="trip-filters" action="#" method="get">
    ${createFilterItemsTemplate(filters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
