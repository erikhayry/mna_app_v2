import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo/audioInfo';
import {Sort} from './sort/sort';
import {Album} from "../domain/album";
import {TrackImpl as Track, TrackImpl} from "../domain/trackImpl";

@Injectable()
export class AlbumService{
	groupedAndSortedTracks:Array<Track>;
	currentAlbumIndex = -1;
	audioInfo: AudioInfo;
	sort: Sort;

	constructor(audioInfo: AudioInfo, sort: Sort) {
		console.log('AlbumService.constructor');
		this.audioInfo = audioInfo;
		this.sort = sort;
	}
	

	private _getAlbum(albumsSorted:Array<Track>):Promise<TrackImpl> {
		console.log('AlbumService._getAlbum', albumsSorted);
		this.currentAlbumIndex++;
		return this.audioInfo.getAlbum(albumsSorted[this.currentAlbumIndex][0].albumPersistentID);
	}

	private _sortToAlbums(trackData:Array<Track>):Promise<Array<Track>> {
		console.log('AlbumService._sortToAlbums', trackData);
		return Promise.resolve(this.sort.sortToAlbums(trackData))
	}

	getNextAlbum(shouldRefreshData:boolean):Promise<TrackImpl>{
		console.log('AlbumService.getNextAlbum', shouldRefreshData);

		if(shouldRefreshData){
			this.groupedAndSortedTracks = [];
			this.currentAlbumIndex = -1;
		}

		if(this.groupedAndSortedTracks.length > 0){
			return this._getAlbum(this.groupedAndSortedTracks)
		}

		return this.audioInfo.getTracks(shouldRefreshData)
			.then((tracks) => this._sortToAlbums((<Array<Track>>tracks)))
			.then((albums) => this._getAlbum((<Array<Track>>albums)));
	}
}
