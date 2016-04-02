/********* iOSAudioInfo.m Cordova Plugin Implementation *******/

#import "iOSAudioInfo.h"
#import <AVFoundation/AVFoundation.h>

@implementation iOSAudioInfo

- (void) getTracks:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        MPMediaQuery *everything = [[MPMediaQuery alloc] init];
        NSArray *itemsFromGenericQuery = [everything items];
        songsList = [[NSMutableArray alloc] init];
        
        for(MPMediaItem *song in itemsFromGenericQuery){
            [songsList addObject:[self buildSongInfo:song:NO]];            
        }
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:songsList];      
        NSLog(@"The content of arry is%@",songsList); 
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];        
}
- (void) getTrack:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{ 
        NSString *persistentID = [command argumentAtIndex:0];
        
        if(persistentID == nil){
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No ID found"];
        } else {
            MPMediaItem *song;
            MPMediaPropertyPredicate *predicate;
            MPMediaQuery *songQuery;
            
            predicate = [MPMediaPropertyPredicate predicateWithValue: persistentID forProperty:MPMediaItemPropertyPersistentID];
            songQuery = [[MPMediaQuery alloc] init];
            [songQuery addFilterPredicate: predicate];
            
            if (songQuery.items.count > 0){
                song = [songQuery.items objectAtIndex:0];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self buildSongInfo:song:YES]];
            } else {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"track not found"];
            }        
        }

        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (NSMutableDictionary *)buildSongInfo :(MPMediaItem*)song :(BOOL)addImage
{
    NSString *title = [song valueForProperty:MPMediaItemPropertyTitle];
    NSString *albumTitle = [song valueForProperty:MPMediaItemPropertyAlbumTitle];
    NSString *artist = [song valueForProperty:MPMediaItemPropertyArtist];
    NSString *genre = [song valueForProperty:MPMediaItemPropertyGenre];
    NSString *persistentID = [song valueForProperty:MPMediaItemPropertyPersistentID];
    NSString *albumPersistentID = [song valueForProperty:MPMediaItemPropertyAlbumPersistentID];
    NSString *playCount = [song valueForProperty:MPMediaItemPropertyPlayCount];
    NSString *rating = [song valueForProperty:MPMediaItemPropertyRating];
    
    NSLog(@"title = %@",title);
    NSLog(@"albumTitle = %@",albumTitle);
    NSLog(@"albumPersistentID = %@",albumPersistentID);
    NSLog(@"artist = %@",artist);
    NSLog(@"rating = %@",rating);
    NSLog(@"playCount = %@",playCount);

    NSMutableDictionary *songInfo = [[NSMutableDictionary alloc] init];
    if(title != nil) {
        [songInfo setObject:title forKey:@"title"];
    } else {
        [songInfo setObject:@"No Title" forKey:@"title"];
    }
    if(albumTitle != nil) {
        [songInfo setObject:albumTitle forKey:@"albumTitle"];
    } else {
        [songInfo setObject:@"No Album" forKey:@"albumTitle"];
    }
    if(artist !=nil) {
        [songInfo setObject:artist forKey:@"artist"];
    } else {
        [songInfo setObject:@"No Artist" forKey:@"artist"];
    }
    if(genre !=nil) {
        [songInfo setObject:genre forKey:@"genre"];
    } else {
        [songInfo setObject:@"No genre" forKey:@"genre"];
    }
    if(persistentID !=nil) {
        NSLog(@"persistentID = %@",persistentID);
        [songInfo setObject:[NSString stringWithFormat:@"%@", persistentID] forKey:@"persistentID"];
    } else {
        [songInfo setObject:@"No persistentID" forKey:@"persistentID"];
    }
    if(albumPersistentID !=nil) {
        [songInfo setObject:[NSString stringWithFormat:@"%@", albumPersistentID] forKey:@"albumPersistentID"];
    } else {
        [songInfo setObject:@"No albumPersistentID" forKey:@"albumPersistentID"];
    }
    if(playCount !=nil) {
        [songInfo setObject:[NSString stringWithFormat:@"%@", playCount] forKey:@"playCount"];
    } else {
        [songInfo setObject:@"No playCount" forKey:@"playCount"];
    }
    if(rating !=nil) {
        [songInfo setObject:[NSString stringWithFormat:@"%@", rating] forKey:@"rating"];
    } else {
        [songInfo setObject:[NSString stringWithFormat:@"%@", @"-1"] forKey:@"rating"];
    }

    if(addImage){
        BOOL artImageFound = NO;
        NSData *imgData;
        MPMediaItemArtwork *artImage = [song valueForProperty:MPMediaItemPropertyArtwork];
        UIImage *artworkImage = [artImage imageWithSize:CGSizeMake(artImage.bounds.size.width, artImage.bounds.size.height)];
        if(artworkImage != nil){
            imgData = UIImagePNGRepresentation(artworkImage);
            artImageFound = YES;
        }
        if (artImageFound) {
            [songInfo setObject:[imgData base64EncodedStringWithOptions:0] forKey:@"image"];
        } else {
            [songInfo setObject:@"No Image" forKey:@"image"];
        }
    }

    return songInfo;
}

@end