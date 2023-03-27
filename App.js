import './App.css';
import React, { useState } from 'react';
import UploadForm from './UploadFormComponent.jsx';
import VideoList from './ListComponent.jsx';
import VideoPlayer from './PlayerComponent.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [selectedVideo, setSelectedVideo] = useState('');
  
    const onVideoClick = videoName => {
      setSelectedVideo(videoName);
    };
  
    return (
      <div>
        <UploadForm />
        <VideoList onVideoClick={onVideoClick} />
        {selectedVideo && <VideoPlayer videoName={selectedVideo} />}
      </div>
      )
  };

export default App;
