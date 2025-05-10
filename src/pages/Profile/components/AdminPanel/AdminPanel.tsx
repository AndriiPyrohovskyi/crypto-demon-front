import Dropdown from "../../../../components/Dropdown/Dropdown";

const AdminPanel = () => {
    return (
        <div className="admin-panel">
        <h1>Admin Panel</h1>
        <p>Welcome to the admin panel!</p>
        <Dropdown 
        options={[]}
        />
        </div>
    );
}

export default AdminPanel;