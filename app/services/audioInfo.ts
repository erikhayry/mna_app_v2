import {Injectable} from 'angular2/core';
import {AudioInfoImpl} from './audioInfoImpl';

@Injectable()
export class AudioInfo implements AudioInfoImpl {
	getTrack(id){
		console.log('Get Track', id);

		return new Promise((resolve, reject) =>{
			window.plugins.iOSAudioInfo.getTrack((track) => {
				resolve(track);
			}, (error) => {
				reject(error);
			}, id)
		})


	}
	getTracks(shouldRefreshData:boolean) {
		console.log('Get tracks - shouldRefreshData: ', shouldRefreshData)
		console.log(window.plugins)
		return  new Promise((resolve, reject) =>{
			window.plugins.iOSAudioInfo.getTracks((tracks) => {
				console.table(tracks, ['albumTitle', 'artist', 'rating', 'playCount'])
				resolve(tracks);
			}, (error) => {
				reject(error);
			})
		})
	}
}
