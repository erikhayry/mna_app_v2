import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo';
import {Sort} from './sort';
import {Album} from "../domain/album";
import {TrackImpl} from "../domain/trackImpl";

@Injectable()
export class Albums{
	groupedAndSortedTracks:Array<any>;
	tracksWithImage = {};
	currentAlbumIndex = -1;
	audioInfo: AudioInfo;
	sort: Sort;

	constructor(audioInfo: AudioInfo, sort: Sort) {
		console.log('Albums.constructor');
		this.audioInfo = audioInfo;
		this.sort = sort;
	}

	getAlbum(albumsSorted:Array<Album>) {
		console.log('Albums.getAlbum', albumsSorted);
		this.currentAlbumIndex++;
		return this.audioInfo.getTrack(albumsSorted[this.currentAlbumIndex][0].persistentID);
	}  

	sortToAlbums(trackData:Array<TrackImpl>) {
		console.log('Albums.sortToAlbums', trackData);
		return Promise.resolve(this.sort.sortToAlbums(trackData))
	}


	getNextAlbum(shouldRefreshData:boolean){
		console.log('Albums.getNextAlbum', shouldRefreshData);

		if(shouldRefreshData){
			this.groupedAndSortedTracks = [];
			this.tracksWithImage = {};
			this.currentAlbumIndex = -1;
		}

		if(this.groupedAndSortedTracks.length > 0){
			return this.getAlbum(this.groupedAndSortedTracks)
		}

		return this.audioInfo.getTracks(shouldRefreshData)
			.then((tracks) => this.sortToAlbums((<Array<TrackImpl>>tracks)))
			.then((albums) => this.getAlbum((<Array<Album>>albums)));
	}
}
