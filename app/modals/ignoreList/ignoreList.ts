import {Page, ViewController, NavController, Platform, Toast} from 'ionic-angular';
import {Storage} from "../../services/storage/storage";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {HandleEmptyStringPipe} from "../../pipes/handleEmptyString";

@Page({
	templateUrl: 'build/modals/ignoreList/ignoreList.html',
	pipes: [HandleEmptyStringPipe]
})

export class IgnoreList {
	nav: NavController;
	viewCtrl: ViewController;
	storage: Storage;
	ignoredAlbumList: Array<IgnoredAlbum> = [];
	ignoreListUpdated = false;

	private presentToast(album: IgnoredAlbum) {
		let albumTitle = album.albumTitle || 'Unknown';
		this.nav.present(Toast.create({
			message: albumTitle + ' removed from Ignore List',
			duration: 1500
		}));
	}

	constructor(nav: NavController, viewCtrl: ViewController, storage: Storage, platform: Platform) {
		this.nav = nav;
		this.viewCtrl = viewCtrl;
		this.storage = storage;

		platform.ready().then(() => {
			this.storage.getIgnoreList().then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList);		
		});
	}

	close(): void {
		this.viewCtrl.dismiss({
			ignoreListUpdated: this.ignoreListUpdated
		});
	}

	deleteIgnoreListItem = (album: IgnoredAlbum): void => {
		this.ignoreListUpdated = true;
		this.presentToast(album);
		this.storage.deleteIgnoreListItem(album.id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	}
}
