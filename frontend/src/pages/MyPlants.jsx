
import { useEffect, useState } from "react";

import {
  getPlants,
  addPlant,
  deletePlant,
  getPlantChecks,
} from "../services/api";

// ==========================================
// AI RESULT DISPLAY
// ==========================================

function AIResultDisplay({ result }) {
  if (!result) {
    return null;
  }

  // Old JSON string irundhaal parse pannrom.
  let parsedResult = result;

  if (typeof parsedResult === "string") {
    try {
      parsedResult = JSON.parse(parsedResult);
    } catch {
      return (
        <div className="ai-result">
          <h4>🤖 AI Analysis Result</h4>
          <p>Unable to display this AI result.</p>
        </div>
      );
    }
  }

  if (
    typeof parsedResult !== "object" ||
    Array.isArray(parsedResult)
  ) {
    return null;
  }

  return (
    <div className="ai-result">
      <h4>🤖 AI Analysis Result</h4>

      <section>
        <h4>Possible Issue</h4>
        <p>
          {parsedResult.possible_issue || "Not available"}
        </p>
      </section>

      <section>
        <h4>Explanation</h4>
        <p>
          {parsedResult.explanation || "Not available"}
        </p>
      </section>

      <section>
        <h4>Care Suggestions</h4>

        {Array.isArray(parsedResult.care_suggestions) &&
        parsedResult.care_suggestions.length > 0 ? (
          <ul>
            {parsedResult.care_suggestions.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        ) : (
          <p>No care suggestions available.</p>
        )}
      </section>

      <section>
        <h4>Expert Advice</h4>

        {parsedResult.expert_advice_needed === true ? (
          <p>
            ⚠️ Expert agricultural advice is recommended.
          </p>
        ) : parsedResult.expert_advice_needed === false ? (
          <p>
            Continue monitoring your plant. Seek expert
            advice if the symptoms persist or worsen.
          </p>
        ) : (
          <p>Expert advice status is not available.</p>
        )}
      </section>
    </div>
  );
}

// ==========================================
// MY PLANTS COMPONENT
// ==========================================

function MyPlants({ setPage, setSelectedPlantId }) {
  // Login pannina user information-a localStorage-la
  // irundhu edukkrom.
  const storedUser = localStorage.getItem("plantCareUser");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const currentUserName = currentUser?.name || "";

  // Plants list
  const [plants, setPlants] = useState([]);

  // Add plant form
  const [name, setName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [location, setLocation] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);

  // Open pannirukkura plant card
  const [expandedPlantId, setExpandedPlantId] = useState(null);

  // Plant-wise health check data
  const [healthChecks, setHealthChecks] = useState({});

  // ==========================================
  // LOAD PLANTS
  // ==========================================

  async function loadPlants() {
    try {
      setLoading(true);

      const data = await getPlants(search);
      setPlants(data);
    } catch (error) {
      console.error(error);

      alert(
        error.message || "Failed to load plants."
      );
    } finally {
      setLoading(false);
    }
  }

  // Search change aagumbodhu plants reload pannrom.
  useEffect(() => {
    loadPlants();
  }, [search]);

  // ==========================================
  // ADD PLANT
  // ==========================================

  async function handleAddPlant(e) {
    e.preventDefault();

    if (!currentUserName) {
      alert("Please login before adding a plant.");
      return;
    }

    if (!name.trim() || !plantType.trim()) {
      alert("Plant name and plant type are required.");
      return;
    }

    try {
      await addPlant({
        name: name,
        plant_type: plantType,
        location: location,
        owner_name: currentUserName,
      });

      // Form clear pannrom.
      setName("");
      setPlantType("");
      setLocation("");

      // Updated plant list load pannrom.
      await loadPlants();
    } catch (error) {
      console.error(error);

      alert(
        error.message || "Failed to add plant."
      );
    }
  }

  // ==========================================
  // DELETE PLANT
  // ==========================================

  async function handleDelete(plant) {
    // Owner mattum delete panna mudiyum.
    if (plant.owner_name !== currentUserName) {
      alert("You can only delete your own plants.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${plant.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePlant(
        plant.id,
        currentUserName
      );

      // Deleted plant-oda cached health check remove pannrom.
      setHealthChecks((previous) => {
        const updated = { ...previous };
        delete updated[plant.id];
        return updated;
      });

      if (expandedPlantId === plant.id) {
        setExpandedPlantId(null);
      }

      await loadPlants();
    } catch (error) {
      console.error(error);

      alert(
        error.message || "Failed to delete plant."
      );
    }
  }

  // ==========================================
  // VIEW / HIDE HEALTH CHECK
  // ==========================================

  async function handleHealthCheck(plant) {
    // Same button again click pannina section close aagum.
    if (expandedPlantId === plant.id) {
      setExpandedPlantId(null);
      return;
    }

    // Current plant card open pannrom.
    setExpandedPlantId(plant.id);

    // Already data load pannirundha API call repeat
    // panna vendam.
    if (healthChecks[plant.id] !== undefined) {
      return;
    }

    try {
      setHealthLoading(true);

      // Indha plant-oda health check history mattum
      // backend-la irundhu edukkrom.
      const checks = await getPlantChecks(plant.id);

      // Backend date descending order-la return panninaal
      // first record latest health check.
      const latestCheck =
        checks.length > 0 ? checks[0] : null;

      setHealthChecks((previous) => ({
        ...previous,
        [plant.id]: latestCheck,
      }));
    } catch (error) {
      console.error(error);

      alert(
        error.message || "Failed to load health check."
      );
    } finally {
      setHealthLoading(false);
    }
  }

  // ==========================================
  // OPEN FULL HEALTH CHECK PAGE
  // ==========================================

  function handlePlantClick(plant) {
    setSelectedPlantId(plant.id);
    setPage("plant-check");
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page">
      {/* PAGE HEADER */}
      <div className="hero-small">
        <span>🌿</span>

        <h1>My Plants</h1>

        <p>
          Add and manage your plants in one place.
        </p>
      </div>

      {/* ADD PLANT FORM */}
      <div className="form-card">
        <h2>Add a Plant</h2>

        <p className="card-description">
          Your logged-in account will automatically
          be saved as the owner.
        </p>

        <form onSubmit={handleAddPlant}>
          <label>Plant Name</label>

          <input
            type="text"
            placeholder="Example: Tomato"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Plant Type</label>

          <input
            type="text"
            placeholder="Example: Vegetable"
            value={plantType}
            onChange={(e) =>
              setPlantType(e.target.value)
            }
          />

          <label>
            Location{" "}
            <span>(Optional)</span>
          </label>

          <input
            type="text"
            placeholder="Example: Jaffna"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          <label>Owner Name</label>

          <input
            type="text"
            value={currentUserName}
            readOnly
          />

          <button
            className="primary-btn"
            type="submit"
          >
            + Add Plant
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <h2>Your Plants</h2>

        <p>
          Search your plants and view their health
          information.
        </p>

        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="empty-state">
          <div>🔄</div>
          <h3>Loading plants...</h3>
        </div>
      )}

      {/* PLANT LIST */}
      {!loading && (
        <div className="plant-grid">
          {plants.length === 0 ? (
            <div className="empty-state">
              <div>🌱</div>
              <h3>No plants found</h3>
              <p>Add your first plant above.</p>
            </div>
          ) : (
            plants.map((plant) => {
              const isOwner =
                plant.owner_name === currentUserName;

              const latestCheck =
                healthChecks[plant.id];

              const isExpanded =
                expandedPlantId === plant.id;

              return (
                <div
                  className="plant-card"
                  key={plant.id}
                >
                  {/* PLANT IMAGE */}
                  <div className="plant-image">
                    🌱
                  </div>

                  {/* PLANT INFORMATION */}
                  <div className="plant-info">
                    <h3>{plant.name}</h3>

                    <p className="plant-type">
                      {plant.plant_type}
                    </p>

                    <p className="plant-location">
                      📍{" "}
                      {plant.location ||
                        "Location not provided"}
                    </p>

                    <p className="plant-owner">
                      👤 <strong>Owner:</strong>{" "}
                      {plant.owner_name}
                    </p>
                  </div>

                  {/* HEALTH CHECK SECTION */}
                  {isExpanded && (
                    <div className="latest-check-box">
                      <h4>🩺 Health Check</h4>

                      {healthLoading && (
                        <p className="check-loading">
                          Loading health information...
                        </p>
                      )}

                      {!healthLoading &&
                        latestCheck === null && (
                          <p className="no-check">
                            No health check found for
                            this plant.
                          </p>
                        )}

                      {!healthLoading &&
                        latestCheck && (
                          <>
                            {/* PROBLEM */}
                            <div className="check-detail">
                              <strong>Problem:</strong>

                              <p>
                                {latestCheck.symptoms}
                              </p>
                            </div>

                            {/* CHECK DATE */}
                            <div className="check-detail">
                              <strong>Check Date:</strong>

                              <p>
                                {latestCheck.check_date}
                              </p>
                            </div>

                            {/* STRUCTURED AI RESULT */}
                            {latestCheck.ai_result && (
                              <AIResultDisplay
                                result={
                                  latestCheck.ai_result
                                }
                              />
                            )}
                          </>
                        )}
                    </div>
                  )}

                  {/* VIEW / HIDE HEALTH CHECK BUTTON */}
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={() =>
                      handleHealthCheck(plant)
                    }
                  >
                    {isExpanded
                      ? "Hide Health Check"
                      : "View Health Check"}
                  </button>

                  {/* DELETE BUTTON */}
                  {isOwner && (
                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() =>
                        handleDelete(plant)
                      }
                    >
                      Delete
                    </button>
                  )}

                  {/* OPEN FULL HEALTH CHECK PAGE */}
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() =>
                      handlePlantClick(plant)
                    }
                  >
                    Open Full Health Check
                  </button>
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
