import {Page, Modal, NavController, Platform} from 'ionic-angular';
import {AlbumService} from '../../services/albumService';
import {Storage} from '../../services/storage/storage';
import {Settings} from '../../modals/settings/settings';
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

	private onSuccess(album:IteratorResultImpl): void{
        console.log('Result.onSuccess', album);
        console.timeEnd('getAlbum');
        this.album = album;
    }

    private onError(error:String): void{
		console.error('Result.onError', error);
        console.timeEnd('getAlbum');
    }

	constructor(nav: NavController, platform: Platform, albumService: AlbumService, storage:Storage){
		console.log('Result.constructor');
		this.nav = nav;
		this.albumService = albumService;
		this.storage = storage;
/*
		this.album = {
			value: {
				albumTitle: "Pablo Honey",
				artist: "Radiohead",
				image: "https://ukutabs.com/uploads/2012/04/49158523.jpg",
				tracks: [
					{
						title: 'Track 1',
						rating: 2,
						playCount: 10
					},
					{
						title: 'Track 2',
						rating: 5,
						playCount: 2
					},
					{
						title: 'Track 3',
						rating: 0,
						playCount: 0
					}
				]
			}
		}*/

		platform.ready().then(() => {
			this.albumService.getAlbums()
				.then(album => this.onSuccess(album), error => this.onError(error))
		})
	}

	getNextAlbum(): void{
		console.log('Result.getNextAlbum');
		console.time('getAlbum');
		this.albumService.getNext()
			.then(album => this.onSuccess(album), error => this.onError(error))
	};

	getPrevAlbum(): void{
		console.log('Result.getPrevAlbum');
		console.time('getAlbum');
		this.albumService.getPrev()
			.then(album => this.onSuccess(album), error => this.onError(error))
	};

	addIgnoreListItem = (album:IteratorResultImpl): void => {
		console.log('Result.addIgnoreListItem', album);
		this.albumService.ignore(album)
			.then(album => this.onSuccess(album), error => this.onError(error))
	};

	getImage = (src:String): String => 'data:image/png;base64,' + src;
	//getImage = (src:String): String => src;

	showSettings(): void {
		console.log('Result.showSettings');
		let settingsModal = Modal.create(Settings);
		settingsModal.onDismiss(settingsParams => {
			if(settingsParams.preferencesUpdated || settingsParams.ignoreListUpdated){
				console.log('Result.showSettings: preferencesUpdated/ignoreListUpdated');
				this.album = null;
				this.albumService.getAlbums()
					.then(album => this.onSuccess(album), error => this.onError(error))
			}
		});

		this.nav.present(settingsModal);
	}
	
	showInfo(album:Album): void{
		console.log('Result.showInfo', album);
		let albumInfoModal = Modal.create(AlbumInfo, {album: album});
		this.nav.present(albumInfoModal);	
	}
}
