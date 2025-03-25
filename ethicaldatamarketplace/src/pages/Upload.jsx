import UploadForm from '../components/UploadForm';

function Upload() {
  return (
    <div className="upload-page">
      <h1 className="section-title">Share Your Dataset</h1>
      <p className="upload-intro">
        Share your valuable data with AI researchers and developers. 
        Your data will be stored securely on Filecoin through Akave, ensuring 
        proper attribution and compensation for your work.
      </p>
      <UploadForm />
    </div>
  );
}

export default Upload;