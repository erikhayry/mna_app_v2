import {Page, Modal, NavController, Platform, Toast} from 'ionic-angular';

import {AlbumService} from '../../services/albumService';
import {Storage} from '../../services/storage/storage';

import {HandleEmptyStringPipe} from "../../pipes/handleEmptyString";

import {Settings} from '../../modals/settings/settings';
import {IgnoreList} from '../../modals/ignoreList/ignoreList';
import {AlbumInfo} from '../../modals/albumInfo/albumInfo';

import {Album} from "../../domain/album";
import {IteratorResultImpl as IteratorResult} from "../../domain/iteratorResultImpl";

@Page({
  templateUrl: 'build/pages/result/result.html',
  pipes: [HandleEmptyStringPipe]
})

export class Result {
	private album: IteratorResult;
	private nav: NavController;
	private albumService: AlbumService;
	private storage: Storage;

	private _onSuccess(album: IteratorResult): void {
        console.log('Result._onSuccess', album);
        this.album = album;
    }

    private _onError(error:String): void{
		console.error('Result._onError', error);
    }

	private _getAlbums(): void {
		console.log('Result._getAlbums');
		this.album = null;
		this.albumService.getAlbums()
			.then(album => 
				this._onSuccess(album), 
				error => this._onError(error)
			)
	}

	private _presentToast(album: Album) {
		console.log('Result._presentToast', album);
		let albumTitle = album.albumTitle || 'Unknown';
		this.nav.present(Toast.create({
			message: albumTitle + ' added to Ignore List',
			duration: 1500
		}));
	}

	constructor(nav: NavController, platform: Platform, albumService: AlbumService, storage:Storage){
		console.log('Result.constructor');
		this.nav = nav;
		this.albumService = albumService;
		this.storage = storage;
		platform.ready().then(() => this._getAlbums())
	}

	getNextAlbum(): void{
		console.log('Result.getNextAlbum');
		this.albumService.getNext()
			.then(album => this._onSuccess(album), error => this._onError(error))
	};

	getPrevAlbum(): void{
		console.log('Result.getPrevAlbum');
		this.albumService.getPrev()
			.then(album => this._onSuccess(album), error => this._onError(error))
	};

	addIgnoreListItem = (album:IteratorResult): void => {
		console.log('Result.addIgnoreListItem', album);
		this._presentToast(album.value);
		this.albumService.ignore(album)
			.then(album => {
				this._onSuccess(album), error => this._onError(error)
			});			
	};

	toBase64Uri = (src:String): String => 'data:image/png;base64,' + src;

	showSettings(): void {
		console.log('Result.showSettings');
		let settingsModal = Modal.create(Settings);
		settingsModal.onDismiss(settingsParams => {
			if(settingsParams.preferencesUpdated || settingsParams.ignoreListUpdated){
				console.log('Result.showSettings: preferencesUpdated/ignoreListUpdated');
				this._getAlbums();
			}
		});

		this.nav.present(settingsModal);
	}

	showIgnoreList(): void {
		console.log('Result.showIgnoreList');
		let ignoreListModal = Modal.create(IgnoreList);
		ignoreListModal.onDismiss(settingsParams => {
			if (settingsParams.ignoreListUpdated) {
				console.log('Result.showIgnoreList: preferencesUpdated/ignoreListUpdated');
				this._getAlbums();
			}
		});

		this.nav.present(ignoreListModal);
	}
	
	showInfo(album:Album): void{
		console.log('Result.showInfo', album);
		this.nav.present(Modal.create(AlbumInfo, {album: album}));	
	}
}
