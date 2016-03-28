import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo';
import {Sort} from './sort';

@Injectable()
export class Albums{
	currentAlbumIndex = -1;
	audioInfo: AudioInfo;
	sort: Sort;

	constructor(audioInfo: AudioInfo, sort: Sort) {
		this.audioInfo = audioInfo;
		this.sort = sort;
	}

	private _getAlbum(albumsSorted) {
		console.log('_getAlbum')
		this.currentAlbumIndex++;
		return this.audioInfo.getTrack(albumsSorted[this.currentAlbumIndex][0].persistentID);
	}  

	private _sortToAlbums(trackData) {
		console.log('_sortToAlbums')
		return this.sort.sortToAlbums(trackData)
	}


	getNextAlbum(shouldRefreshData:boolean){
		console.log('getNextAlbum')
		return new Promise((resolve, reject) => resolve({
			title: 'Title',
			artist: 'Artist'
		}));
	}
}