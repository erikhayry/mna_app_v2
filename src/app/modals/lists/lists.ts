import {Component} from '@angular/core';
import {List} from './list';
import {ViewController} from "ionic-angular";
import {ListType} from "../../domain/listType";

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

    //TODO
    have: any;
    wanted: any;
    ignore: any;

    constructor(viewCtrl: ViewController) {
        this.list = List;

        this.have = {
            viewCtrl: viewCtrl,
            type: ListType.Have
        };

        this.wanted = {
            viewCtrl: viewCtrl,
            type: ListType.Wanted
        };

        this.ignore = {
            viewCtrl: viewCtrl,
            type: ListType.Ignore
        }
    }
}
