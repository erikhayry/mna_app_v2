import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo';
import {Sort} from './sort';
import {Album} from "../domain/album";
import {TrackImpl as Track, TrackImpl} from "../domain/trackImpl";

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
	

	getAlbum(albumsSorted:Array<Track>):Promise<TrackImpl> {
		console.log('Albums.getAlbum', albumsSorted);
		this.currentAlbumIndex++;
		return this.audioInfo.getTrack(albumsSorted[this.currentAlbumIndex][0].persistentID);
	}

	sortToAlbums(trackData:Array<Track>):Promise<Array<Track>> {
		console.log('Albums.sortToAlbums', trackData);
		return Promise.resolve(this.sort.sortToAlbums(trackData))
	}

	getNextAlbum(shouldRefreshData:boolean):Promise<TrackImpl>{
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
			.then((tracks) => this.sortToAlbums((<Array<Track>>tracks)))
			.then((albums) => this.getAlbum((<Array<Track>>albums)));
	}
}
