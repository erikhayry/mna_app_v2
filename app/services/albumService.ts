import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo/audioInfo';
import {Sort} from './sort/sort';
import {Album} from "../domain/album";
import {TrackImpl as Track, TrackImpl} from "../domain/trackImpl";

@Injectable()
export class AlbumService{
	albums:Array<Album>;
	currentAlbumIndex = -1;
	audioInfo: AudioInfo;
	sort: Sort;

	constructor(audioInfo: AudioInfo, sort: Sort) {
		console.log('AlbumService.constructor');
		this.audioInfo = audioInfo;
		this.sort = sort;
	}
	

	private _getAlbum(albumsSorted:Array<Album>):Promise<Album> {
		console.log('AlbumService._getAlbum', albumsSorted);
		this.albums = albumsSorted;
		this.currentAlbumIndex++;
		return this.audioInfo.getAlbum(this.albums[this.currentAlbumIndex][0].albumPersistentID);
	}

	private _sortToAlbums(trackData:Array<Track>):Promise<Array<Album>> {
		console.log('AlbumService._sortToAlbums', trackData);
		return this.sort.sortToAlbums(trackData)
	}

	getNextAlbum(shouldRefreshData:boolean):Promise<Album>{
		console.log('AlbumService.getNextAlbum', shouldRefreshData);

		if(shouldRefreshData){
			this.albums = [];
			this.currentAlbumIndex = -1;
		}

		if(this.albums.length > 0){
			return this._getAlbum(this.albums)
		}

		return this.audioInfo.getTracks(shouldRefreshData)
			.then((tracks) => this._sortToAlbums((<Array<Track>>tracks)))
			.then((albums) => this._getAlbum((<Array<Album>>albums)));
	}
}
