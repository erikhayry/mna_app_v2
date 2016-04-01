# IMPORTANT NOTE

Thanks to [Rahul Pandey](https://github.com/an-rahulpandey) and his plugin [me.rahul.plugins.audio-picker](https://github.com/an-rahulpandey/ios-audio-picker.git). A lot of my code is based on his work.

# Description

The plugin gives you track information (iTunes/iPod library) from you iOS device using the MPMediaQuery class.

### Installation

    cordova plugin add https://github.com/erikportin/ios-audio-info.git

### Methods & Usage

- **To get all the songs from the music library**

Returns an array with song objects NOT including the image (use the trackId and getTrack method if you need the image)


````
window.plugins.iOSAudioInfo.getTracks(success,error);
````



  success - will be called when songs are exported. You can get the array of songs like this
  
```
    function success(data)
    {
      console.log(JSON.stringify(data));
    }
```
  
 error - will be called if there are any errors in exporting the songs or 

```
    function error(e)
    {
      console.log(e);
    }
```  

- **To get a song from the music library**

Returns an array with a song object including the image if there is one

````
window.plugins.iOSAudioInfo.getTrack(success,error,trackId);
````


  success - will be called when songs are exported. You can get the array of songs like this
  
```
    function success(data)
    {
      console.log(JSON.stringify(data));
    }
```
  
 error - will be called if there are any errors in exporting the songs or 

```
    function error(e)
    {
      console.log(e);
    }
```  

- **Testing**

As the the ios simulator doesn't have any audio data you will either have to test on a real device or you follow the steps in the answer for this [stack overflow question](http://stackoverflow.com/questions/3159716/can-i-access-ipod-library-on-simulator)

- **Use with Ionic**

Include [ngCordova](http://ngcordova.com/) and 

```
    document.addEventListener('deviceready', function () {
        window.plugins.iOSAudioInfo.getTrack(success,error,trackId);
    }, false);
        
```

# TODO

Background threading (the plugin is quite slow), search for song(s) using keywords, return song file, demo, return more track informartion, pagination, sorting, Android support, replicate more [MPMediaQuery methods/features](https://developer.apple.com/library/prerelease/ios/documentation/MediaPlayer/Reference/MPMediaQuery_ClassReference/index.html)...
