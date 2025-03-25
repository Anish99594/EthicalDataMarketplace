import DatasetList from '../components/DatasetList';

function Marketplace() {
  return (
    <div className="marketplace-page">
      <h1 className="section-title">Ethical Data Marketplace</h1>
      <p className="marketplace-intro">
        Browse and purchase ethically sourced datasets for your AI projects. 
        All datasets are stored on Filecoin using Akave for decentralized, secure access 
        with proper attribution to creators and fair compensation models.
      </p>
      <DatasetList />
    </div>
  );
}

export default Marketplace;