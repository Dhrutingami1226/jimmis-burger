import React, { useState, useEffect } from "react";
import "./storelocator.css";

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/stores");
        
        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }
        
        const data = await response.json();
        const sortedStores = (data.data || []).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setStores(sortedStores);
        setError(null);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError(err.message);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="store-locator-container">
        <div className="store-locator-header">
          <h1>Our Store Locations</h1>
          <p>Find the nearest JIMIS BURGER outlet near you</p>
        </div>
        <div className="loading">Loading stores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-locator-container">
        <div className="store-locator-header">
          <h1>Our Store Locations</h1>
          <p>Find the nearest JIMIS BURGER outlet near you</p>
        </div>
        <div className="error">Error loading stores: {error}</div>
      </div>
    );
  }

  return (
    <div className="store-locator-container">
      <div className="store-locator-header">
        <h1>Our Store Locations</h1>
        <p>Find the nearest JIMIS BURGER outlet near you</p>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <div key={store.id} className="store-card">
            <div className="store-image">
              <img src={store.image} alt={store.name} />
              <div className="store-badge">{store.name}</div>
            </div>

            <div className="store-info">
              <h2>{store.name}</h2>
              
              <div className="store-address">
                <p>{store.address}</p>
              </div>

              <div className="store-phone">
                <strong>Phone:</strong>
                <a href={`tel:${store.phone}`}>{store.phone}</a>
              </div>

              <div className="store-actions">
                <a href={store.mapLink} target="_blank" rel="noopener noreferrer" className="map-btn">
                  📍 View on Map
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreLocator;
