const Button = ({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
}) => {
  return (
    <>
      <style>
        {`
          .button {
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease;
            font-weight: 500;
          }

          /* Primary variant */
          .button.primary {
            background-color: #121212;
            color: #fff;
            border: none;
          }

          .button.primary:hover {
            background-color: #2E2E2E;
          }

          /* Secondary variant */
          .button.secondary {
            background-color: transparent;
            color: #121212;
            border: 1px solid #121212;
          }

          .button.secondary:hover {
            background-color: #f0f0f0;
          }

          /* Disabled state */
          .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`button ${variant}`}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
