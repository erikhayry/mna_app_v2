import {Component} from '@angular/core';
import {List} from './list';
import {ViewController} from "ionic-angular";
import {ListType} from "../../domain/listType";
import {ListModalParams} from "./domain/listModalParams";

@Component({
    template: `
    <ion-tabs>
      <ion-tab tabTitle="Wanted" [root]="list" [rootParams]="wanted"></ion-tab>
      <ion-tab tabTitle="Have" [root]="list" [rootParams]="have"></ion-tab>
      <ion-tab tabTitle="Ignored" [root]="list" [rootParams]="ignore"></ion-tab>
    </ion-tabs>`
})
export class Lists {
    list: any;
    viewCtrl: ViewController;

    have: ListModalParams;
    wanted: ListModalParams;
    ignore: ListModalParams;

    constructor(viewCtrl: ViewController) {
        this.list = List;
        this.have = new ListModalParams(viewCtrl, ListType.Have);
        this.wanted = new ListModalParams(viewCtrl, ListType.Wanted);
        this.ignore = new ListModalParams(viewCtrl, ListType.Ignore);
    }
}
