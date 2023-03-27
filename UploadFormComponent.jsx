import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button} from 'react-bootstrap';


class UploadForm extends Component {
  state = {
    selectedFile: null,
    uploading: false
  };

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  fileUploadHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('file', this.state.selectedFile);
      this.setState({ uploading: true });
      const res = await axios.post('http://localhost:3003/videoUpload', formData);
      console.log(res.data);
      // show toast message or any other UI update
      this.setState({ uploading: false });
      
    } catch (err) {
      console.log(err);
      // handle error
      this.setState({ uploading: false });
    }
  };

  render() {
    return (
      
      <div className="center-content">        
        <h2 style={{
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        padding: '1rem'
        }}
        className="title">my video list</h2>          
        <input style={{
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        padding: '1rem'
        }}
         type="file" accept="video/*" onChange={this.fileSelectedHandler} />
        <Button style={{
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        padding: '1rem'
        }}
        className="btn"
        variant="primary" onClick={this.fileUploadHandler} disabled={!this.state.selectedFile || this.state.uploading}>
          {this.state.uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    );
  }
}

export default UploadForm;