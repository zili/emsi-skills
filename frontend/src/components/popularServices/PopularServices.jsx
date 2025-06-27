import React from "react";
import "./PopularServices.scss";

const services = [
  {
    title: "Website Development",
    img: "/img/service-website.png",
    bg: "#c6f3e5"
  },
  {
    title: "Video Editing",
    img: "/img/service-video.png",
    bg: "#ffe3e3"
  },
  {
    title: "Software Development",
    img: "/img/service-software.png",
    bg: "#f7e7b7"
  },
  {
    title: "SEO",
    img: "/img/service-seo.png",
    bg: "#c6f3e5"
  },
  {
    title: "Architecture & Interior Design",
    img: "/img/service-archi.png",
    bg: "#f7c6d9"
  },
  {
    title: "Book Design",
    img: "/img/service-book.png",
    bg: "#ffe3e3"
  },
];

const PopularServices = () => {
  return (
    <section className="popular-services">
      <h2>Popular services</h2>
      <div className="services-list">
        {services.map((service, i) => (
          <div className="service-card" key={i}>
            <div className="service-title">{service.title}</div>
            <div className="service-img" style={{background: service.bg}}>
              <img src={service.img} alt={service.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularServices; 