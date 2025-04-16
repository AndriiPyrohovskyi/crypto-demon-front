import './Sidebar.css';

const Sidebar = ({ items, onSelect, activeItem }: { items: { label: string; value: string }[]; onSelect: (value: string) => void; activeItem: string }) => {
  return (
    <div className="sidebar">
      <ul>
        {items.map((item) => (
          <li
            key={item.value}
            className={activeItem === item.value ? 'sidebar__item active' : 'sidebar__item'}
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