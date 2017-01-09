import {Platform, ToastController} from 'ionic-angular';
import {DB} from "../../services/db/db";
import {ListAlbum} from "../../domain/listAlbum";
import {ListType} from "../../domain/listType";
import {Component} from "@angular/core";

@Component({
	templateUrl: '../../modals/lists/ignoreList.html',
})

export class IgnoreList {
	toastCtrl: ToastController;
	db: DB;
	albumList: Array<ListAlbum> = [];
	listUpdated = false;

	private presentToast(album: ListAlbum) {
		let albumTitle = album.albumTitle || 'Unknown';

		let toast = this.toastCtrl.create({
			message: albumTitle + ' removed from Ignore List',
			duration: 1500
		});
		toast.present();
	}

	constructor(toastCtrl: ToastController, db: DB, platform: Platform) {
		this.toastCtrl = toastCtrl;
		this.db = db;

		platform.ready().then(() => {
			this.db.getList(ListType.Ignore).then(albumList => this.albumList = albumList);
		});
	}

	deleteListItem = (album: ListAlbum): void => {
		this.listUpdated = true;
		this.presentToast(album);
		this.db.deleteListItem(ListType.Ignore, album.id).then(albumList => this.albumList = albumList)
	}
}
