import {ViewController, Platform, ToastController, NavParams, AlertController} from 'ionic-angular';
import {DB} from "../../services/db/db";
import {ListAlbum} from "../../domain/listAlbum";
import {ListType} from "../../domain/listType";
import {Component} from "@angular/core";
import {ListModalParams} from "./domain/listModalParams";
import {ListStateService} from "../../services/listStateService";
import {CopyLangImpl} from "../../services/copy/domain/copyLangImpl";
import {Copy} from "../../services/copy/copy";

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
	copy:CopyLangImpl;
	filterTerm = '';
	alertCtrl: AlertController;

	private presentToast(album: ListAlbum) {
		let albumTitle = album.albumTitle || 'Unknown';

		let toast = this.toastCtrl.create({
			message: this.copy.list_albumRemoved(albumTitle),
			duration: 1500
		});
		toast.present();
	}

	private showRadio(album: ListAlbum) {
		let alert = this.alertCtrl.create();
		alert.setTitle('Move ' + album.albumTitle);

		alert.addInput({
			type: 'radio',
			label: this.copy.lists_wanted,
			value: ListType.Wanted + '',
			checked: ListType.Wanted == this.type
		});

		alert.addInput({
			type: 'radio',
			label: this.copy.lists_owned,
			value: ListType.Owned + '',
			checked: ListType.Owned == this.type
		});

		alert.addInput({
			type: 'radio',
			label: this.copy.lists_ignored,
			value: ListType.Ignored + '',
			checked: ListType.Ignored == this.type
		});

		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: (listType:ListType) => {
				if(listType !== this.type){
					this.db.moveListItem(this.type, listType, album).then(albumList => this.albumList = albumList)
				}
			}
		});
		alert.present();
	}

	constructor(toastCtrl: ToastController, alertCtrl: AlertController, db: DB, platform: Platform, params: NavParams, listStateService: ListStateService, copy: Copy) {
		this.toastCtrl = toastCtrl;
		this.alertCtrl = alertCtrl;
		this.db = db;
		let lisModalParams = (<ListModalParams>params.data);
		this.type = lisModalParams.type;
		this.copy = copy.en;

		switch(this.type){
			case ListType.Owned:
				this.title = 'list_titleOwned';
				break;
			case ListType.Wanted:
				this.title = 'list_titleWanted';
				break;
			case ListType.Ignored:
				this.title = 'list_titleIgnored';
				break;
		}
		this.viewCtrl = lisModalParams.viewCtrl;
		this.listStateService = listStateService;

		platform.ready().then(() => {
			this.db.getList(this.type).then(albumList => this.albumList = albumList);
		});
	}

	moveListItem = (album: ListAlbum): void => {
		this.showRadio(album);
	};

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
