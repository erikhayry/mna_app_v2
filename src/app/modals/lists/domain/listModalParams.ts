import {ViewController} from "ionic-angular";
import {ListType} from "../../../domain/listType";
export class ListModalParams {
    viewCtrl: ViewController;
    type: ListType;

    constructor(viewCtrl: ViewController, type: ListType) {
        this.viewCtrl = viewCtrl;
        this.type = type;
    }
}
