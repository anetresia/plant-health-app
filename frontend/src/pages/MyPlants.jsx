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

  const [ownerName, setOwnerName] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);


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


  useEffect(() => {

    loadPlants();

  }, [search]);


  async function handleAddPlant(e) {

    e.preventDefault();


    if (!name || !plantType || !ownerName) {

      alert(
        "Plant name, plant type and owner name are required."
      );

      return;
    }


    try {

      await addPlant({

        name: name,

        plant_type: plantType,

        location: location,

        owner_name: ownerName

      });


      setName("");

      setPlantType("");

      setLocation("");

      setOwnerName("");


      loadPlants();


    } catch (error) {

      console.error(error);

      alert("Failed to add plant.");

    }
  }


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


      <div className="hero-small">

        <span>🌿</span>

        <h1>My Plants</h1>

        <p>
          Add and manage your plants in one place.
        </p>

      </div>



      <div className="form-card">

        <h2>Add a Plant</h2>

        <p className="card-description">
          Save your plant information for future analysis.
        </p>


        <form onSubmit={handleAddPlant}>


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


          <label>
            Owner Name
          </label>

          <input
            type="text"
            placeholder="Example: Resia"
            value={ownerName}
            onChange={(e) =>
              setOwnerName(e.target.value)
            }
          />


          <button
            className="primary-btn"
            type="submit"
          >

            + Add Plant

          </button>

        </form>

      </div>



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



      {loading && (

        <div className="empty-state">

          <div>🔄</div>

          <h3>
            Loading plants...
          </h3>

        </div>

      )}



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


                <div className="plant-image">

                  🌱

                </div>


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