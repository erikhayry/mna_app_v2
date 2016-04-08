import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Injectable, Component} from 'angular2/core';
import {AudioInfoImpl} from './audioInfoImpl';
import 'rxjs/add/operator/map' //http://stackoverflow.com/a/34515276/1129581
@Component({
	providers: [HTTP_PROVIDERS]
})

@Injectable()
export class AudioInfo implements AudioInfoImpl {
	private currentAlbumId = '3554566140474577000';
	private tracks = [];
	private albums = {};
	http:Http;

	constructor(http: Http) {
		this.http = http;
	}
	
	getTrack(id){
		let currentAlbumId = this.currentAlbumId == '3554566140474577000' ? '3554566140474578400' : '3554566140474577000';
		console.log('Get Mock Track', currentAlbumId)

		return new Promise((resolve, reject) => {
			if(this.albums[currentAlbumId]){
				resolve(this.albums[currentAlbumId])
			}

			else{
				console.log('HTTP')
				this.http.get('mock_data/' + currentAlbumId + '.json')
					.map(res => res.json())
					.subscribe(data => {
						console.log(data);
						this.albums[currentAlbumId] = data[0]
						resolve(this.albums[currentAlbumId])
					}, null);
			}
		});
	}
	getTracks(shouldRefreshData:boolean) {
		console.log('Get Mock Tracks')
		if(shouldRefreshData){
			this.tracks = [];
			this.albums = {};
		}

		return new Promise((resolve, reject) => {
			if(this.tracks.length > 0){
				resolve(this.tracks)
			}
			else{
				this.http.get('mock_data/tracks.json')
					.map(res => res.json())
					.subscribe(data => {
						console.log(data)
						this.tracks = data;
						resolve(data);
					}, null);
			}
		});
	}
}
