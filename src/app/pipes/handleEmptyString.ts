import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'handleEmptyString' })
export class HandleEmptyStringPipe implements PipeTransform {
  transform(str:string, args: Array<string>) {
	if(!str || str === ' '){
		return 'Unknown ' + args.join(' ');
	}

	return str;
  }
}
