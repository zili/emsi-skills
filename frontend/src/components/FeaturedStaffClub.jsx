import React from "react";
import "./featured/Featured.scss";
import { useNavigate } from "react-router-dom";

function FeaturedStaffClub() {
  const navigate = useNavigate();

  const handleAddProject = () => {
    navigate('/add-project');
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Partage <span style={{fontStyle:'italic', fontWeight:400}}>tes compétences</span>, collabore sur des projets inoubliables.
          </h1>
          <div className="add-project-section">
            <button className="add-project-btn" onClick={handleAddProject}>
              <span className="plus-icon">+</span>
              Ajouter un projet
            </button>
            <p className="subtitle">Créez votre projet et trouvez les talents parfaits pour le réaliser</p>
          </div>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default FeaturedStaffClub; 