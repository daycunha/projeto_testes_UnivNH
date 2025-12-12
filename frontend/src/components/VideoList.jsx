import React, { useEffect, useState } from 'react';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/videos')
      .then(response => response.json())
      .then(data => setVideos(data.videos))
      .catch(err => console.error('Erro ao buscar vídeos:', err));
  }, []);

  const handlePlay = (filename) => {
    // Considera que o NAS serve os vídeos via URL base configurável.
    // Ex.: REACT_APP_VIDEO_BASE_URL=http://192.168.1.4/videos
    const base = process.env.REACT_APP_VIDEO_BASE_URL || "http://192.168.1.4";
    const safeName = encodeURIComponent(filename);
    setSelected(`${base}/${safeName}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Lista de Vídeos</h2>
      <ul>
        {videos.map((video, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>
            <button onClick={() => handlePlay(video)}>{video}</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Reproduzindo: {selected.split('/').pop()}</h3>
          <video controls width="640" src={selected} />
        </div>
      )}
    </div>
  );
};

export default VideoList;
