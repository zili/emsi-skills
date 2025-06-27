import React, { useState } from "react";
import "./Featured.scss";

function Featured() {
  const [searchAnim, setSearchAnim] = useState(false);

  const handlePopularClick = (text) => {
    // Optionnel : remplir la barre de recherche
    // document.querySelector('.searchInput input').value = text;
    setSearchAnim(true);
    setTimeout(() => setSearchAnim(false), 350); // durée de l'animation
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Partage <span style={{fontStyle:'italic', fontWeight:400}}>tes compétences</span>, collabore sur des projets inoubliables.
          </h1>
          <div className={`search${searchAnim ? ' search-animate' : ''}`}>
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder='Ex: développement web' />
            </div>
            <button>Rechercher</button>
          </div>
          <div className="popular">
            <span>Populaire :</span>
            <button onClick={() => handlePopularClick('Web Design')}>Web Design</button>
            <button onClick={() => handlePopularClick('WordPress')}>WordPress</button>
            <button onClick={() => handlePopularClick('Logo Design')}>Logo Design</button>
            <button onClick={() => handlePopularClick('AI Services')}>AI Services</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
