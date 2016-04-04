import {Page, ViewController, Platform} from 'ionic-angular';
import {Storage} from "../../services/storage";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preference} from "../../domain/preference";

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings{
	viewCtrl: ViewController;
	storage: Storage;
	ignoredAlbumList: Array<IgnoredAlbum>;
	preferences: Array<Preference>;

	constructor(viewCtrl: ViewController, storage:Storage, platform:Platform) {
		console.log('Settings.constructor');
		this.viewCtrl = viewCtrl;
		this.storage = storage;

		platform.ready().then(() => {
			this.storage.getIgnoreList().then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList);
			this.storage.getPreferences().then(preferences => this.preferences = preferences);
		});

	}

	close(): void {
		console.log('Settings.close');
		this.viewCtrl.dismiss();
	}

	deleteIgnoreListItem = (id:String): void => {
		console.log('Settings.deleteIgnoreListItem');
		this.storage.deleteIgnoreListItem(id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	};

	preferenceChanged = (value:String, id:String): void => {
		console.log('Settings.preferenceChanged', value, id);
		this.storage.setPreferences(id, value).then(preferences => this.preferences = preferences);
	}
}
