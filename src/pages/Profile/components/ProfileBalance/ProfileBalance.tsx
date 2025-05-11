import Button from "../../../../components/Button/Button";
import CustomInput from "../../../../components/CustomInput/CustomInput";

const ProfileBalance = () => {
    return (
      <div className="profile__balance">
      <h2>Операції над балансом</h2>
      <div className="profile__balance">
        <p>Баланс: 0.00 $</p>
        <CustomInput
            type="text" 
            onChange={function (_value: string | number): void {
              throw new Error("Function not implemented.");
            } }        
            />
        <Button text="Поповнити баланс" />
        <CustomInput
            type="text" 
            onChange={function (_value: string | number): void {
              throw new Error("Function not implemented.");
            } }        
            />
        <Button text="Вивести кошти" />
      </div>
    </div>
    );
}

export default ProfileBalance;