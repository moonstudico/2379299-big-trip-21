import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointModel extends Observable {
  #points = [];
  #pointsApiService = null;

  constructor({pointsApiService}){
    super();
    this.#pointsApiService = pointsApiService;

    // this.#pointApiService.points.then((points) =>{
    //   console.log(points.map(this.#adaptToClient));
    // });


  }

  get points(){
    return this.#points;
  }

  async init() {
    console.log(88888888888);
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      console.log(444444444444, this.#points);
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


  #adaptToClient(point) {
    const adaptedPoint = {...point,
      'dateFrom': point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      'dateTo': point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      'price': point.base_price,
      'isFavorite': point.is_favorite,
    };

    // Зачем удалять
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;

  }


}
