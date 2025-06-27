import React from "react";
import "./Slide.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Slide = ({ children, slidesToShow = 4, arrowsScroll = 4 }) => {
  return (
    <div className="slide">
      <div className="container">
        <Swiper
          slidesPerView={slidesToShow}
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: slidesToShow,
            },
          }}
        >
          {children && children.map((child, index) => (
            <SwiperSlide key={index}>
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slide;
