import { useEffect, useState } from "react";

import {
  getPlants,
  addPlant,
  deletePlant
} from "../services/api";


function MyPlants() {

  const [plants, setPlants] = useState([]);

  const [name, setName] = useState("");

  const [plantType, setPlantType] = useState("");

  const [location, setLocation] = useState("");

  const [symptoms, setSymptoms] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);


  // Load plants from backend
  async function loadPlants() {

    try {

      setLoading(true);

      const data = await getPlants(search);

      setPlants(data);

    } catch (error) {

      console.error(error);

      alert("Failed to load plants.");

    } finally {

      setLoading(false);

    }
  }


  // Load plants when page opens
  // and when search changes
  useEffect(() => {

    loadPlants();

  }, [search]);


  // Add plant
  async function handleAddPlant(e) {

    e.preventDefault();


    if (!name || !plantType || !symptoms) {

      alert(
        "Plant name, plant type and symptoms are required."
      );

      return;
    }


    try {

      await addPlant({

        name: name,

        plant_type: plantType,

        location: location,

        symptoms: symptoms

      });


      // Clear form

      setName("");

      setPlantType("");

      setLocation("");

      setSymptoms("");


      // Reload plants

      loadPlants();


    } catch (error) {

      console.error(error);

      alert("Failed to add plant.");

    }
  }


  // Delete plant
  async function handleDelete(id) {

    try {

      await deletePlant(id);

      loadPlants();

    } catch (error) {

      console.error(error);

      alert("Failed to delete plant.");

    }
  }


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



      {/* ADD PLANT */}

      <div className="form-card">

        <h2>Add a Plant</h2>

        <p className="card-description">
          Save your plant information for future analysis.
        </p>


        <form onSubmit={handleAddPlant}>


          {/* PLANT NAME */}

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


          {/* PLANT TYPE */}

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


          {/* LOCATION */}

          <label>
            Location <span>(Optional)</span>
          </label>

          <input
            type="text"
            placeholder="Example: Jaffna"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />


          {/* SYMPTOMS */}

          <label>
            Symptoms
          </label>

          <textarea
            rows="4"
            placeholder="Example: Lower leaves are turning yellow and curling..."
            value={symptoms}
            onChange={(e) =>
              setSymptoms(e.target.value)
            }
          />


          {/* ADD BUTTON */}

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

        <div>

          <h2>Your Plants</h2>

          <p>
            Search and manage your saved plants.
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



      {/* LOADING */}

      {loading && (

        <div className="empty-state">

          <div>🔄</div>

          <h3>
            Loading plants...
          </h3>

        </div>

      )}



      {/* PLANTS */}

      {!loading && (

        <div className="plant-grid">

          {plants.length === 0 ? (

            <div className="empty-state">

              <div>🌱</div>

              <h3>
                No plants found
              </h3>

              <p>
                Add your first plant above.
              </p>

            </div>

          ) : (

            plants.map((plant) => (

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


                  <p className="plant-symptoms">

                    <strong>
                      Symptoms:
                    </strong>

                    <br />

                    {plant.symptoms ||
                      "No symptoms provided"}

                  </p>

                </div>


                {/* DELETE */}

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(plant.id)
                  }
                >

                  Delete

                </button>

              </div>

            ))

          )}

        </div>

      )}

    </div>

  );
}


export default MyPlants;