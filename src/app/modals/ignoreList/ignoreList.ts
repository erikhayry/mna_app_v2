import {ViewController, Platform, ToastController} from 'ionic-angular';
import {DB} from "../../services/db/db";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Component} from "@angular/core";

@Component({
	templateUrl: '../../modals/ignoreList/ignoreList.html',
})

export class IgnoreList {
	toastCtrl: ToastController;
	viewCtrl: ViewController;
	db: DB;
	ignoredAlbumList: Array<IgnoredAlbum> = [];
	ignoreListUpdated = false;

	private presentToast(album: IgnoredAlbum) {
		let albumTitle = album.albumTitle || 'Unknown';

		let toast = this.toastCtrl.create({
			message: albumTitle + ' removed from Ignore List',
			duration: 1500
		});
		toast.present();
	}

	constructor(toastCtrl: ToastController, viewCtrl: ViewController, db: DB, platform: Platform) {
		this.toastCtrl = toastCtrl;
		this.viewCtrl = viewCtrl;
		this.db = db;

		platform.ready().then(() => {
			this.db.getIgnoreList().then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList);
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
		this.db.deleteIgnoreListItem(album.id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	}
}
