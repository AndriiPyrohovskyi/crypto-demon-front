import './Sidebar.css';

interface SidebarProps {
  items: { label: string; value: string }[];
  onSelect: (value: string) => void;
  activeItem: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onSelect, activeItem }) => {
  return (
    <div className="sidebar">
      <ul>
        {items.map((item) => (
          <li
            key={item.value}
            className={`sidebar__item ${activeItem === item.value ? 'active' : ''}`}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
