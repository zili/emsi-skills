import React, { useState, useEffect } from "react";
import "./AccueilStaffClub.scss";
import FeaturedStaffClub from "../components/FeaturedStaffClub";
// import TrustedBy from "../components/trustedBy/TrustedBy";
import Slide from "../components/slide/Slide";
import CatCard from "../components/catCard/CatCard";
import ProjectCard from "../components/projectCard/ProjectCard";

function AccueilStaffClub() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les projets récents (publics)
        const projectsResponse = await fetch('http://localhost:8000/api/projects/public/?limit=8');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.results || projectsData || []);
        }

        // Charger les catégories (si l'endpoint existe)
        try {
          const categoriesResponse = await fetch('http://localhost:8000/api/projects/categories/');
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            setCategories(categoriesData.results || categoriesData || []);
          }
        } catch (error) {
          console.log('Endpoint catégories non disponible, utilisation des données par défaut');
        }

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <FeaturedStaffClub />
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertips</h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Quality work done quickly
            </div>
            <p>
              Find the right freelancer to begin working on your project within
              minutes.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Protected payments, every time
            </div>
            <p>
              Always know what you'll pay upfront. Your payment isn't released
              until you approve the work.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              24/7 support
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
          </div>
          <div className="item">
            <video src="./img/video.mp4" controls />
          </div>
        </div>
      </div>
      <div className="features dark business-blue">
        <div className="container">
          <div className="item">
            <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8}}>
              <span style={{fontWeight:800, color:'#0a66c2', fontSize:'2.2rem'}}>EMSI</span>
              <span style={{fontStyle:'italic', fontSize:'2.2rem', color:'#fff'}}>Skills Share</span>
              <span style={{fontWeight:700, fontStyle:'normal', color:'#0a66c2', fontSize:'2.2rem'}}>X LinkedIn</span>
            </div>
            <h2 style={{fontWeight:400, margin:'18px 0 10px 0', color:'#fff', fontSize:'1.35rem', textAlign:'left'}}>
              Boostez vos compétences et votre employabilité !
            </h2>
            <p style={{fontSize:'1.13rem', color:'#e6f4ee', marginBottom:'18px', textAlign:'left', lineHeight:'1.7'}}>
              EMSI Skills Share est la plateforme exclusive des étudiants EMSI pour valoriser leurs projets, développer des compétences concrètes et se démarquer sur le marché du travail.<br/>
              Construisez un CV unique, exposez vos réalisations, et maximisez vos chances de placement grâce à l'esprit LinkedIn et la force du réseau EMSI.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              <b>Projets concrets</b> pour enrichir votre portfolio
            </div>
            <div className="title">
              <img src="./img/check.png" alt="" />
              <b>Compétences certifiées</b> et valorisées auprès des recruteurs
            </div>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Un <b>tremplin</b> pour votre carrière et votre réseau professionnel
            </div>
          </div>
          <div className="item">
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624768/business-desktop-870-x2.png"
              alt="Business LinkedIn"
              style={{borderRadius:'18px', width:'100%', height:'auto', boxShadow:'none'}}
            />
          </div>
        </div>
      </div>
      <div className="explore">
        <div className="container">
          <h1>Explore the marketplace</h1>
          <div className="items">
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Graphics & Design</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Digital Marketing</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Writing & Translation</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/video-animation.f0d9d71.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Video & Animation</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Music & Audio</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Programming & Tech</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Business</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/lifestyle.745b575.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Lifestyle</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/data.718910f.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Data</span>
            </div>
            <div className="item">
              <img
                src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/photography.01cf943.svg"
                alt=""
              />
              <div className="line"></div>
              <span>Photography</span>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Chargement des projets...</p>
        </div>
      ) : projects.length > 0 ? (
        <Slide slidesToShow={4} arrowsScroll={4}>
          {projects.map((project) => (
            <ProjectCard key={project.id} card={{
              id: project.id,
              img: project.images?.[0]?.image || "https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=1600",
              pp: project.client?.profile_picture || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
              cat: project.category?.name || "Développement",
              username: project.client?.username || "Utilisateur EMSI"
            }} />
          ))}
        </Slide>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Aucun projet disponible pour le moment</p>
        </div>
      )}
    </div>
  );
}

export default AccueilStaffClub; 