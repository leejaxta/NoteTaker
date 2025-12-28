import { useState } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import "../../styles/Navbar.css";
import Modal from "./Modal";
import Button from "./Button";

const Navbar = ({ user, handleLogout, onToggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <FiMenu className="menu-icon" onClick={onToggleSidebar} />
            <img src="/note_taker.png" alt="Logo" className="app-logo" />
            <h1 className="navbar-title">Notes</h1>
          </div>
          <div className="navbar-right">
            {user?.name && <span className="navbar-username">{user.name}</span>}
            <FiLogOut
              className="logout-icon"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </header>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Logout"
      >
        <p>Are you sure you want to logout?</p>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleLogout();
              setIsModalOpen(false);
            }}
          >
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
