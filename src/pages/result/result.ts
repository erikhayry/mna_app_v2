import {Component} from '@angular/core';
import {Platform, ToastController, ModalController, ActionSheetController} from 'ionic-angular';

import {AlbumService} from "../../app/services/albumService";
import {DB} from '../../app/services/db/db';
import {Config} from "../../app/services/config/config";

import {Settings} from '../../app/modals/settings/settings';
import {Lists} from '../../app/modals/lists/lists';
import {AlbumInfo} from '../../app/modals/albumInfo/albumInfo';

import {IteratorResultImpl as IteratorResult} from "../../app/domain/iteratorResultImpl";
import {ListType} from "../../app/domain/listType";
import {Album} from "../../app/domain/album";

@Component({
    selector: 'page-result',
    templateUrl: 'result.html',
    providers: [AlbumService, AlbumInfo]
})

export class ResultPage {
    private album: IteratorResult;
    private toastCtrl: ToastController;
    private modalCtrl: ModalController;
    private albumService: AlbumService;
    //private actionSheetCtrl: ActionSheetController;
    private db: DB;
    private error: string;

    private _onSuccess(album: IteratorResult): void {
        this.error = null;
        this.album = album;
    }

    private _onError(error: string): void {
        console.log('ResultPage._onError', error);
        this.error = error;
    }

    private _getAlbums(): void {
        console.log('ResultPage._getAlbums')
        this.error = null;
        this.album = null;
        this.albumService.getAlbums()
            .then(album => {
                    console.log('ResultPage._getAlbum', album)
                    return this._onSuccess(album)
                },
                error => this._onError(error)
            );
    }

    private _presentToast(type:ListType, album: Album) {
        let albumTitle = album.albumTitle || 'Unknown';
        let messageType = '';
        switch(type){
            case ListType.Have:
                messageType = 'Owned List';
                break;
            case ListType.Wanted:
                messageType = 'Wanted List';
                break;
            case ListType.Ignore:
                messageType = 'Ignored List';
                break;
        }
        let toast = this.toastCtrl.create({
            message: albumTitle + ' added to ' + messageType,
            duration: 1500
        });
        toast.present();
    }

    constructor(public actionSheetCtrl: ActionSheetController, toastCtrl: ToastController, modalCtrl: ModalController, platform: Platform, albumService: AlbumService, db: DB) {
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.albumService = albumService;
        this.db = db;
        platform.ready().then(() => this._getAlbums())
    }

    getNextAlbum(): void {
        this.albumService.getNext()
            .then(album => this._onSuccess(album), error => this._onError(error))
    };

    getPrevAlbum(): void {
        this.albumService.getPrev()
            .then(album => this._onSuccess(album), error => this._onError(error))
    };

    toBase64Uri = (src: string): string => 'data:image/png;base64,' + src;

    showSettings(): void {
        let settingsModal = this.modalCtrl.create(Settings, null, Config.modalOptions);
        settingsModal.onDidDismiss(settingsParams => {
            if (settingsParams && (settingsParams.preferencesUpdated || settingsParams.ignoreListUpdated)) {
                this._getAlbums();
            }
        });

        settingsModal.present();
    }

    showIgnoreList(): void {
        let ignoreListModal = this.modalCtrl.create(Lists, null, Config.modalOptions);
        ignoreListModal.onDidDismiss(settingsParams => {
            if (settingsParams && settingsParams.ignoreListUpdated) {
                this._getAlbums();
            }
        });

        ignoreListModal.present();
    }

    showInfo(album: Album): void {
        let infoModal = this.modalCtrl.create(AlbumInfo, {album: album}, Config.modalOptions);
        infoModal.present();
    }

    showListActionSheet(album: IteratorResult) {
        let that = this;
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Add' + album.value.albumTitle + ' to a list',

        });

        actionSheet.addButton({
            text: 'I want',
            handler: () => {
                console.log('addToWantedList', album)
                that._presentToast(ListType.Wanted, album.value);
                that.albumService.addToList(ListType.Wanted, album)
                    .then(album => that._onSuccess(album), error => that._onError(error));
            }
        });

        actionSheet.addButton({
            text: 'I have',
            handler: () => {
                console.log('addToHaveList', album)
                that._presentToast(ListType.Have, album.value);
                that.albumService.addToList(ListType.Have, album)
                    .then(album => that._onSuccess(album), error => that._onError(error));
            }
        });

        actionSheet.addButton({
            text: 'Ignore',
            handler: () => {
                console.log('addToIgnore', album)
                that._presentToast(ListType.Ignore, album.value);
                that.albumService.addToList(ListType.Ignore, album)
                    .then(album => that._onSuccess(album), error => that._onError(error));
            }
        });

        actionSheet.addButton({
            text: 'Cancel',
            handler: () => {
                console.log('Cancel clicked', album);
            }
        });

        actionSheet.present();
    }
}
