import React, { useState, useEffect, useMemo } from "react";
import "./nav.css";
import "./menu.css";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/menu");
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setMenus(data.data);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Move useMemo before any conditional returns
  const indices = useMemo(() => {
    if (!menus || menus.length === 0) {
      return { left: null, center: null, right: null };
    }
    const leftIndex = (activeIndex - 1 + menus.length) % menus.length;
    const rightIndex = (activeIndex + 1) % menus.length;
    return {
      left: menus[leftIndex],
      center: menus[activeIndex],
      right: menus[rightIndex]
    };
  }, [activeIndex, menus]);

  if (loading) {
    return <div className="Menu"><p>Loading menu...</p></div>;
  }

  if (!menus || menus.length === 0) {
    return <div className="Menu"><p>No menu items available.</p></div>;
  }

  const { left, center, right } = indices;

  return (
    <>
      <div className="Menu">
        <nav className="menu-nav">
          <ul>
            {menus.map((menu, index) => (
              <li key={menu.id}>
                <button
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                >
                  {menu.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <section className="triple-carousel">
        <div className="carousel-stage">
          <div className="slide slide-left">
            <img 
              src={left.image} 
              alt={left.name}
            />
          </div>

          <div className="slide slide-center">
            <img 
              src={center.image} 
              alt={center.name}
            />
          </div>

          <div className="slide slide-right">
            <img 
              src={right.image} 
              alt={right.name}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
