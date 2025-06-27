import React, { useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useProjects } from "../../hooks/useApi";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const minRef = useRef();
  const maxRef = useRef();

  // Charger les projets depuis l'API
  const { data: gigs, loading, error } = useProjects(filters);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
    // Mettre à jour les filtres selon le tri
    setFilters(prev => ({
      ...prev,
      ordering: type === "sales" ? "-rating" : "-created_at"
    }));
  };

  const apply = () => {
    const minPrice = minRef.current.value;
    const maxPrice = maxRef.current.value;
    
    setFilters(prev => ({
      ...prev,
      ...(minPrice && { min_budget: minPrice }),
      ...(maxPrice && { max_budget: maxPrice })
    }));
  };

  if (loading) {
    return (
      <div className="gigs">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des projets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gigs">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>Erreur: {error}</p>
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">EMSI Skills Share &gt; Projets &gt;</span>
        <h1>Projets Disponibles</h1>
        <p>
          Découvrez les projets proposés par la communauté EMSI
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Appliquer</button>
          </div>
          <div className="right">
            <span className="sortBy">Trier par</span>
            <span className="sortType">
              {sort === "sales" ? "Mieux notés" : "Plus récents"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Plus récents</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Mieux notés</span>
                )}
                <span onClick={() => reSort("sales")}>Populaires</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {gigs && gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCard key={gig.id} item={{
                id: gig.id,
                img: gig.image || "https://images.pexels.com/photos/580151/pexels-photo-580151.jpeg?auto=compress&cs=tinysrgb&w=1600",
                pp: gig.owner?.profile_picture || "https://images.pexels.com/photos/720598/pexels-photo-720598.jpeg?auto=compress&cs=tinysrgb&w=1600",
                desc: gig.description || gig.title,
                price: gig.budget || 59,
                star: gig.rating || 5,
                username: gig.owner?.username || "Utilisateur EMSI"
              }} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Aucun projet disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
