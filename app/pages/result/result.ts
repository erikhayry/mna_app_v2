import {Page, Modal, NavController, Platform} from 'ionic-angular';
import {Albums} from '../../services/albums';
import {Storage} from '../../services/storage';
import {Settings} from '../../modals/settings/settings';

@Page({
  templateUrl: 'build/pages/result/result.html',
})

export class Result {
	album: any;
	private nav: NavController;
	private albums: Albums;
	private platform:Platform;
	private storage:Storage;

	private onSuccess(data:any){
        console.log('success')
		console.log(data)
        //console.table(data)
        console.timeEnd('getNextAlbum');
        this.album = data;
    }

    private onError(error:any){
        console.log(error)
        console.timeEnd('getNextAlbum');
    }

	getNextAlbum(shouldRefreshData){
        console.log('Try getting Album')
        console.time('getNextAlbum');

        this.albums.getNextAlbum(shouldRefreshData)
            .then(data => {
				console.log(data)
				this.onSuccess(data)
			}, error => this.onError)
    };

	addIgnoreListItem = (id, name) => {
		this.storage.addIgnoreListItem(id, name).then(this.getNextAlbum)
	};

	constructor(nav: NavController, platform: Platform, albums: Albums, storage:Storage){
		this.nav = nav;
		this.albums = albums;
		this.album = {
			title: 'Album Name',
			artist: 'Artist Name'
		};

		this.storage = storage;

		this.platform = platform;

		this.platform.ready().then(() => {
			this.getNextAlbum(true);
		})

	}

	getImage = (src) => 'data:image/png;base64,' + src

	showSettings() {
		console.log('Show settings')
		let settingsModal = Modal.create(Settings);
		this.nav.present(settingsModal);
	}
}
