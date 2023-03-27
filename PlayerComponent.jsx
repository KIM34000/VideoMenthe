import React, { useState } from 'react';

const VideoPlayer = ({ videoName }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const onTimeUpdate = event => {
    setCurrentTime(event.target.currentTime);
  };

  return (
    <div style={{
      boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)',
      borderRadius: '10px',
      padding: '1rem'
      }}
      className="center-content"
      >
    <video
    //displays the default video controls
      controls={true}
    //React is on port 3000, node.js is on port 3003, the browser blocked the video so I had to add this
      crossOrigin={'anonymous'}
      src={`http://localhost:3003/playVideo/${videoName}`}
      onTimeUpdate={onTimeUpdate}
      onClick={togglePlay}
    />
  </div>
  );
};

export default VideoPlayer;