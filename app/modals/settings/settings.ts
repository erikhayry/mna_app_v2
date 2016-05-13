import {Page, ViewController, Platform} from 'ionic-angular';

import {Preference} from "../../domain/preference";
import {Preferences} from "../../domain/preferences";

import {Storage} from "../../services/storage/storage";
import {Copy} from "../../services/copy";

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings{
	viewCtrl: ViewController;
	storage: Storage;
	preferences: Array<Preference>;
	initalPreferences:Array<Preference>;
	ignoreListUpdated = false;
	copy:Object;

	constructor(viewCtrl: ViewController, storage:Storage, platform:Platform, copy:Copy) {
		console.log('Settings.constructor');
		this.viewCtrl = viewCtrl;
		this.storage = storage;
		this.copy = copy.en;

		platform.ready().then(() => {
			this.storage.getPreferences()
				.then(preferences => 
					this.preferences = this.initalPreferences = Object.keys(preferences).map(key => preferences[key])
				);
		});
	}

	close(): void {
		console.log('Settings.close');
		this.viewCtrl.dismiss({
			preferencesUpdated: !_.isEqual(this.preferences, this.initalPreferences)
		});
	}

	preferenceChanged = (value:Boolean, id:String): void => {
		console.log('Settings.preferenceChanged', value, id);
		this.storage.setPreferences(id, value)
			.then(preferences => this.preferences = Object.keys(preferences).map(key => preferences[key]));
	}

	disableSetting = (preference: Preference, preferences: Preferences): boolean => 
		preference.checked && Object.keys(preferences).filter(key => preferences[key].checked).length < 2
}
