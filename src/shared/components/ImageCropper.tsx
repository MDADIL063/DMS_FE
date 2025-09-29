import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { UtilService } from "../../services/util.service";
import BootstrapDialog from "./Styled/BootstrapDialog";

interface ImageCropperProps {
  file: File | string;
  aspectRatio?: number;
  onCrop: (file: Blob | null) => void;
}

const ImageCropper = (props: ImageCropperProps) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const cropperRef = useRef<ReactCropperElement>(null);
  const utilSvc = new UtilService();

  const aspectRatio = props.aspectRatio ? props.aspectRatio : undefined;

  useEffect(() => {
    processFile();
  }, []);

  const processFile = async () => {
    const src = await utilSvc.convertFileToBase64(props.file as File);
    setImgSrc(src);
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    const croppedFile: Blob = utilSvc.convertBase64ToBlob(cropper?.getCroppedCanvas().toDataURL() as string);
    props.onCrop(croppedFile);
  };

  return (
    <BootstrapDialog
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      className={"image-cropper-dialog-wrapper"}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Crop Image
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.onCrop(null)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {imgSrc ? (
          <Cropper src={imgSrc} style={{ height: "100%", width: "100%" }} aspectRatio={aspectRatio} guides={false} ref={cropperRef} />
        ) : (
          <div className="image-cropper-loader">
            <CircularProgress color="inherit" />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={() => props.onCrop(null)}>
          Cancel
        </Button>
        <Button autoFocus variant="contained" className="submit-btn" onClick={onCrop}>
          Crop
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ImageCropper;
