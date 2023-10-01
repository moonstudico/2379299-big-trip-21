import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointModel extends Observable {
  #offers = [];
  #destinations = [];
  #points = [];
  #pointsApiService = null;
  #offersApiService = null;
  #destinationsApiService = null;

  constructor({pointsApiService, offersApiService, destinationsApiService}){
    super();
    this.#pointsApiService = pointsApiService;
    this.#offersApiService = offersApiService;
    this.#destinationsApiService = destinationsApiService;
  }

  get points(){
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
      this.#offers = await this.#offersApiService.offers;
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }


  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #mapOfferToPoint(point){
    const offersType = this.#offers.find((offer) => offer.type === point.type);
    return point.offers.map((offerId) =>
      offersType.offers.find((offer) => offer.id === offerId)
    );
  }

  #mapDestinationToPoint(point){
    return this.#destinations.find((destination) => destination.id === point.destination);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      'dateFrom': point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      'dateTo': point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      'price': point.base_price,
      'isFavorite': point.is_favorite,
      offers: this.#mapOfferToPoint(point),
      destination: this.#mapDestinationToPoint(point)
    };

    // Зачем удалять
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  };
}
