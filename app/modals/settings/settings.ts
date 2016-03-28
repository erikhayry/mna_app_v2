import {Page, Modal, ViewController} from 'ionic-angular';

@Page({
  templateUrl: 'build/modals/settings/settings.html',
})

export class Settings {
	viewCtrl: ViewController;
	constructor(viewCtrl: ViewController) {
		this.viewCtrl = viewCtrl;
	}

	close() {
		this.viewCtrl.dismiss();
	}
}