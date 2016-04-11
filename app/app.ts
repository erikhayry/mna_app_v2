import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {AlbumService} from './services/albumService';
import {Sort} from './services/sort/sort';
import {AudioInfo} from "./services/audioInfo/audioInfo";
import {Storage} from "./services/storage/storage";


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [AlbumService, AudioInfo, Sort, Storage]
})

export class MnaApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
