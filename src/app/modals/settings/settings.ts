import _ from "lodash";
import {Component} from "@angular/core";
import {ViewController, AlertController} from 'ionic-angular';

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
    alertCtrl:AlertController;

	private toSortedArray(preferences:Preferences):Array<Preference>{
		return _.sortBy(Object.keys(preferences)
			.map(key => preferences[key]), 'label');
	}

	private preferenceUpdateAllowed(value:boolean):boolean{
        return !(value === false && Object.keys(this.preferences).filter(key => this.preferences[key].checked).length === 0);
    }

    private showAlert(title:string, subTitle:string, preference:Preference):void {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [this.copy.settings_alertOk]
        });
        alert.present();
        alert.onDidDismiss(() => {
            preference.checked = true;
        })

    }

	constructor(viewCtrl: ViewController, db:DB, copy:Copy, alertCtrl: AlertController) {
		this.viewCtrl = viewCtrl;
		this.db = db;
		this.copy = copy.en;
        this.alertCtrl = alertCtrl;

		this.db.getPreferences()
			.then(preferences => {
				this.preferences = this.initialPreferences = this.toSortedArray(preferences);
			});
	}

	close(): void {
		this.viewCtrl.dismiss({
			preferencesUpdated: !_.isEqual(this.preferences, this.initialPreferences)
		});
	}


	preferenceChanged = (value:boolean, preference:Preference): void => {
        if(this.preferenceUpdateAllowed(value)){
            this.db.setPreferences(preference.label, value)
                .then(preferences => {
                    this.preferences = this.toSortedArray(preferences);
                });
        }
        else {
            this.showAlert(this.copy.settings_alertTitle, this.copy.settings_alertSubTitle, preference)
        }
	};
}
