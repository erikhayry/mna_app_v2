import {Injectable} from 'angular2/core';
import {AudioInfoImpl} from './audioInfoImpl';
import {iOSAudioInfoImpl} from "../../domain/iOSAudioInfoImpl";
import {CordovaWindowImpl} from "../../domain/CordovaWindowImpl";
import {TrackImpl as Track} from "../../domain/trackImpl";
import {Platform} from "ionic-angular";

interface log extends Console{
	table(...args: any[])
}

@Injectable()
export class AudioInfo implements AudioInfoImpl {
	private iOSAudioInfo:iOSAudioInfoImpl;

	constructor(platform: Platform){
		platform.ready().then(() => {
			this.iOSAudioInfo = (<CordovaWindowImpl>window).plugins.iOSAudioInfo;
		})
	}
	
	getTrack(id:String){
		console.log('AudioInfo.getTrack', id);
		return new Promise<Track>((resolve, reject) =>{
			this.iOSAudioInfo.getTrack((track) => {
				console.log('audioInfo', track)
				resolve(track);
			}, (error) => {
				reject(error);
			}, id)
		})
	}
	
	getTracks(shouldRefreshData:boolean) {
		console.log('AudioInfo.getTracks', shouldRefreshData);
		return  new Promise<Array<Track>>((resolve, reject) =>{
			this.iOSAudioInfo.getTracks((tracks) => {
				resolve(tracks);
			}, (error) => {
				reject(error);
			})
		})
	}
}
