import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Injectable, Component} from 'angular2/core';
import {AudioInfoService} from './audioInfoService';

@Component({
	providers: [HTTP_PROVIDERS]
})

@Injectable()
export class AudioInfo implements AudioInfoService {
	private currentAlbumId = '3554566140474577000';
	private tracks = [];
	private albums = {};
	http:Http;

	constructor(http: Http) {
		this.http = http;
	}
	
	getTrack(id){
		console.log('Get Mock Track')
		let currentAlbumId = this.currentAlbumId == '3554566140474577000' ? '3554566140474578400' : '3554566140474577000';

		if(this.albums[currentAlbumId]){
			return new Promise((resolve, reject) => resolve(this.albums[currentAlbumId]));
		}

		else{
			return this.http.get('mock_data/' + currentAlbumId + '.json')
				.map(res => res.json())
				.subscribe(data => {
					this.albums[currentAlbumId] = data[0]
					return this.albums[this.currentAlbumId]
				}, null);
		}
	}
	getTracks(shouldRefreshData:boolean) {
		console.log('Get Mock Tracks')
		if(shouldRefreshData){
			this.tracks = [];
			this.albums = {};
		}

		if(this.tracks.length > 0){
			return new Promise((resolve, reject) => resolve(this.tracks));
		}
		else{
			return this.http.get('mock_data/tracks.json')
				.map(res => res.json())
				.subscribe(data => {
					this.tracks = data.data;
					return this.tracks;
				}, null);
		}
	}
}
