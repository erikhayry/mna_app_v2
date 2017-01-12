import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {DB} from "../../services/db/db";

import {Album} from "../../domain/album";

@Component({
    templateUrl: '../../modals/albumInfo/albumInfo.html'
})

export class AlbumInfo{
    viewCtrl: ViewController;
    db: DB;
    album:Album;
    showCompleteAlbum: boolean;
    showRating: boolean;
    showPlayCount: boolean;

    constructor(viewCtrl: ViewController, params: NavParams, db:DB) {
        this.db = db;
        this.viewCtrl = viewCtrl;
        this.db.getPreferences()
            .then(preferences => {
                this.showCompleteAlbum = preferences.settings_numberOfItems.checked || preferences.settings_playCount.checked;
                this.showPlayCount = preferences.settings_playCount.checked;
                this.showRating = preferences.settings_rating.checked;
                
                this.album = params.get('album');
            });
    }

    close(): void {
        this.viewCtrl.dismiss();
    }

    getStars(rating:number):Array<any>{
        return new Array(rating && rating > 0 ? rating - 1 : 0)
    }

    toBase64Uri = (src: String): String => 'data:image/png;base64,' + src;
}
