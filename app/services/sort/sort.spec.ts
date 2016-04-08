import {Sort} from 'sort'
import {Track} from "../../domain/track";


describe('Sort',  () => {
    var _tracks = [
        new Track("A Black Man In Space (Sax Remix)", "A Black Man In Space - EP", "Son of Raw", "Electronic", "355456", "1", "1"),
        new Track("A Boy Named Sue (Live)", "At San Quentin", "Johnny Cash", "Country", "355456", "0", "2"),
        new Track("À cause des garçons (Tepr Remix)", "Kitsuné : À cause des garçons (Remixes) - EP", "Yelle", "Electronic", "355456", "5", "3"),
        new Track("A Change Is Gonna Come", "At San Quentin", "Sam Cooke", "R&B/Soul", "355456", "1", "2"),
        new Track("A demain My Darling", "Gorgeous George", "Marie Laforêt", "French Pop", "321514", "2", "4"),
        new Track("A French Love", "At San Quentin", "Anna Ternheim", "Pop", "355456", "0", "2"),
        new Track("A Girl Like You", "Gorgeous George", "Edwyn Collins", "Alternative", "355456", "2", "4"),
        new Track("A Go Go (Video Edit)", "Gorgeous George", "Truby Trio", "Electronic", "368643", "3", "4"),
        new Track("A Good Man Is Hard to Find", "At San Quentin", "Sweet Emma Barrett", "Jazz", "355456", "0", "2"),
        new Track("Kitsuné : À cause des garçons (Remixes) - EP", "Kitsuné : À cause des garçons (Remixes) - EP", "Jazz", "Sweet Emma Barrett", "355456", "0", "3")
    ];


    let sort : Sort;

    beforeEach(() => {
        sort = new Sort();
    });
    
    describe('sortToAlbums', () => {
        it('should sort tracks',  () => {
            let sortedData = sort.sortToAlbums(_tracks);

            expect(sortedData.length).toEqual(4);

            //expect(sortedData[0].length).toEqual(4);
            //expect(sortedData[1].length).toEqual(3);
            //expect(sortedData[2].length).toEqual(2);
            //expect(sortedData[3].length).toEqual(1);

            expect(sortedData[0][0].albumTitle).toEqual('At San Quentin');
            expect(sortedData[1][0].albumTitle).toEqual('Gorgeous George');
            expect(sortedData[2][0].albumTitle).toEqual('Kitsuné : À cause des garçons (Remixes) - EP');
            expect(sortedData[3][0].albumTitle).toEqual('A Black Man In Space - EP');

        });
    });

    describe('sortByRating', () => {
        it('should sort tracks',  () => {
            let sortedData = sort.sortByRating(_tracks);

            expect(sortedData.length).toEqual(4);

            expect(sortedData[0].albumTitle).toEqual('Gorgeous George');
            expect(sortedData[0].totalRating).toEqual(7);

            expect(sortedData[3].albumTitle).toEqual('At San Quentin');
            expect(sortedData[3].totalRating).toEqual(1);

        });
    })

});
