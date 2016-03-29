import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo.mock';
import {Sort} from './sort';

@Injectable()
export class Albums{
	groupedAndSortedTracks:Array<any>;
	tracksWithImage = {};
	currentAlbumIndex = -1;
	audioInfo: AudioInfo;
	sort: Sort;

	constructor(audioInfo: AudioInfo, sort: Sort) {
		this.audioInfo = audioInfo;
		this.sort = sort;
	}

	private getAlbum(albumsSorted) {
		console.log('_getAlbum')
		this.currentAlbumIndex++;
		return this.audioInfo.getTrack(albumsSorted[this.currentAlbumIndex][0].persistentID);
	}  

	private sortToAlbums(trackData) {
		console.log('_sortToAlbums')
		return this.sort.sortToAlbums(trackData)
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
			.then(this.sortToAlbums)
			.then(this.getAlbum);
	}
}
