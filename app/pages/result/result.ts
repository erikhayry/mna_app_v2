import {Page, Modal, NavController} from 'ionic-angular';
import {Albums} from '../../services/albums';
import {Settings} from '../../modals/settings/settings';
import {OnInit} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/result/result.html',
})

export class Result {
	album: any;
	private nav: NavController;
	private albums: Albums;

	private onSuccess(data:any){
        console.log('success')
        //console.table(data)
        console.timeEnd('getNextAlbum');
        this.album = data;
    }
    
    private onError(error:any){
        console.log(error)
        console.timeEnd('getNextAlbum');      
    }

	private getNextAlbum(shouldRefreshData){
        console.log('Try getting Album')
        console.time('getNextAlbum');
        
        this.albums.getNextAlbum(shouldRefreshData)
            .then(function(data){
            	        console.log('success')

            	console.log(data)
            }, function(data){
            	        console.log('success')

            	console.log(data)
            })
               .catch(
        // Log the rejection reason
        function(reason) {
            console.log('Handle rejected promise ('+reason+') here.');
        });      
    };

	constructor(nav: NavController, albums: Albums){
		this.nav = nav;
		this.albums = albums;
		this.album = {
			title: 'Album Name',
			artist: 'Artist Name'
		}

		this.albums.getNextAlbum(true)
	}

	getImage = (src) => 'data:image/png;base64,' + src

	showSettings() {
		let settingsModal = Modal.create(Settings);
		this.nav.present(settingsModal);
	}
}