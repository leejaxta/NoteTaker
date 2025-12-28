import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">Page not found</p>
        <Link to="/" className="notfound-home-btn">
          <FiHome className="home-icon" /> Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
