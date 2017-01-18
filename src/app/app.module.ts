import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { ResultPage } from '../app/pages/result/result';
import {HandleEmptyStringPipe} from "../app/pipes/handleEmptyString";
import {WithRatingPipe} from "../app/pipes/withRating";
import {AudioInfo} from "../app/services/audioInfo/audioInfo";
import {Sort} from "../app/services/sort/sort";
import {DB} from "../app/services/db/db";
import {Settings} from "../app/modals/settings/settings";
import {Lists} from "../app/modals/lists/lists";
import {AlbumInfo} from "../app/modals/albumInfo/albumInfo";
import {List} from "../app/modals/lists/list";
import {ListStateService} from "../app/services/listStateService";
import {Copy} from "../app/services/copy/copy";
import {CopyPipe} from "../app/pipes/copy";
import {SortByPipe} from "../app/pipes/sortBy";
import {FilterPipe} from "../app/pipes/filter";

@NgModule({
  declarations: [
    MyApp,
    ResultPage,
    Settings,
    Lists,
    List,
    AlbumInfo,
    WithRatingPipe,
    HandleEmptyStringPipe,
    CopyPipe,
    SortByPipe,
    FilterPipe,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ResultPage,
    Settings,
    Lists,
    List,
    AlbumInfo,
  ],
  providers: [
    AudioInfo,
    Sort,
    Storage,
    DB,
    Copy,
    ListStateService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
