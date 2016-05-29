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
        this.album = album;
    }

    private _onError(error:String): void{
		console.error('Result._onError', error);
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
		this.nav.present(Toast.create({
			message: albumTitle + ' added to Ignore List',
			duration: 1500
		}));
	}

	constructor(nav: NavController, platform: Platform, albumService: AlbumService, storage:Storage){
		this.nav = nav;
		this.albumService = albumService;
		this.storage = storage;
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
<<<<<<< HEAD
			.then(album => this._onSuccess(album), error => this._onError(error));			
=======
			.then(album => this._onSuccess(album), error => this._onError(error));
>>>>>>> 6c1d763a112d1827dd2c2a29a7d8af05052a24c4
	};

	toBase64Uri = (src:String): String => 'data:image/png;base64,' + src;

	showSettings(): void {
		let settingsModal = Modal.create(Settings);
		settingsModal.onDismiss(settingsParams => {
			if(settingsParams.preferencesUpdated || settingsParams.ignoreListUpdated){
				this._getAlbums();
			}
		});

		this.nav.present(settingsModal);
	}

	showIgnoreList(): void {
		let ignoreListModal = Modal.create(IgnoreList);
		ignoreListModal.onDismiss(settingsParams => {
			if (settingsParams.ignoreListUpdated) {
				this._getAlbums();
			}
		});

		this.nav.present(ignoreListModal);
	}
	
	showInfo(album:Album): void{
		this.nav.present(Modal.create(AlbumInfo, {album: album}));	
	}
}
