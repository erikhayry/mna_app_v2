import {ViewController, Platform, ToastController, NavParams} from 'ionic-angular';
import {DB} from "../../services/db/db";
import {ListAlbum} from "../../domain/listAlbum";
import {ListType} from "../../domain/listType";
import {Component} from "@angular/core";

@Component({
	templateUrl: '../../modals/lists/list.html',
})

export class List {
	toastCtrl: ToastController;
	db: DB;
	albumList: Array<ListAlbum> = [];
	listUpdated = false;
	viewCtrl:ViewController;
	title: string;
	type: ListType;

	private presentToast(album: ListAlbum) {
		let albumTitle = album.albumTitle || 'Unknown';

		let toast = this.toastCtrl.create({
			message: albumTitle + ' removed from list',
			duration: 1500
		});
		toast.present();
	}

	constructor(toastCtrl: ToastController, db: DB, platform: Platform, params: NavParams) {
		this.toastCtrl = toastCtrl;
		this.db = db;
		this.type = params.data.type;

		switch(this.type){
			case ListType.Have:
				this.title = 'Have';
				break;
			case ListType.Wanted:
				this.title = 'Wanted';
				break;
			case ListType.Ignore:
				this.title = 'Ignored';
				break;
		}
		this.viewCtrl = params.data.viewCtrl;

		platform.ready().then(() => {
			this.db.getList(this.type).then(albumList => this.albumList = albumList);
		});
	}

	deleteListItem = (album: ListAlbum): void => {
		this.listUpdated = true;
		this.presentToast(album);
		this.db.deleteListItem(this.type, album.id).then(albumList => this.albumList = albumList)
	};

	close(): void {
		console.log('close', this.listUpdated)
		this.viewCtrl.dismiss({
			listUpdated: this.listUpdated
		});
	}
}
