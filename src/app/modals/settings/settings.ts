import _ from "lodash";
import {ViewController, Platform} from 'ionic-angular';

import {Preference} from "../../domain/preference";
import {Preferences} from "../../domain/preferences";

import {DB} from "../../services/db/db";
import {Copy} from "../../services/copy/copy";
import {Component} from "@angular/core";

@Component({
	templateUrl: '../../modals/settings/settings.html',
	providers: [Copy]
})

export class Settings{
	viewCtrl: ViewController;
	db: DB;
	preferences: Array<Preference>;
	initalPreferences:Array<Preference>;
	ignoreListUpdated = false;
	copy:Object;

	private toSortedArray(preferences:Preferences){
		return _.sortBy(Object.keys(preferences)
			.map(key => preferences[key]), 'label');
	}

	constructor(viewCtrl: ViewController, db:DB, platform:Platform, copy:Copy) {
		this.viewCtrl = viewCtrl;
		this.db = db;
		this.copy = copy.en;

		this.db.getPreferences()
			.then(preferences => {
				this.preferences = this.initalPreferences = this.toSortedArray(preferences);
			});
	}

	close(): void {
		this.viewCtrl.dismiss({
			preferencesUpdated: !_.isEqual(this.preferences, this.initalPreferences)
		});
	}


	preferenceChanged = (value:boolean, id:string): void => {
		this.db.setPreferences(id, value)
			.then(preferences => {
				this.preferences = this.toSortedArray(preferences);
			});
	};

	disableSetting = (preference: Preference, preferences: Preferences): boolean =>
	preference.checked && Object.keys(preferences).filter(key => preferences[key].checked).length < 2
}
