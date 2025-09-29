import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IVehicle } from "../../../interfaces/vehicle.interface";

interface IProps {
  vehicle: IVehicle;
  height?: string;
}

const VehicleSlider = ({ vehicle, height = "" }: IProps) => {
  return (
    <Swiper
      spaceBetween={30}
      effect={"fade"}
      navigation={false}
      pagination={false}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop={true}
      modules={[EffectFade, Autoplay]}
      className="vehicle-image-slider"
    >
      {vehicle.imageUrls?.length ? (
        vehicle.imageUrls.map((vehicleImage, index) => (
          <SwiperSlide key={index}>
            <img style={{ height: height ? height : "180px" }} src={vehicleImage.imageUrl} />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <img
            style={{ height: height ? height : "180px" }}
            src="https://firebasestorage.googleapis.com/v0/b/hrs-uat.appspot.com/o/UI%2Fdefault-vehicle.png?alt=media&token=25332901-9ff1-4c8e-a691-9f8ee97f5afd"
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default VehicleSlider;
