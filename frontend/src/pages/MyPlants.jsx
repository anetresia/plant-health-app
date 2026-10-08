import { useEffect, useState } from "react";

import {
  getPlants,
  addPlant,
  deletePlant
} from "../services/api";

function MyPlants({
  setPage,
  setSelectedPlantId
}) {
  // =================================
  // LOGGED-IN USER
  // =================================
  // Login success aana user information
  // localStorage-la save pannirukkom.
  //
  // Andha user name-a eduthu
  // current owner-aa use pannrom.

  const storedUser =
    localStorage.getItem("plantCareUser");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const currentUserName =
    currentUser?.name || "";

  // =================================
  // PLANTS STATE
  // =================================

  // Backend-la irundhu varra
  // plants list-a store pannrom.
  const [plants, setPlants] = useState([]);

  // Add Plant form values
  const [name, setName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [location, setLocation] = useState("");

  // Search value
  const [search, setSearch] = useState("");

  // Loading status
  const [loading, setLoading] = useState(false);

  // =================================
  // LOAD PLANTS
  // =================================

  async function loadPlants() {
    try {
      setLoading(true);

      // Inga owner filter use pannala.
      //
      // Reason:
      // User-created plants mattum illaama,
      // other users-oda plants-um view panna
      // allow pannrom.
      //
      // But Delete button mattum owner-ku
      // condition based-a show pannuvom.

      const data = await getPlants(search);

      setPlants(data);

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Failed to load plants."
      );

    } finally {
      setLoading(false);
    }
  }

  // =================================
  // LOAD PLANTS WHEN SEARCH CHANGES
  // =================================

  useEffect(() => {
    loadPlants();
  }, [search]);

  // =================================
  // ADD PLANT
  // =================================

  async function handleAddPlant(e) {
    // Browser form refresh-a stop pannrom.
    e.preventDefault();

    // Login pannala na plant add
    // panna allow panna koodathu.
    if (!currentUserName) {
      alert(
        "Please login before adding a plant."
      );

      return;
    }

    // Required fields check
    if (
      !name.trim() ||
      !plantType.trim()
    ) {
      alert(
        "Plant name and plant type are required."
      );

      return;
    }

    try {
      // =================================
      // ADD PLANT TO BACKEND
      // =================================
      // Owner name manually type panna vendam.
      //
      // Login pannina current user's name
      // automatically owner_name-aa send pannrom.

      await addPlant({
        name: name,
        plant_type: plantType,
        location: location,
        owner_name: currentUserName
      });

      // Form clear
      setName("");
      setPlantType("");
      setLocation("");

      // Updated plants list load
      loadPlants();

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Failed to add plant."
      );
    }
  }

  // =================================
  // DELETE PLANT
  // =================================

  async function handleDelete(plant) {
    // =================================
    // OWNER CHECK
    // =================================
    // Current logged-in user than
    // plant owner-aa irukkanum.

    if (
      plant.owner_name !== currentUserName
    ) {
      alert(
        "You can only delete your own plants."
      );

      return;
    }

    // =================================
    // DELETE CONFIRMATION
    // =================================
    // User confirmation illama delete
    // panna koodathu.

    const confirmed = window.confirm(
      `Are you sure you want to delete "${plant.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      // =================================
      // DELETE FROM BACKEND
      // =================================
      // Backend owner verification-ku
      // current user's name send pannrom.

      await deletePlant(
        plant.id,
        currentUserName
      );

      // Delete successful aana
      // latest list reload pannrom.
      loadPlants();

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Failed to delete plant."
      );
    }
  }

  // =================================
  // OPEN PLANT HEALTH CHECK
  // =================================

  function handlePlantClick(plant) {
    // Selected plant ID App.jsx-ku send pannrom.
    setSelectedPlantId(plant.id);

    // Plant Check page open pannrom.
    setPage("plant-check");
  }

  return (
    <div className="page">

      {/* =================================
          PAGE HEADER
      ================================== */}

      <div className="hero-small">

        <span>
          🌿
        </span>

        <h1>
          My Plants
        </h1>

        <p>
          Add and manage your plants in one place.
        </p>

      </div>


      {/* =================================
          ADD PLANT FORM
      ================================== */}

      <div className="form-card">

        <h2>
          Add a Plant
        </h2>

        <p className="card-description">
          Your logged-in account will automatically
          be saved as the plant owner.
        </p>

        <form onSubmit={handleAddPlant}>

          {/* Plant Name */}

          <label>
            Plant Name
          </label>

          <input
            type="text"
            placeholder="Example: Tomato"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          {/* Plant Type */}

          <label>
            Plant Type
          </label>

          <input
            type="text"
            placeholder="Example: Vegetable"
            value={plantType}
            onChange={(e) =>
              setPlantType(e.target.value)
            }
          />


          {/* Location */}

          <label>
            Location{" "}
            <span>
              (Optional)
            </span>
          </label>

          <input
            type="text"
            placeholder="Example: Jaffna"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />


          {/* Owner */}

          <label>
            Owner Name
          </label>

          <input
            type="text"
            value={currentUserName}
            readOnly
          />


          {/* Add Button */}

          <button
            className="primary-btn"
            type="submit"
          >
            + Add Plant
          </button>

        </form>

      </div>


      {/* =================================
          SEARCH SECTION
      ================================== */}

      <div className="search-section">

        <div>

          <h2>
            Your Plants
          </h2>

          <p>
            Search plants and view their
            health information.
          </p>

        </div>

        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search plants..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* =================================
          LOADING
      ================================== */}

      {loading && (

        <div className="empty-state">

          <div>
            🔄
          </div>

          <h3>
            Loading plants...
          </h3>

        </div>

      )}


      {/* =================================
          PLANT LIST
      ================================== */}

      {!loading && (

        <div className="plant-grid">

          {plants.length === 0 ? (

            <div className="empty-state">

              <div>
                🌱
              </div>

              <h3>
                No plants found
              </h3>

              <p>
                Add your first plant above.
              </p>

            </div>

          ) : (

            plants.map((plant) => {

              // =================================
              // CHECK PLANT OWNER
              // =================================
              // Current user name and
              // plant owner name same-aa irundha
              // idhu current user's plant.

              const isOwner =
                plant.owner_name ===
                currentUserName;

              return (

                <div
                  className="plant-card"
                  key={plant.id}

                  // Whole card click
                  // Plant Check page open pannum.
                  onClick={() =>
                    handlePlantClick(plant)
                  }

                  style={{
                    cursor: "pointer"
                  }}
                >

                  {/* =================================
                      PLANT IMAGE
                  ================================== */}

                  <div className="plant-image">
                    🌱
                  </div>


                  {/* =================================
                      PLANT INFORMATION
                  ================================== */}

                  <div className="plant-info">

                    <h3>
                      {plant.name}
                    </h3>

                    <p className="plant-type">
                      {plant.plant_type}
                    </p>

                    <p className="plant-location">
                      📍{" "}
                      {plant.location ||
                        "Location not provided"}
                    </p>

                    <p className="plant-owner">
                      👤{" "}

                      <strong>
                        Owner:
                      </strong>{" "}

                      {plant.owner_name}

                    </p>

                  </div>


                  {/* =================================
                      VIEW HEALTH CHECK
                  ================================== */}

                  <button
                    className="primary-btn"
                    type="button"

                    onClick={(e) => {

                      // Parent card click stop
                      e.stopPropagation();

                      // Plant Check open
                      handlePlantClick(plant);

                    }}
                  >
                    View Health Check
                  </button>


                  {/* =================================
                      DELETE BUTTON
                  ================================== */}

                  {isOwner && (

                    <button
                      className="delete-btn"
                      type="button"

                      onClick={(e) => {

                        // Parent card click stop
                        e.stopPropagation();

                        // Current user's plant
                        // mattum delete pannuvom.
                        handleDelete(plant);

                      }}
                    >
                      Delete
                    </button>

                  )}

                </div>

              );

            })

          )}

        </div>

      )}

    </div>
  );
}

export default MyPlants;