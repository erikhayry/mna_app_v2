import {Injectable} from 'angular2/core';

@Injectable()
export class Albums{
	getNextAlbum(shouldRefreshData:boolean){
		console.log('getNextAlbum')
		return new Promise((resolve, reject) => resolve('DATA'));
	}
}