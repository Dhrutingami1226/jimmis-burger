import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config/api.js";
import StoreForm from "./StoreForm";
import StoreList from "./StoreList";
import StoreSearch from "./StoreSearch";

const AdminDashboard = ({ admin, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [selectedStore, setSelectedStore] = useState(null);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    fetchAllStores();
  }, []);

  const fetchAllStores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/stores`);
      const data = await response.json();
      if (data.success) {
        setStores(data.data);
        setFilteredStores(data.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (storeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData)
      });

      const data = await response.json();
      if (data.success) {
        setStores([...stores, data.data]);
        setFilteredStores([...stores, data.data]);
        setActiveTab("view");
        return { success: true, message: "Store added successfully!" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleUpdateStore = async (storeData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stores/${editingStore.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeData)
        }
      );

      const data = await response.json();
      if (data.success) {
        const updatedStores = stores.map((store) =>
          store.id === editingStore.id ? data.data : store
        );
        setStores(updatedStores);
        setFilteredStores(updatedStores);
        setEditingStore(null);
        setActiveTab("view");
        return { success: true, message: "Store updated successfully!" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/stores/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      if (data.success) {
        const updatedStores = stores.filter((store) => store.id !== id);
        setStores(updatedStores);
        setFilteredStores(updatedStores);
        return { success: true, message: "Store deleted successfully!" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSearchStores = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stores/search?name=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      if (data.success) {
        setFilteredStores(data.data);
      }
    } catch (error) {
      console.error("Error searching stores:", error);
    }
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setActiveTab("add");
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {admin?.name || admin?.email}</p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("view");
            setEditingStore(null);
          }}
        >
          📋 View Stores
        </button>
        <button
          className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          {editingStore ? "✏️ Edit Store" : "➕ Add Store"}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "view" && (
          <div className="view-section">
            <StoreSearch onSearch={handleSearchStores} />
            {loading ? (
              <p>Loading stores...</p>
            ) : (
              <StoreList
                stores={filteredStores}
                onEdit={handleEditStore}
                onDelete={handleDeleteStore}
              />
            )}
          </div>
        )}

        {activeTab === "add" && (
          <StoreForm
            onSubmit={editingStore ? handleUpdateStore : handleAddStore}
            initialData={editingStore}
            isEditing={!!editingStore}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
