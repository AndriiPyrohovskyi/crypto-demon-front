import Dropdown from "../../../../components/Dropdown/Dropdown";

const ProfileStats = () => {
    return (
        <div className="profile__content">
        <h2>Статистика</h2>
        <Dropdown options={[
          { label: "Графік 1", value: "graph1" },
          { label: "Графік 2", value: "graph2" },
          { label: "Графік 3", value: "graph3" }
        ]} />
        <div className="profile__chart">Тут буде графік</div>
      </div>
    );
}

export default ProfileStats;