import {Page, Modal, NavController, Platform} from 'ionic-angular';
import {Albums} from '../../services/albums';
import {Storage} from '../../services/storage';
import {Settings} from '../../modals/settings/settings';
import {Album} from "../../domain/albums";

@Page({
  templateUrl: 'build/pages/result/result.html',
})

export class Result {
	private album: Album;
	private nav: NavController;
	private albums: Albums;
	private storage: Storage;

	private onSuccess(album:Album): void{
        console.log('Result.onSuccess', album);
        console.timeEnd('getNextAlbum');
        this.album = album;
    }

    private onError(error:String): void{
		console.error('Result.onError', error);
        console.timeEnd('getNextAlbum');
    }

	constructor(nav: NavController, platform: Platform, albums: Albums, storage:Storage){
		console.log('Result.constructor')
		this.nav = nav;
		this.albums = albums;
		this.storage = storage;

		platform.ready().then(() => {
			this.getNextAlbum(true);
		})
	}

	getNextAlbum(shouldRefreshData: boolean): void{
		console.log('Result.getNextAlbum');
		console.time('getNextAlbum');

		this.albums.getNextAlbum(shouldRefreshData)
			.then(album => this.onSuccess(album), error => this.onError)
	};

	addIgnoreListItem = (albumId:String, albumName:String): void => {
		console.log('Result.addIgnoreListItem')
		this.storage.addIgnoreListItem(albumId, albumName).then(this.getNextAlbum)
	};

	getImage = (src:String): String => 'data:image/png;base64,' + src;

	showSettings(): void {
		console.log('Result.showSettings');
		let settingsModal = Modal.create(Settings);
		this.nav.present(settingsModal);
	}
}
