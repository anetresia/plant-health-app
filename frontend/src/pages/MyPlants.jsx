import { useEffect, useState } from "react";

import {
  getPlants,
  addPlant,
  deletePlant,
  getPlantChecks
} from "../services/api";


function MyPlants({
  setPage,
  setSelectedPlantId
}) {

  // =================================
  // LOGGED-IN USER
  // =================================
  // Login pannina user information-a
  // localStorage-la irundhu edukkrom.

  const storedUser =
    localStorage.getItem("plantCareUser");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const currentUserName =
    currentUser?.name || "";


  // =================================
  // PLANTS
  // =================================
  // Backend-la irundhu varra
  // plants list-a store pannrom.

  const [plants, setPlants] = useState([]);


  // =================================
  // ADD PLANT FORM
  // =================================

  const [name, setName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [location, setLocation] = useState("");


  // =================================
  // SEARCH
  // =================================

  const [search, setSearch] = useState("");


  // =================================
  // LOADING
  // =================================

  const [loading, setLoading] =
    useState(false);


  // =================================
  // EXPANDED PLANT
  // =================================
  // Endha plant-oda health check
  // open pannirukkom-nu store pannrom.
  //
  // Initially null.
  // So page open aagumbothu
  // health result edhuvum show aagadhu.

  const [expandedPlantId, setExpandedPlantId] =
    useState(null);


  // =================================
  // HEALTH CHECK DATA
  // =================================
  // Click panna plant-oda health check
  // inga store pannrom.

  const [healthChecks, setHealthChecks] =
    useState({});


  // =================================
  // HEALTH CHECK LOADING
  // =================================

  const [healthLoading, setHealthLoading] =
    useState(false);


  // =================================
  // LOAD PLANTS
  // =================================

  async function loadPlants() {

    try {

      setLoading(true);

      // Search value based on
      // plants fetch pannrom.

      const data =
        await getPlants(search);

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

    // Browser form refresh-a
    // stop pannrom.

    e.preventDefault();


    // Login pannala na plant add
    // panna allow pannakoodathu.

    if (!currentUserName) {

      alert(
        "Please login before adding a plant."
      );

      return;
    }


    // Required fields check.

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

      // Current logged-in user name-a
      // automatically owner-aa save pannrom.

      await addPlant({

        name: name,

        plant_type: plantType,

        location: location,

        owner_name: currentUserName

      });


      // Form clear.

      setName("");
      setPlantType("");
      setLocation("");


      // Updated plant list load.

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
    // Current user owner-aa irundha
    // mattum delete panna allow pannrom.

    if (
      plant.owner_name !== currentUserName
    ) {

      alert(
        "You can only delete your own plants."
      );

      return;
    }


    // =================================
    // CONFIRMATION
    // =================================

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${plant.name}"?`
      );


    if (!confirmed) {

      return;
    }


    try {

      // Backend-ku plant ID + owner name
      // send pannrom.

      await deletePlant(
        plant.id,
        currentUserName
      );


      // Delete success aana
      // list reload pannrom.

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
  // VIEW / HIDE HEALTH CHECK
  // =================================

  async function handleHealthCheck(plant) {

    // =================================
    // IF ALREADY OPEN
    // =================================
    // Same button second time click panna
    // health section close pannrom.

    if (
      expandedPlantId === plant.id
    ) {

      setExpandedPlantId(null);

      return;
    }


    // =================================
    // OPEN THIS PLANT
    // =================================
    // Current plant ID mattum expand pannrom.

    setExpandedPlantId(
      plant.id
    );


    // Already data load pannirundha
    // API request again panna vendam.

    if (
      healthChecks[plant.id] !== undefined
    ) {

      return;
    }


    try {

      setHealthLoading(true);


      // =================================
      // GET THIS PLANT'S HISTORY
      // =================================
      // Important:
      //
      // plant.id use pannrom.
      //
      // So Tomato click pannina
      // Tomato history mattum varum.
      //
      // Chilli click pannina
      // Chilli history mattum varum.

      const checks =
        await getPlantChecks(
          plant.id
        );


      // Backend date descending order-la
      // history return pannum.
      //
      // So first item latest check.

      const latestCheck =
        checks.length > 0
          ? checks[0]
          : null;


      // Particular plant ID-ku
      // particular health check save pannrom.

      setHealthChecks((previous) => ({
        ...previous,

        [plant.id]: latestCheck

      }));

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to load health check."
      );

    } finally {

      setHealthLoading(false);

    }
  }


  // =================================
  // OPEN PLANT CHECK PAGE
  // =================================

  function handlePlantClick(plant) {

    // Selected plant ID App.jsx-ku
    // send pannrom.

    setSelectedPlantId(
      plant.id
    );


    // Plant Check page open pannrom.

    setPage(
      "plant-check"
    );
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
          Add and manage your plants
          in one place.
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
          Your logged-in account will
          automatically be saved as the owner.
        </p>


        <form
          onSubmit={handleAddPlant}
        >

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


          <label>
            Owner Name
          </label>

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


      {/* =================================
          SEARCH
      ================================== */}

      <div className="search-section">

        <h2>
          Your Plants
        </h2>

        <p>
          Search your plants and view
          their health information.
        </p>


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
              // OWNER CHECK
              // =================================

              const isOwner =
                plant.owner_name ===
                currentUserName;


              // =================================
              // CURRENT PLANT HEALTH CHECK
              // =================================
              // Indha particular plant-ku
              // load pannina latest check.

              const latestCheck =
                healthChecks[plant.id];


              // =================================
              // CHECK WHETHER CARD IS OPEN
              // =================================

              const isExpanded =
                expandedPlantId ===
                plant.id;


              return (

                <div
                  className="plant-card"
                  key={plant.id}
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
                      HEALTH CHECK SECTION
                  ================================== */}
                  {/* 
                      IMPORTANT:
                      Initially hidden.
                      
                      View Health Check button click
                      pannina mattum indha section
                      show aagum.
                  */}

                  {isExpanded && (

                    <div className="latest-check-box">

                      <h4>
                        🩺 Health Check
                      </h4>


                      {healthLoading && (

                        <p className="check-loading">
                          Loading health information...
                        </p>

                      )}


                      {!healthLoading &&
                        latestCheck === null && (

                        <p className="no-check">
                          No health check found
                          for this plant.
                        </p>

                      )}


                      {!healthLoading &&
                        latestCheck && (

                        <>

                          {/* Problem */}

                          <div className="check-detail">

                            <strong>
                              Problem:
                            </strong>

                            <p>
                              {latestCheck.symptoms}
                            </p>

                          </div>


                          {/* Date */}

                          <div className="check-detail">

                            <strong>
                              Check Date:
                            </strong>

                            <p>
                              {latestCheck.check_date}
                            </p>

                          </div>


                          {/* AI RESULT */}

                          {latestCheck.ai_result && (

                            <div className="ai-result">

                              <h4>
                                🤖 AI Analysis Result
                              </h4>

                              <p>
                                {latestCheck.ai_result}
                              </p>

                            </div>

                          )}

                        </>

                      )}

                    </div>

                  )}


                  {/* =================================
                      VIEW / HIDE HEALTH CHECK BUTTON
                  ================================== */}

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


                  {/* =================================
                      DELETE BUTTON
                  ================================== */}

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


                  {/* =================================
                      OPEN FULL HEALTH CHECK PAGE
                  ================================== */}

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