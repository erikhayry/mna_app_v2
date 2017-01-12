import {Component} from '@angular/core';
import {Platform, ToastController, ModalController, ActionSheetController} from 'ionic-angular';

import {AlbumService} from "../../services/albumService";
import {DB} from '../../services/db/db';
import {Config} from "../../services/config/config";
import {Copy} from "../../services/copy/copy";
import {CopyLangImpl} from "../../services/copy/domain/copyLangImpl";

import {Settings} from '../../modals/settings/settings';
import {Lists} from '../../modals/lists/lists';
import {AlbumInfo} from '../../modals/albumInfo/albumInfo';

import {IteratorResultImpl as IteratorResult} from "../../domain/iteratorResultImpl";
import {ListType} from "../../domain/listType";
import {Album} from "../../domain/album";

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
    private db: DB;
    private error: string;
    private copy:CopyLangImpl;

    private onSuccess(album: IteratorResult): void {
        this.error = null;
        this.album = album;
    }

    private onError(error: string): void {
        this.error = error;
    }

    private getAlbums(): void {
        this.error = null;
        this.album = null;
        this.albumService.getAlbums()
            .then(album => {
                    return this.onSuccess(album)
                },
                error => this.onError(error)
            );
    }

    private presentToast(type:ListType, album: Album) {
        let albumTitle = album.albumTitle || 'Unknown';
        let messageType = '';
        //TODO to copy
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

    constructor(public actionSheetCtrl: ActionSheetController, toastCtrl: ToastController, modalCtrl: ModalController, platform: Platform, albumService: AlbumService, db: DB, copy: Copy) {
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.albumService = albumService;
        this.db = db;
        this.copy = copy.en;
        platform.ready().then(() => this.getAlbums())
    }

    getNextAlbum(): void {
        this.albumService.getNext()
            .then(album => this.onSuccess(album), error => this.onError(error))
    };

    getPrevAlbum(): void {
        this.albumService.getPrev()
            .then(album => this.onSuccess(album), error => this.onError(error))
    };

    toBase64Uri = (src: string): string => 'data:image/png;base64,' + src;

    showSettings(): void {
        let settingsModal = this.modalCtrl.create(Settings, null, Config.modalOptions);
        settingsModal.onDidDismiss(settingsParams => {
            if (settingsParams && (settingsParams.preferencesUpdated || settingsParams.listUpdated)) {
                this.getAlbums();
            }
        });

        settingsModal.present();
    }

    showLists(): void {
        let listModal = this.modalCtrl.create(Lists, null, Config.modalOptions);
        listModal.onDidDismiss(settingsParams => {
            if (settingsParams && settingsParams.listUpdated) {
                this.getAlbums();
            }
        });

        listModal.present();
    }

    showInfo(album: Album): void {
        let infoModal = this.modalCtrl.create(AlbumInfo, {album: album}, Config.modalOptions);
        infoModal.present();
    }

    showListActionSheet(album: IteratorResult) {
        let that = this;
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Add ' + album.value.albumTitle + ' to a list',

        });

        actionSheet.addButton({
            text: this.copy.result_iWant,
            handler: () => {
                that.presentToast(ListType.Wanted, album.value);
                that.albumService.addToList(ListType.Wanted, album)
                    .then(album => that.onSuccess(album), error => that.onError(error));
            }
        });

        actionSheet.addButton({
            text: this.copy.result_iOwn,
            handler: () => {
                that.presentToast(ListType.Have, album.value);
                that.albumService.addToList(ListType.Have, album)
                    .then(album => that.onSuccess(album), error => that.onError(error));
            }
        });

        actionSheet.addButton({
            text: this.copy.result_ignore,
            handler: () => {
                that.presentToast(ListType.Ignore, album.value);
                that.albumService.addToList(ListType.Ignore, album)
                    .then(album => that.onSuccess(album), error => that.onError(error));
            }
        });

        actionSheet.addButton({
            text: this.copy.result_cancel,
            handler: () => {
            }
        });

        actionSheet.present();
    }
}
