import './Button.css';

const Button = ({ text, onClick }: { text: string; onClick?: () => void }) => {
  return (
    <button className="button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;