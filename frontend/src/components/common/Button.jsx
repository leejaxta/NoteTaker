const Button = ({ children, type = "button", onClick, disabled }) => {
  return (
    <>
      <style>
        {`
          .internal-button {
            padding: 8px 16px;
            background-color: #121212;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .internal-button:hover {
            background-color: #2E2E2E;
          }

          .internal-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="internal-button"
      >
        {children}
      </button>
    </>
  );
};

export default Button;


