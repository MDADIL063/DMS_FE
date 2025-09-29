import logo from "../../assets/images/truck-loader.gif";

const Loader = () => {
  return (
    <div className="loading-screen">
      <img src={logo} alt="loader" />
    </div>
  );
};

export default Loader;
