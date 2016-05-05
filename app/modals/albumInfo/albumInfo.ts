import {Page, ViewController, NavParams} from 'ionic-angular';
import {Copy} from "../../services/copy";
import {Album} from "../../domain/album";
import {Storage} from "../../services/storage/storage";
import {WithRatingPipe} from "../../pipes/withRating";

@Page({
    templateUrl: 'build/modals/albumInfo/albumInfo.html',
    pipes: [WithRatingPipe]
})

export class AlbumInfo{
    viewCtrl: ViewController;
    storage: Storage;
    copy:Object;
    album:Album;
    showCompleteAlbum: boolean;
    showRating: boolean;
    showPlayCount: boolean;

    constructor(viewCtrl: ViewController, params: NavParams, copy:Copy, storage:Storage) {
        console.log('AlbumInfo.constructor', params.get('album'));
        this.storage = storage;
        this.viewCtrl = viewCtrl;

        this.storage.getPreferences()
            .then(preferences => {
                this.showCompleteAlbum = preferences['relevance.number-of-items'].checked;
                this.showRating = preferences['relevance.play-count'].checked;
                this.showPlayCount = preferences['relevance.rating'].checked;

                this.album = params.get('album');      
                this.copy = copy.en;
            });
    }

    close(): void {
        console.log('AlbumInfo.close');
        this.viewCtrl.dismiss();
    }

    getStars(rating:number):Array<any>{
        return new Array(rating && rating > 0 ? rating - 1 : 0)
    }
}
