import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoList = props => {
  const { onVideoClick } = props;
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:3003/videos');
      setVideos(res.data);
    } catch (err) {
      console.log(err);
      // handle error
    }
  };
//The useEffect hook is used to fetch the videos when the component mounts.
// The empty dependency array ([]) ensures that the fetchVideos function is only called once
  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoClick = videoName => {
    onVideoClick(videoName);
  };

  return (
    <ul style={{
      boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)',
      borderRadius: '10px',
      padding: '1rem'
    }}
    class="form-select" size="3" aria-label="size 3 select example">
    {videos.map((videoName, index) => (
      <li style={{
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        padding: '1rem'
      }}
      key={index} onClick={() => handleVideoClick(videoName)}>
        {videoName}
      </li>
    ))}
    </ul>
  );
};

export default VideoList;