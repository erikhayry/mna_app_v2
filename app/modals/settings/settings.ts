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
			this.storage.getIgnoreList().then(ignoredAlbumList => this.ignoredAlbumList = (<Array<IgnoredAlbum>>ignoredAlbumList));
			this.storage.getPreferences().then(preferences => {
				this.preferences = (Array<Preference>preferences).map(preference => {
					(<Preference>preference).checked = (<Preference>preference).checked ? true : false;
					return preference
				});
			});
		});

	}

	close() {
		console.log('Settings.close');
		this.viewCtrl.dismiss();
	}

	deleteIgnoreListItem = (id:String) => {
		console.log('Settings.deleteIgnoreListItem');
		this.storage.deleteIgnoreListItem(id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	};

	preferenceChanged = (value:String, id:String) => {
		console.log(value, id)
		console.log(this.preferences)

		this.storage.setPreferences(id, value ? 1 : 0)
			.then(function(preferences) {
				console.log(preferences)
				this.preference = preferences.map(function(pref){
					pref.checked = pref.checked ? true : false;
					return pref
				});
			});
	}
}
