import React, { useState } from 'react';
import axios from 'axios';
import './Regular.scss';
import LoadingDots from 'imgs/loading-dots.gif';

const Regular = () => {
  const [file, setFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [progress, setProgress] = useState(null);

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', file, file.name);
    axios
      .post(`/api/image/upload`, fd, {
        onUploadProgress: (progressEvent) => {
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          console.log(
            'Upload progress: ',
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
      .then(({ data }) => {
        setImageId(data);
        setFile(null);
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          const errMsg = err.response.data;
          console.log(errMsg);
          alert(errMsg);
        } else {
          console.log('db error');
          alert('db error');
        }
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      });
  };

  const handleClick = () => {
    if (inputContainsFile) {
      setCurrentlyUploading(true);
      fileUploadHandler();
    }
  };

  return (
    <div className='regular'>
      <div className='image-section'>
        {imageId ? (
          <>
            <img
              className='image'
              src={`/api/image/${imageId}`}
              alt='regular version'
            />
            <div>
              <a href={`/api/image/${imageId}`}>
                link: {`/api/image/${imageId}`}
              </a>
              <p>this image will be deleted from the db after a day or so</p>
            </div>
          </>
        ) : (
          <p>no regular version pic loaded</p>
        )}
      </div>
      <div className='inputcontainer'>
        {currentlyUploading ? (
          <img
            src={LoadingDots}
            className='loadingdots'
            alt='upload in progress'
          />
        ) : (
          <>
            <input
              className='file-input'
              onChange={handleFile}
              type='file'
              name='file'
              id='file'
            />
            <label
              className={`inputlabel ${file && 'file-selected'}`}
              htmlFor='file'
              onClick={handleClick}
            >
              {file ? <>SUBMIT</> : <>REGULAR VERSION</>}
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default Regular;
