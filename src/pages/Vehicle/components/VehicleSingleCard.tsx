import { AppDefaults, AppMessages } from "../../../data/app.constant";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import { UtilService } from "../../../services/util.service";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";
import MenuActionsBtn from "../../../shared/components/Common/MenuActionsBtn";
import GridItem from "../../../shared/components/Styled/GridItem";
import VehicleSlider from "./VehicleSlider";

interface IProps {
  vehicle: IVehicle;
  onDelete: (id: string) => void;
}

const VehicleSingleCard = ({ vehicle, onDelete }: IProps) => {
  return (
    <GridItem style={{ backgroundColor: AppDefaults.DEFAULT_CARD_COLOR }}>
      <VehicleSlider vehicle={vehicle} />
      <div className="row pb-4">
        <div className="col-6 text-start ps-4 mt-4">
          <p className="detail-label">{vehicle.vehicleNumber}</p>
        </div>
        <div className="col-3 mt-4">
          <ActivityStatusChip info={vehicle} verient="filled" />
        </div>
        <div className="col-3 text-end mt-3">
          <MenuActionsBtn info={vehicle} path="/vehicles" deleteConfirmMsg={AppMessages.VEHICLE_DELETE_CONFIRM} onDelete={onDelete} />
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Capacity</p>
          <p className="card-detail-value">{vehicle.capacity}</p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Vehicle Type</p>
          <p className="card-detail-value">{vehicle.vehicleType.name}</p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Vehicle Company</p>
          <p className="card-detail-value">{vehicle.company}</p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Created On</p>
          <p className="card-detail-value">{new UtilService().formatDate(vehicle.createdAt)}</p>
        </div>
      </div>
    </GridItem>
  );
};

export default VehicleSingleCard;
