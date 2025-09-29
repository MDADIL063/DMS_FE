import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import { UtilService } from "../../../services/util.service";
import BootstrapTooltip from "../../../shared/components/Styled/BootstrapTooltip";
import GridItem from "../../../shared/components/Styled/GridItem";

interface IProps {
  imageUrl: string;
  height?: string;
  hideDeleteBtn?: boolean;
  onDelete?: () => void;
}

const VehicleImage = ({ imageUrl, height = "", hideDeleteBtn = false, onDelete }: IProps) => {
  const utilSvc = new UtilService();

  return (
    <>
      {imageUrl ? (
        <GridItem
          className="vehicle-image-card"
          style={{
            height: height ? height : `${utilSvc.isMobile() ? "140px" : "120px"}`,
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          {!hideDeleteBtn ? (
            <div className="row">
              <div className="col-12 text-end">
                <BootstrapTooltip title="Delete" onClick={onDelete}>
                  <DeleteOutlineTwoToneIcon color="error" className="vehicle-image-card-delete-btn" />
                </BootstrapTooltip>
              </div>
            </div>
          ) : null}
        </GridItem>
      ) : (
        <GridItem
          className="vehicle-image-card"
          style={{
            height: height ? height : `${utilSvc.isMobile() ? "140px" : "120px"}`,
            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/hrs-uat.appspot.com/o/UI%2Fdefault-vehicle.png?alt=media&token=25332901-9ff1-4c8e-a691-9f8ee97f5afd)`,
          }}
        ></GridItem>
      )}
    </>
  );
};

export default VehicleImage;
