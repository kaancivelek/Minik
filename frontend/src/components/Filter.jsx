import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import "../styles/Filter.css"

export default function Filter({searchBarOnChangeHandler, sortOrder, setSortOrder }) {
  const [collapsed, setCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false); // Aşağı kaydırıldığında gizle
      } else {
        setIsVisible(true); // Yukarıda görünür yap
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
     <div className={`filter-container ${isVisible ? "visible" : "hidden"}`}>
    <div className={`navbar ${collapsed ? "collapsed" : "expanded"}`}>
  <button onClick={toggleNavbar} className="filter-toggle-btn">
    FİLTRELER
  </button>

  <div className={`filter-panel ${collapsed ? "hide" : "show"}`}>
    <input
      onChange={searchBarOnChangeHandler}
      type="text"
      placeholder="ARA"
    />
    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
      <option value="">Sırala</option>
      <option value="asc">En Düşük Fiyat</option>
      <option value="desc">En Yüksek Fiyat</option>
      <option value="rate">Yüksek Puanlılar</option>
    </select>
  </div>
</div>


    </div>
  );
}
