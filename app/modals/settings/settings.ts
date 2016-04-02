import {Page, ViewController} from 'ionic-angular';
import {Storage} from "../../services/storage";

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings{
	viewCtrl: ViewController;
	constructor(viewCtrl: ViewController) {
		this.viewCtrl = viewCtrl;
	}

	close() {
		this.viewCtrl.dismiss();
	}
}
