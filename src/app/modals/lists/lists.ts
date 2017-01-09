import { Component } from '@angular/core';
import { IgnoreList } from './ignoreList';
import { WantedList } from './wantedList';
import { HaveList } from './haveList';
import {ViewController} from "ionic-angular";

@Component({
    template: `
    <ion-header>
        <ion-toolbar>
            <ion-buttons start>
                <button (click)="close()" ion-button icon-only clear round>
                    <ion-icon ion-text color="dark" name="ios-close"></ion-icon>
                </button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-tabs>
      <ion-tab tabTitle="Wanted" [root]="wantedList"></ion-tab>
      <ion-tab tabTitle="Have" [root]="haveList"></ion-tab>
      <ion-tab tabTitle="Ignored" [root]="ignoreList"></ion-tab>
    </ion-tabs>`
})
export class Lists {
    ignoreList: any;
    haveList: any;
    wantedList: any;
    viewCtrl: ViewController

    constructor(viewCtrl: ViewController) {
        this.ignoreList = IgnoreList;
        this.haveList = HaveList;
        this.wantedList = WantedList;
        this.viewCtrl = viewCtrl

    }
    close(): void {
        this.viewCtrl.dismiss({
            ignoreListUpdated: true //TODO
        });
    }
}
