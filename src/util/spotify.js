// import React from 'react'; 
// import SearchBar from '../Components/SearchBar/searchbar';
// import { findRenderedComponentWithType } from 'react-dom/test-utils';

let accessToken; // this will return truthy only after being defined 
const clientID = "bc63909ac1974f3b9b1c58ce4b6ce734" // add my client ID here. Make sure to not put this on GH
const redirectURI = "https://lucas-jamming.surge.sh/"

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        
        // stuff that will happen after the user is redirected
        // this checks if we have a match on the URL for expiresIn & access token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        // if we have both, this defines the access token. 
        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1]; // why index of 1? Because we're dealing with a returned object with a specific format (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
            const expiresIn = Number(expiresInMatch[1]) // why index 1 again?

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessUrl;
        }
    },

    async search(term){
        let fetchSearchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}&limit=30`
        return await fetch(fetchSearchUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`},
        }).then(response => {
            return response.json(); // converts to json
        }).then(  
            jsonResponse => {
                if(!jsonResponse.tracks){
                    return [];
                } 
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album:track.album.name,
                        uri: track.uri
                    }  
                })
            }
        );   
    }, 

    async savePlaylist(playlistName, TrackUris){ // writes the learner's custom playlist into their Spotify account 
          if (!playlistName && !TrackUris){
            return;
          }  

          let accesstoken = window.location.href.match(/access_token=([^&]*)/); // this fetches the current accesstoken from the user 
          let headers = {Authorization: `Bearer ${accessToken}`}
        //   let userID;
    
        // Request 1: GET current user's ID 
          const userID = await fetch('https://api.spotify.com/v1/me', {headers: headers})
          .then(response => {return response.json()})
          .then(jsonResponse => {return jsonResponse.id})

          console.log('userID is', userID);
          console.log('accessToken is ', accessToken)
            
        // Request 2: POST a new plylist with the input name to the current user's Spotify account
            // Get the playlist ID back from the request
          const playlistID = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',  
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": playlistName // supposed to be playlistName
            })})
          .then(response => {
              return response.json()})
          .then(jsonResponse => {
              console.log(jsonResponse);
              return jsonResponse.id})

            console.log('playlistID is ', playlistID);

            // Request 3: POST the track URIs to the newly-created playlist - referencing the current user's account & playlist. 
          await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'POST', 
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify({
                uris: TrackUris
            })})
            .then(response => {return response.json()})
            .then(jsonResponse => {
                console.log(jsonResponse);
                return jsonResponse;
            })
    }
} 

export default Spotify;

