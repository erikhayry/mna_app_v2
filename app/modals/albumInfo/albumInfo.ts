import {Page, ViewController, NavParams} from 'ionic-angular';
import {Copy} from "../../services/copy";
import {Album} from "../../domain/album";

@Page({
    templateUrl: 'build/modals/albumInfo/albumInfo.html',
})

export class AlbumInfo{
    viewCtrl: ViewController;
    copy:Object;
    album:Album;

    constructor(viewCtrl: ViewController, params: NavParams, copy:Copy) {
        console.log('AlbumInfo.constructor', params.get('album'));
        this.viewCtrl = viewCtrl;
        this.copy = copy.en;
        this.album = params.get('album');
    }

    close(): void {
        console.log('AlbumInfo.close');
        this.viewCtrl.dismiss();
    }
}
