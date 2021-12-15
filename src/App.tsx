import React, { ReactElement } from 'react';
import './App.css';
import WebTorrent  from 'webtorrent'
import { Instance as WebTorrentInstance } from 'webtorrent'
import { Torrent, TorrentFile } from 'webtorrent'
// import { Instance as SimplePeer } from 'simple-peer';
import FileGetter from './FileGetter';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';
import Player from './Player';

// A group of peers discovered each other through a torrent file/magnet link
// class PeerGroup {}

type MovieStatus = undefined | 'loading' | TorrentFile

class App extends React.Component<Props> {
  render(): React.ReactNode {
    let [ player, filegetter ] : [null | ReactElement, null | ReactElement ] = [null, null];
    switch (this.movie) {
      case 'loading': break;
      case undefined: [player, filegetter] = [ null, <FileGetter parentCallback={this.seedFile}/> ]; break;
      default: [player, filegetter] = [<Player movie={this.movie}/>, null]; break;
    }
    
    return (
      <div id="app" className="App">
        { filegetter }
        { player }
      </div>
    )
  }

  client : WebTorrentInstance;
  movie : MovieStatus
  constructor(props : any){
    super(props)
    this.client = new WebTorrent()
    if (this.props.params.torrentcode) {
      let torrentID = atob(this.props.params.torrentcode)
      console.info('Asking for torrent', torrentID)
      this.movie = 'loading'
      this.client.add(torrentID, this.toMovieSession)
    } else {
      this.movie = undefined
    }
  }

  _toMovieSession = (file : TorrentFile, torrentcode : string) => {
    this.movie = file;
    this.props.navigate(`movie/${btoa(torrentcode)}`);
  }

  
  toMovieSession = (torrent : Torrent) => {
    console.info('To movie session', torrent)
    let file = torrent.files.find(file => file.name.endsWith('.mp4'))
    if (file === undefined) throw Error('Cannot find a mp4 file in torrent')
    this._toMovieSession(file, torrent.magnetURI)
    console.log('debug torrent', torrent.path, torrent)
  }

  seedFile = (file : File) => {
    console.info("Parsing file to seed", file)
    this.client.seed(file, this.toMovieSession)
  }
}

type Props = {
  navigate : NavigateFunction,
  params : Readonly<Params<string>>
}

function WithNavigateApp(props : any) {
  let navigate = useNavigate();
  let params = useParams();
  return <App {...props} navigate={navigate} params={params}/>
}

export default WithNavigateApp;
