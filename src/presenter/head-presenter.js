import ListEventInfoView from '../view/event-info-view.js';
import ListFilterView from '../view/list-filter-view.js';
import {render, RenderPosition} from '../framework/render.js';


export default class HeadPresenter {
  #siteMainContainer = null;

  #listInfo = new ListEventInfoView();
  #ListFilter = new ListFilterView();

  constructor({siteMainContainer}){
    this.#siteMainContainer = siteMainContainer;
  }

  init(){
    render(this.#listInfo, this.#siteMainContainer, RenderPosition.AFTERBEGIN);
    render(this.#ListFilter, this.#siteMainContainer);
  }
}


