import './Button.css';

const Button = ({ onClick, children }) => {
  return (
    <button className="reset-btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;