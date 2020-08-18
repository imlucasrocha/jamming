import React from 'react';
import './App.css';
import SearchBar from "/Users/lucas/Desktop/Projects/jamming/src/Components/SearchBar/searchbar.js";
import SearchResults from "/Users/lucas/Desktop/Projects/jamming/src/Components/SearchResults/searchresults.js";
import Playlist from "/Users/lucas/Desktop/Projects/jamming/src/Components/Playlist/playlist.js";
import Spotify from '../../util/spotify';
import Test from '../../util/test.js';
// import TrackList from '../TrackList/tracklist';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
      // {
      //     name: "Don't go breaking my heart",
      //     artist: "ABBA",
      //     album: "ABBA Forever",
      //     id: "0001"
      //   }, {
      //     name: "Thriller",
      //     artist: "Michael Jackson",
      //     album: "Thriller",
      //     id: "0002"
      //   }, {
      //     name: "Vertigo",
      //     artist: "U2",
      //     album: "The Bad One",
      //   id: "0003"
      // }
    ],
  
      playlistName: "New Playlist",
      playlistTracks: [
        // {
        //   name: "Nude",
        //   artist: "Radiohead",
        //   album: "In Rainbows",
        //   id: "0004"
        // }, {
        //   name: "Jigsaw Falling Into Pieces",
        //   artist: "Radiohead",
        //   album: "In Rainbows",
        //   id: "0005"   
        // }, {
        //   name: "All I Need",
        //   artist: "Radiohead",
        //   album: "In Rainbows",
        //   id: "0006"
        // }
      ]} // end of this.state

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this); 
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);

    };
    
  addTrack(track) {
    let tracks = this.state.playlistTracks; // array of objects in state

    if (tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
      }

    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }
  
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
    }

  
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = [];
    for (let i = 0; i <= this.state.playlistTracks.length - 1; i++){
      trackURIs.push(this.state.playlistTracks[i].uri)
    }
    
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
    this.updatePlaylistName('New Playlist');
  }

  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render() {
    Spotify.getAccessToken();
    return (
      <div>
        
        <h1>Ja<span className="highlight">mmm</span>ing </h1>
        
        {/* <button onClick={Spotify.savePlaylist}>test</button> */}
        
        
        <div className='App'>
          <SearchBar 
              onSearch={this.search}/>
          
          <div className='App-playlist'>
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}  />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave = {this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  } 
};