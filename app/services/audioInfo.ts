import {Injectable} from 'angular2/core';
import {AudioInfoImpl} from './audioInfoImpl';
import {iOSAudioInfoImpl} from "../domain/iOSAudioInfoImpl";
import {CordovaWindowImpl} from "../domain/CordovaWindowImpl";

@Injectable()
export class AudioInfo implements AudioInfoImpl {
	private iOSAudioInfo:iOSAudioInfoImpl;

	constructor(){
		this.iOSAudioInfo = (<CordovaWindowImpl>window).plugins.iOSAudioInfo;
	}
	
	getTrack(id:String){
		console.log('AudioInfo.getTrack', id);

		return new Promise((resolve, reject) =>{
			this.iOSAudioInfo.getTrack((track) => {
				console.log('audioInfo', track)
				resolve(track);
			}, (error) => {
				reject(error);
			}, id)
		})
	}
	
	getTracks(shouldRefreshData:boolean) {
		console.log('Get tracks - shouldRefreshData: ', shouldRefreshData)
		return  new Promise((resolve, reject) =>{
			this.iOSAudioInfo.getTracks((tracks) => {
				console.log(tracks, ['albumTitle', 'artist', 'rating', 'playCount'])
				resolve(tracks);
			}, (error) => {
				console.log(error)
				reject(error);
			})
		})
	}
}
