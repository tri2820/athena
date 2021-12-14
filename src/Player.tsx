
import React from 'react';
import{ TorrentFile } from 'webtorrent';

class Player extends React.Component<Props> {
    render() {
        return <video id='player' width={800} height={500}></video>
    }

    componentDidMount = () => {
        this.props.movie.renderTo('video#player')
    }
}

type Props = {
    movie : TorrentFile
}

export default Player
  