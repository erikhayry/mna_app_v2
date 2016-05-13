import {Injectable} from 'angular2/core';
import {Platform} from "ionic-angular";

import {AudioInfoImpl} from './audioInfoImpl';

import {iOSAudioInfoImpl as iOSAudioInfo} from "../../domain/iOSAudioInfoImpl";
import {CordovaWindowImpl as CordovaWindow} from "../../domain/CordovaWindowImpl";
import {TrackImpl as Track} from "../../domain/trackImpl";
import {Album} from "../../domain/album";

@Injectable()
export class AudioInfo implements AudioInfoImpl {
	private iOSAudioInfo:iOSAudioInfo;

	constructor(platform: Platform){
		platform.ready().then(() => {
			this.iOSAudioInfo = (<CordovaWindow>window).plugins.iOSAudioInfo;
		})
	}
	
	getTrack(id:String){
		console.log('AudioInfo.getTrack', id);
		return new Promise<Track>((resolve, reject) => {
			this.iOSAudioInfo.getTrack(track => resolve(track), error => reject(error), id)
		})
	}

	getAlbum(id:String){
		console.log('AudioInfo.getAlbum', id);
		return new Promise<Album>((resolve, reject) => {
			this.iOSAudioInfo.getAlbum(album => resolve(album), error => reject(error), id)
		})
	}
	
	getTracks():Promise<Array<Track>>{
		console.log('AudioInfo.getTracks');
		return new Promise<Array<Track>>((resolve, reject) => {
			this.iOSAudioInfo.getTracks(tracks => resolve(tracks), error => reject(error))
		})
	}
}
