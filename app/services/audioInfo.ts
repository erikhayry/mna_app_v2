import {Injectable} from 'angular2/core';
import {AudioInfoImpl} from './audioInfoImpl';
import {iOSAudioInfoImpl} from "../domain/iOSAudioInfoImpl";
import {CordovaWindowImpl} from "../domain/CordovaWindowImpl";
import {TrackImpl as Track} from "../domain/trackImpl";

@Injectable()
export class AudioInfo implements AudioInfoImpl {
	private iOSAudioInfo:iOSAudioInfoImpl;

	constructor(){
		//this.iOSAudioInfo = window.plugins.iOSAudioInfo;
	}
	
	getTrack(id:String){
		console.log('AudioInfo.getTrack', id);

		return new Promise<Track>((resolve, reject) =>{
			window.plugins.iOSAudioInfo.getTrack((track) => {
				console.log('audioInfo', track)
				resolve(track);
			}, (error) => {
				reject(error);
			}, id)
		})
	}
	
	getTracks(shouldRefreshData:boolean) {
		console.log('Get tracks - shouldRefreshData: ', shouldRefreshData)
		return  new Promise<Array<Track>>((resolve, reject) =>{
			window.plugins.iOSAudioInfo.getTracks((tracks) => {
				console.log(tracks, ['albumTitle', 'artist', 'rating', 'playCount'])
				resolve(tracks);
			}, (error) => {
				console.log(error)
				reject(error);
			})
		})
	}
}
