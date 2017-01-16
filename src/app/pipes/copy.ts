import { Pipe, PipeTransform } from '@angular/core';
import {CopyLangImpl} from "../services/copy/domain/copyLangImpl";
import {Copy} from "../services/copy/copy";

@Pipe({ name: 'copy' })
export class CopyPipe implements PipeTransform {
	private copy:CopyLangImpl;

	constructor(copy: Copy) {
		this.copy = copy.en;
	}

	transform = (key:string) => this.copy[key] ? this.copy[key] : ' - ' + key;
}
