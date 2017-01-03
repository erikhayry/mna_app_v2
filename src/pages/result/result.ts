import { Component } from '@angular/core';
import {Platform, ToastController, ModalController} from 'ionic-angular';

import {AlbumService} from "../../app/services/albumService";
import {DB} from '../../app/services/db/db';

import {Settings} from '../../app/modals/settings/settings';
import {IgnoreList} from '../../app/modals/ignoreList/ignoreList';
import {AlbumInfo} from '../../app/modals/albumInfo/albumInfo';

import {IteratorResultImpl as IteratorResult} from "../../app/domain/iteratorResultImpl";
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
	private db: DB;
	private error: string;

	private _onSuccess(album: IteratorResult): void {
        this.album = album;
    }

    private _onError(error:string): void{
		console.error('Result._onError', error);
		this.error = error;
    }

	private _getAlbums(): void {
		this.album = null;
		this.albumService.getAlbums()
			.then(album => 
				this._onSuccess(album), 
				error => this._onError(error)
			);
	}

	private _presentToast(album: Album) {
		let albumTitle = album.albumTitle || 'Unknown';
		let toast = this.toastCtrl.create({
			message: albumTitle + ' added to Ignore List',
			duration: 1500
		});
		toast.present();
	}

	constructor(toastCtrl: ToastController, modalCtrl: ModalController, platform: Platform, albumService: AlbumService, db:DB){
		this.toastCtrl = toastCtrl;
		this.modalCtrl = modalCtrl;
		this.albumService = albumService;
		this.db = db;
		platform.ready().then(() => this._getAlbums())
	}

	getNextAlbum(): void{
		this.albumService.getNext()
			.then(album => this._onSuccess(album), error => this._onError(error))
	};

	getPrevAlbum(): void{
		this.albumService.getPrev()
			.then(album => this._onSuccess(album), error => this._onError(error))
	};

	addIgnoreListItem = (album:IteratorResult): void => {
		this._presentToast(album.value);
		this.albumService.ignore(album)
			.then(album => this._onSuccess(album), error => this._onError(error));
	};

	toBase64Uri = (src:string): string => 'data:image/png;base64,' + src;

	showSettings(): void {
		let settingsModal = this.modalCtrl.create(Settings);
		settingsModal.onDidDismiss(settingsParams => {
			//TODO handle all dismisses
			if(settingsParams && (settingsParams.preferencesUpdated || settingsParams.ignoreListUpdated)){
				this._getAlbums();
			}
		});

		settingsModal.present();
	}

	showIgnoreList(): void {
		let ignoreListModal = this.modalCtrl.create(IgnoreList);
		ignoreListModal.onDidDismiss(settingsParams => {
			if (settingsParams.ignoreListUpdated) {
				this._getAlbums();
			}
		});

		ignoreListModal.present();
	}
	
	showInfo(album:Album): void{
		let infoModal = this.modalCtrl.create(AlbumInfo, {album: album})
		infoModal.present();
	}
}
