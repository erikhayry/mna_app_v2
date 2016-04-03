import {Page, ViewController, Platform} from 'ionic-angular';
import {Storage} from "../../services/storage";

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings{
	viewCtrl: ViewController;
	storage: Storage;
	ignore: Array<any>;
	preferences: Array<any>;

	constructor(viewCtrl: ViewController, storage:Storage, platform:Platform) {
		console.log('Settings init')
		this.viewCtrl = viewCtrl;
		this.storage = storage;

		platform.ready().then(() => {
			this.storage.getIgnoreList().then(data => this.ignore = data);
			this.storage.getPreferences().then(data => {
				console.log(data)
				this.preferences = data.map(function(pref){
					pref.checked = pref.checked ? true : false;
					return pref
				});
			});
		});

	}

	close() {
		this.viewCtrl.dismiss();
	}

	deleteIgnoreListItem = (id) => {
		this.storage.deleteIgnoreListItem(id).then(data => this.ignore = data)
	};

	preferenceChanged = (value, id) => {
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
