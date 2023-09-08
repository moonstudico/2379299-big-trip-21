import { POINT__TYPE, DESTINATION } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {convertToCustomFormat} from '../utils.js';
import {allOffers} from '../mock/point.js';

function findOffersCurrentType(Offers, targetType) {
  const matchedType = Offers.find((offerGroup) => offerGroup.type === targetType);
  return matchedType ? matchedType.offers : [];
}

const Mode = {
  CREATE: 'Cancel',
  EDIT: 'Delate'
};

const DEFAULT__POINT = {
  basePrice: 1100,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo:  '2019-07-11T11:22:13.375Z',
  destination: 11,
  isFavorite: false,
  offers: [1],
  type: 'taxi'
};

function createFormTemplate(point) {
  const{destination, type, dateFrom, dateTo, basePrice, offers, ID} = point;
  const timeFrom = convertToCustomFormat(dateFrom);
  const timeTo = convertToCustomFormat(dateTo);


  const currentDestinationPictures = destination.pictures.reduce((result, item) => {
    const {src, description} = item;
    result += `<img class="event__photo" src="${src}" alt="${description}">`;
    return result;
  }, '');

  const typeGroupHTML = POINT__TYPE.reduce((result, item) => {
    const itemKey = item.toLowerCase();
    result += `<div class="event__type-item">
      <input id="event-type-${itemKey}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${itemKey}"${item === type ? 'checked' : ''} >
      <label class="event__type-label  event__type-label--${itemKey}" for="event-type-${itemKey}-1">${item}</label>
      </div>`;
    return result;
  }, '');

  const destinationGroupHTML = DESTINATION.reduce((result, item) => {
    result += `<option value="${item}"></option>`;
    return result;
  }, '');

  function createEventOffersGroup(currentType, currentOffers){
    const offersForType = findOffersCurrentType(allOffers, currentType);
    const offersGroup = offersForType.reduce((result, item) => {

      const { title, price, id } = item;
      const titleKey = title.toLowerCase();
      const currentOffer = currentOffers.find((el)=> el.id === id);
      result += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleKey}-1" type="checkbox" name="event-offer-${titleKey}" ${currentOffer ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${titleKey}-1">
        <span class="event__offer-title">${title}class</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;

      return result;
    }, '');

    return offersGroup;
  }

  const offersGroupHTML = createEventOffersGroup(type, offers);

  // нужен ли нам этот ID может делать сортировку по id
  function openClouseEvent(ID){
    if (!ID){
      return`
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`;
    }
  }
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeGroupHTML}


              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${destinationGroupHTML}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${!ID ? Mode.CREATE : Mode.EDIT }</button>
          ${openClouseEvent()}
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${offersGroupHTML}
            </div>
          </section>


          <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${currentDestinationPictures}
            </div>
          </div>
        </section>


        </section>
      </form>
    </li>`
  );
}

export default class ListFormView extends AbstractStatefulView{
  #point = null;
  #handleOnFormSubmit = null;
  #handleOnClick = null;

  constructor({point = DEFAULT__POINT, onClickButton, onFormSubmit}){
    super();
    this._setState(ListFormView.parseTaskToState(point));
    this.#handleOnFormSubmit = onFormSubmit;
    this.#handleOnClick = onClickButton;

    this._restoreHandlers();


    // this.element.querySelector('.event__type-item').addEventListener('click', this.#destinationChangeHandler);
  }

  get template() {
    return createFormTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandle);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-wrapper').addEventListener('click', this.#typePointChangeHandler);
  };

  #formSubmitHandle = (evt) => {
    evt.preventDefault();
    this.#handleOnFormSubmit(ListFormView.parseStateToTask(this._state));

  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleOnClick();
  };

  static parseTaskToState(point){
    return{...point};
  }

  static parseStateToTask(state) {
    const point = {...state};

    return point;
  }

  #priceInputHandler = (evt) => {
    this._setState({
      price: evt.target.value,
    });
    console.log(this._state);
  };


  #typePointChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__type-label')) {
      const updatedState = {
        type: evt.target.textContent,
        offers: []
      };
      this.updateElement(updatedState);
    }
  };


  #destinationChangeHandler = (evt) => {
    this.updateElement({
      destination: evt.target.value,
    });
  };

}

