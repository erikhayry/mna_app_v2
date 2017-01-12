import {ViewController, Platform, ToastController, NavParams} from 'ionic-angular';
import {DB} from "../../services/db/db";
import {ListAlbum} from "../../domain/listAlbum";
import {ListType} from "../../domain/listType";
import {Component} from "@angular/core";
import {ListModalParams} from "./domain/listModalParams";
import {ListStateService} from "../../services/listStateService";

@Component({
	templateUrl: '../../modals/lists/list.html'
})

export class List {
	toastCtrl: ToastController;
	db: DB;
	albumList: Array<ListAlbum> = [];
	viewCtrl:ViewController;
	title: string;
	type: ListType;
	listStateService: ListStateService;

	private presentToast(album: ListAlbum) {
		let albumTitle = album.albumTitle || 'Unknown';

		let toast = this.toastCtrl.create({
			message: albumTitle + ' removed from list',
			duration: 1500
		});
		toast.present();
	}

	constructor(toastCtrl: ToastController, db: DB, platform: Platform, params: NavParams, listStateService: ListStateService) {
		this.toastCtrl = toastCtrl;
		this.db = db;
		let lisModalParams = (<ListModalParams>params.data);
		this.type = lisModalParams.type;

		//TODO as copy
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
		this.viewCtrl = lisModalParams.viewCtrl;
		this.listStateService = listStateService;

		platform.ready().then(() => {
			this.db.getList(this.type).then(albumList => this.albumList = albumList);
		});
	}

	deleteListItem = (album: ListAlbum): void => {
		this.listStateService.setState(true);
		this.presentToast(album);
		this.db.deleteListItem(this.type, album.id).then(albumList => this.albumList = albumList)
	};

	close(): void {
		this.viewCtrl.dismiss({
			listUpdated: this.listStateService.getState()
		});
		this.listStateService.setState(false);
	}
}
