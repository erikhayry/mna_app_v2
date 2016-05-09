import {Page, ViewController, Platform} from 'ionic-angular';
import {Storage} from "../../services/storage/storage";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";

@Page({
	templateUrl: 'build/modals/ignoreList/ignoreList.html',
})

export class IgnoreList {
	viewCtrl: ViewController;
	storage: Storage;
	ignoredAlbumList: Array<IgnoredAlbum>;
	ignoreListUpdated = false;

	constructor(viewCtrl: ViewController, storage: Storage, platform: Platform) {
		console.log('IgnoreList.constructor');
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

	deleteIgnoreListItem = (id: String): void => {
		console.log('IgnoreList.deleteIgnoreListItem', id);
		this.ignoreListUpdated = true;
		this.storage.deleteIgnoreListItem(id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	};
}
