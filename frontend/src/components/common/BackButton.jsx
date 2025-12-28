import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({ text = "Back", onClick }) => {
  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };
  return (
    <>
      <style>{`
        .back-button {
        display: flex;
        align-items: center;
        gap: 8px; 
        cursor: pointer;
        }

        .back-button:hover {
        text-decoration: underline;
        }

        .back-icon {
        height: 16px;
        width: 16px;
        }

        .back-text {
        font-size: 14px;
        color: #6b7280; 
        }

    `}</style>

      <div className="back-button" onClick={handleBack}>
        <FiArrowLeft className="back-icon" />
        <span className="back-text">{text}</span>
      </div>
    </>
  );
};

export default BackButton;
