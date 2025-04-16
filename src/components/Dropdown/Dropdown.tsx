import './Dropdown.css';

const Dropdown = ({ options }: { options: string[] }) => {
  return (
    <select className="dropdown">
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;