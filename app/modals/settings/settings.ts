import {Page, ViewController, Platform} from 'ionic-angular';
import {Storage} from "../../services/storage/storage";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preference} from "../../domain/preference";
import {Copy} from "../../services/copy";
import {SettingsSegment} from "./domain/settingsSegment";

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings{
	viewCtrl: ViewController;
	storage: Storage;
	ignoredAlbumList: Array<IgnoredAlbum>;
	preferences: Array<Preference>;
	initalPreferences:Array<Preference>;
	ignoreListUpdated = false;
	copy:Object;
	currentSegment: String;

	constructor(viewCtrl: ViewController, storage:Storage, platform:Platform, copy:Copy) {
		console.log('Settings.constructor');
		this.viewCtrl = viewCtrl;
		this.storage = storage;
		this.copy = copy.en;
		this.currentSegment = SettingsSegment[SettingsSegment.ignoreList];

		platform.ready().then(() => {
			this.storage.getIgnoreList().then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList);
			this.storage.getPreferences()
				.then(preferences => this.preferences = this.initalPreferences = Object.keys(preferences).map(key => preferences[key]));
		});
	}

	close(): void {
		console.log('Settings.close');
		this.viewCtrl.dismiss({
			preferencesUpdated: !_.isEqual(this.preferences, this.initalPreferences),
			ignoreListUpdated: this.ignoreListUpdated
		});
	}

	deleteIgnoreListItem = (id:String): void => {
		console.log('Settings.deleteIgnoreListItem', id);
		this.ignoreListUpdated = true;
		this.storage.deleteIgnoreListItem(id).then(ignoredAlbumList => this.ignoredAlbumList = ignoredAlbumList)
	};

	preferenceChanged = (value:Boolean, id:String): void => {
		console.log('Settings.preferenceChanged', value, id);
		this.storage.setPreferences(id, value)
			.then(preferences => this.preferences = Object.keys(preferences).map(key => preferences[key]));
	}
}
