import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";

import {iOSAudioInfoImpl as iOSAudioInfo} from "../../domain/iOSAudioInfoImpl";
import {CordovaWindowImpl as CordovaWindow} from "../../domain/CordovaWindowImpl";
import {Track} from "../../domain/track";
import {Album} from "../../domain/album";

@Injectable()
export class AudioInfo{
	private iOSAudioInfo:iOSAudioInfo;

	constructor(platform: Platform){
		platform.ready().then(() => {
			if((<CordovaWindow>window).plugins){
				this.iOSAudioInfo = (<CordovaWindow>window).plugins.iOSAudioInfo;
			}
		})
	}
	
	getTrack(id:String){
		return new Promise<Track>((resolve, reject) => {
			if(this.iOSAudioInfo){
				this.iOSAudioInfo.getTrack(track => resolve(track), error => reject(error), id)
			}
			else{
				reject('Unable to get track');
			}
		})
	}

	getAlbum(id:String){
		return new Promise<Album>((resolve, reject) => {
			if(this.iOSAudioInfo){
				this.iOSAudioInfo.getAlbum(album => resolve(album), error => reject(error), id)
			}
			else{
				reject('Unable to get album');
			}
		})
	}
	
	getTracks():Promise<Array<Track>>{
		return new Promise<Array<Track>>((resolve, reject) => {
			if(this.iOSAudioInfo) {
				console.log('AudioInfo.getTracks')
				this.iOSAudioInfo.getTracks(tracks => {
					console.log(tracks);
					resolve(tracks)
				}, error => reject(error))
			}
			else {
				reject('Unable to get tracks');
			}
		})
	}
}
