import _ from "lodash";
import {Component} from "@angular/core";
import {ViewController} from 'ionic-angular';

import {Preference} from "../../domain/preference";
import {Preferences} from "../../domain/preferences";
import {PreferenceType} from "../../domain/preferenceType";

import {DB} from "../../services/db/db";
import {Copy} from "../../services/copy/copy";
import {CopyLangImpl} from "../../services/copy/domain/copyLangImpl";

@Component({
	templateUrl: '../../modals/settings/settings.html'
})

export class Settings{
	viewCtrl: ViewController;
	db: DB;
	preferences: Array<Preference>;
	initialPreferences:Array<Preference>;
	copy:CopyLangImpl;

	private toSortedArray(preferences:Preferences){
		return _.sortBy(Object.keys(preferences)
			.map(key => preferences[key]), 'label');
	}

	private setPreference(preferences:Preferences){
		let disableSelected = Object.keys(preferences).filter(key => preferences[key].checked).length === 1;
		for(let key in preferences){
			preferences[key].disabled = preferences[key].checked && disableSelected
		}

		return this.toSortedArray(preferences);
	}

	constructor(viewCtrl: ViewController, db:DB, copy:Copy) {
		this.viewCtrl = viewCtrl;
		this.db = db;
		this.copy = copy.en;

		this.db.getPreferences()
			.then(preferences => {
				this.preferences = this.initialPreferences = this.setPreference(preferences);
			});
	}

	close(): void {
		this.viewCtrl.dismiss({
			preferencesUpdated: !_.isEqual(this.preferences, this.initialPreferences)
		});
	}


	preferenceChanged = (value:boolean, id:PreferenceType): void => {
		this.db.setPreferences(id, value)
			.then(preferences => {
				this.preferences = this.setPreference(preferences);
			});
	};
}
