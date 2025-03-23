import './loader.css';

const Loader = () => {
  console.log('Loader');
  return (
    <div className="modal">
      <div className="loader" data-testid="loader"></div>
    </div>
  );
};

export default Loader;