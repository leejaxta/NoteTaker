import { FiLogOut } from "react-icons/fi"; 
import "../../styles/Navbar.css";

const Navbar = ({ user, handleLogout }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
           <img src="/note_taker.png" alt="Logo" className="app-logo" />
          <h1 className="navbar-title">Notes</h1>
        </div>
        <div className="navbar-right">
          {user?.name && <span className="navbar-username">{user.name}</span>}
            <FiLogOut className="logout-icon" onClick={handleLogout} />        
        </div>
      </div>
    </header>
  );
};

export default Navbar;
