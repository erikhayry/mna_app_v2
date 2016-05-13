import {Page, ViewController, NavController, Platform, Toast} from 'ionic-angular';
import {Storage} from "../../services/storage/storage";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";

@Page({
	templateUrl: 'build/modals/ignoreList/ignoreList.html',
})

export class IgnoreList {
	nav: NavController;
	viewCtrl: ViewController;
	storage: Storage;
	ignoredAlbumList: Array<IgnoredAlbum> = [];
	ignoreListUpdated = false;

	private presentToast(album: IgnoredAlbum) {
		console.log('IgnoreList.presentToast', album);
		this.nav.present(Toast.create({
			message: album.albumTitle + ' removed from Ignore List',
			duration: 1500
		}));
	}

	constructor(nav: NavController, viewCtrl: ViewController, storage: Storage, platform: Platform) {
		console.log('IgnoreList.constructor');
		this.nav = nav;
		this.viewCtrl = viewCtrl;
		this.storage = storage;

		platform.ready().then(() => {
			this.storage.getIgnoreList().then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList);		
		});
	}

	close(): void {
		console.log('IgnoreList.close');
		this.viewCtrl.dismiss({
			ignoreListUpdated: this.ignoreListUpdated
		});
	}

	deleteIgnoreListItem = (album: IgnoredAlbum): void => {
		console.log('IgnoreList.deleteIgnoreListItem', album);
		this.ignoreListUpdated = true;
		this.presentToast(album);
		this.storage.deleteIgnoreListItem(album.id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	}
}
