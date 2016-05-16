import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'handleEmptyString' })
export class HandleEmptyStringPipe implements PipeTransform {
  transform(str:string, args: Array<string>) {
  	console.log('HandleEmptyStringPipe', str, args);

	if(!str || str === ' '){
		return 'Unknown ' + args.join(' ');
	}

	return str;
  }
}