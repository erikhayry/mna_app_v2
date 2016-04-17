import {Page, Modal, NavController, Platform} from 'ionic-angular';
import {AlbumService} from '../../services/albumService';
import {Storage} from '../../services/storage/storage';
import {Settings} from '../../modals/settings/settings';
import {Album} from "../../domain/album";

@Page({
  templateUrl: 'build/pages/result/result.html',
})

export class Result {
	private album: Album;
	private nav: NavController;
	private albumService: AlbumService;
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

	constructor(nav: NavController, platform: Platform, albumService: AlbumService, storage:Storage){
		console.log('Result.constructor')
		this.nav = nav;
		this.albumService = albumService;
		this.storage = storage;

		this.album = {
			albumTitle: "Pablo Honey",
			albumArtist: "Radiohead",
			image: "https://ukutabs.com/uploads/2012/04/49158523.jpg"
		}

		platform.ready().then(() => {
			this.getNextAlbum(true);
		})
	}

	getNextAlbum(shouldRefreshData: boolean): void{
		console.log('Result.getNextAlbum');
		console.time('getNextAlbum');

		this.albumService.getNextAlbum(shouldRefreshData)
			.then(album => this.onSuccess(album), error => this.onError(error))
	};

	addIgnoreListItem = (albumId:String, albumName:String, albumArtist:String): void => {
		console.log('Result.addIgnoreListItem', albumId, albumName, albumArtist)
		this.storage.addIgnoreListItem(albumId, albumName, albumArtist)
			.then(() => this.getNextAlbum(false))
	};

	//getImage = (src:String): String => 'data:image/png;base64,' + src;
	getImage = (src:String): String => src;

	showSettings(): void {
		console.log('Result.showSettings');
		let settingsModal = Modal.create(Settings);
		this.nav.present(settingsModal);
	}
}
