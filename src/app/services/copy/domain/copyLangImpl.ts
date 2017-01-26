export interface CopyLangImpl{
    'settings_rating': string;
    'settings_playCount': string;
    'settings_numberOfItems': string;

    'result_unknown': string;
    'result_iWant': string;
    'result_iOwn': string;
    'result_ignore': string;
    'result_cancel': string;
    'result_ownedList': string;
    'result_wantedList': string;
    'result_ignoredList': string;
    result_albumAdded(albumTitle: string, listType: string): string
    result_addToListAction(albumTitle: string): string
    'result_noAlbumFound': string
    'result_loading': string
    'result_authorizationStatusDenied': string

    'audioInfo_unableToGetTrack': string
    'audioInfo_unableToGetTracks': string
    'audioInfo_unableToGetAlbum': string

    'settings_title': string
    'settings_madeBy': string
    'settings_madeIn': string
    'settings_alertOk': string
    'settings_alertTitle': string
    'settings_alertSubTitle': string

    'lists_wanted': string
    'lists_owned': string
    'lists_ignored': string

    'list_unknown': string
    'list_filter': string
    'list_titleIgnored': string
    'list_titleWanted': string
    'list_titleOwned': string
    'list_noAlbumTop1': string
    'list_noAlbumTop2': string
    'list_noAlbumBottom': string
    list_albumRemoved(albumTitle: string): string

    'albumInfo_title': string
}
