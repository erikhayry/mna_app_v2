import {Page, ViewController} from 'ionic-angular';
import {Storage} from "../../services/storage";

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings{
	viewCtrl: ViewController;
	storage: Storage;
	ignore: Array<any>;
	preferences: Array<any>;

	constructor(viewCtrl: ViewController, storage:Storage) {
		console.log('Settings init')
		this.viewCtrl = viewCtrl;
		this.storage = storage;
		this.storage.getIgnoreList().then(data => this.ignore = data);
		this.storage.getPreferences().then(data => this.preferences = data);
	}

	close() {
		this.viewCtrl.dismiss();
	}

	deleteIgnoreListItem = (id) => {
		this.storage.deleteIgnoreListItem(id).then(data => this.ignore = data)
	}
}
