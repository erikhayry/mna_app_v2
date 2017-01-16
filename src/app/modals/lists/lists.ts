import {Component} from '@angular/core';
import {List} from './list';
import {ViewController} from "ionic-angular";
import {ListType} from "../../domain/listType";
import {ListModalParams} from "./domain/listModalParams";
import {Copy} from "../../services/copy/copy";
import {CopyLangImpl} from "../../services/copy/domain/copyLangImpl";

@Component({
    template: `
    <ion-tabs>
      <ion-tab [tabTitle]="wantedTabTitle" [root]="list" [rootParams]="wanted"></ion-tab>
      <ion-tab [tabTitle]="ownedTabTitle" [root]="list" [rootParams]="owned"></ion-tab>
      <ion-tab [tabTitle]="ignoredTabTitle" [root]="list" [rootParams]="ignored"></ion-tab>
    </ion-tabs>`
})
export class Lists {
    list: any;
    viewCtrl: ViewController;
    ownedTabTitle: string;
    wantedTabTitle: string;
    ignoredTabTitle: string;

    owned: ListModalParams;
    wanted: ListModalParams;
    ignored: ListModalParams;

    copy: CopyLangImpl;

    constructor(viewCtrl: ViewController, copy: Copy) {
        this.list = List;
        this.copy = copy.en;
        this.ownedTabTitle = this.copy.lists_owned;
        this.wantedTabTitle = this.copy.lists_wanted;
        this.ignoredTabTitle = this.copy.lists_ignored;
        this.owned = new ListModalParams(viewCtrl, ListType.Owned);
        this.wanted = new ListModalParams(viewCtrl, ListType.Wanted);
        this.ignored = new ListModalParams(viewCtrl, ListType.Ignored);
    }
}
