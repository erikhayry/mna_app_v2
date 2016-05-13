import {Page, Modal, NavController, Platform, Toast} from 'ionic-angular';
import {AlbumService} from '../../services/albumService';
import {Storage} from '../../services/storage/storage';
import {Settings} from '../../modals/settings/settings';
import {IgnoreList} from '../../modals/ignoreList/ignoreList';
import {AlbumInfo} from '../../modals/albumInfo/albumInfo';
import {Album} from "../../domain/album";
import {IteratorResultImpl} from "../../domain/iteratorResultImpl";
import {AlbumIterator} from "../../domain/iterator";

@Page({
  templateUrl: 'build/pages/result/result.html',
})

export class Result {
	private album: IteratorResultImpl;
	private nav: NavController;
	private albumService: AlbumService;
	private storage: Storage;
	private isLoading: boolean = true;

	private onSuccess(album:IteratorResultImpl): void{
        console.log('Result.onSuccess', album);
        this.album = album;
        this.isLoading = false;
    }

    private onError(error:String): void{
		console.error('Result.onError', error);
    }

	private getAlbums(): void {
		console.log('Result.getAlbums');
		this.album = null;
		this.isLoading = true;
		this.albumService.getAlbums()
			.then(album => this.onSuccess(album), error => this.onError(error))
	}

	private presentToast(album: Album) {
		console.log('Result.presentToast', album);
		let toast = Toast.create({
			message: album.albumTitle + ' added to Ignore List',
			duration: 1500
		});

		toast.onDismiss(() => {
			console.log('Result.presentToast: onDismiss');
		});

		this.nav.present(toast);
	}

	constructor(nav: NavController, platform: Platform, albumService: AlbumService, storage:Storage){
		console.log('Result.constructor');
		this.nav = nav;
		this.albumService = albumService;
		this.storage = storage;
		platform.ready().then(() => this.getAlbums())
	}

	getNextAlbum(): void{
		console.log('Result.getNextAlbum');
		this.albumService.getNext()
			.then(album => this.onSuccess(album), error => this.onError(error))
	};

	getPrevAlbum(): void{
		console.log('Result.getPrevAlbum');
		this.albumService.getPrev()
			.then(album => this.onSuccess(album), error => this.onError(error))
	};

	addIgnoreListItem = (album:IteratorResultImpl): void => {
		console.log('Result.addIgnoreListItem', album);
		this.presentToast(album.value);
		this.albumService.ignore(album)
			.then(album => {
				this.onSuccess(album), error => this.onError(error)
			});			
	};

	getImage = (src:String): String => 'data:image/png;base64,' + src;

	showSettings(): void {
		console.log('Result.showSettings');
		let settingsModal = Modal.create(Settings);
		settingsModal.onDismiss(settingsParams => {
			if(settingsParams.preferencesUpdated || settingsParams.ignoreListUpdated){
				console.log('Result.showSettings: preferencesUpdated/ignoreListUpdated');
				this.getAlbums();
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
				this.getAlbums();
			}
		});

		this.nav.present(ignoreListModal);
	}
	
	showInfo(album:Album): void{
		console.log('Result.showInfo', album);
		let albumInfoModal = Modal.create(AlbumInfo, {album: album});
		this.nav.present(albumInfoModal);	
	}
}
