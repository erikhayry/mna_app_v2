import {CopyLangImpl} from "./domain/copyLangImpl";

export class Copy{
    en:CopyLangImpl = {
        'settings_rating':'Use rating',
        'settings_playCount': 'Use play count',
        'settings_numberOfItems': 'Use number of tracks in album',

        'result_unknown': 'Unknown',
        'result_iWant': 'I want',
        'result_iOwn':'I own',
        'result_ignore': 'Ignore',
        'result_cancel':'Cancel',
        'result_ownedList': 'Owned List',
        'result_wantedList': 'Wanted List',
        'result_ignoredList': 'Ignored List',
        result_albumAdded: (albumTitle, listType) => albumTitle + ' added to ' + listType,
        result_addToListAction: (albumTitle) => 'Add ' + albumTitle + ' to a list',
        'result_noAlbumFound': 'No albums found on your device. Please add some music to get suggestions',
        'result_loading': 'Getting data',
        'result_authorizationStatusDenied': 'This app needs access to your music to find your favourites',

        'audioInfo_unableToGetTrack' : 'Unable to get track',
        'audioInfo_unableToGetTracks' : 'Unable to get tracks',
        'audioInfo_unableToGetAlbum' : 'Unable to get album',

        'settings_title': 'Settings',
        'settings_madeBy': 'Made by Ellen Portin & Erik Portin',
        'settings_madeIn': 'Åbo / Stockholm 2016',

        'lists_wanted': 'Wanted',
        'lists_owned': 'Owned',
        'lists_ignored': 'Ignored',

        'list_unknown': 'Unknown',
        'list_filter': 'Filter',
        'list_titleIgnored': 'Ignored',
        'list_titleWanted': 'Wanted',
        'list_titleOwned': 'Owned',
        'list_noAlbumTop1': 'No albums added.',
        'list_noAlbumTop2': 'Add albums by tapping',
        'list_noAlbumBottom': 'underneath the album cover.',
        list_albumRemoved: (albumTitle) => albumTitle + ' removed from list',

        'albumInfo_title': 'Album Info'
    }
}
