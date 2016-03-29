import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo.mock';
import {Sort} from './sort';
import reject = Promise.reject;

@Injectable()
export class Albums{
	groupedAndSortedTracks:Array<any>;
	tracksWithImage = {};
	currentAlbumIndex = -1;
	audioInfo: AudioInfo;
	sort: Sort;

	constructor(audioInfo: AudioInfo, sort: Sort) {
		console.log(sort)
		this.audioInfo = audioInfo;
		this.sort = sort;
	}

	getAlbum(albumsSorted) {
		console.log('_getAlbum')
		console.log(albumsSorted)
		this.currentAlbumIndex++;
		return this.audioInfo.getTrack(albumsSorted[this.currentAlbumIndex][0].persistentID);
	}  

	sortToAlbums(trackData) {
		console.log('_sortToAlbums')
		console.log(trackData)
		let albums = this.sort.sortToAlbums(trackData);
		console.log(albums)
		return Promise.resolve(albums)
	}


	getNextAlbum(shouldRefreshData:boolean){
		console.log('_getNextAlbum')

		if(shouldRefreshData){
			this.groupedAndSortedTracks = [];
			this.tracksWithImage = {};
			this.currentAlbumIndex = -1;
		}

		if(this.groupedAndSortedTracks.length > 0){
			return this.getAlbum(this.groupedAndSortedTracks)
		}

		return this.audioInfo.getTracks(shouldRefreshData)
			.then((data) => this.sortToAlbums(data))
			.then((data) => this.getAlbum(data));
	}
}
