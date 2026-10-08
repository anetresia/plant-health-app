const API_URL = "http://127.0.0.1:8000";


// ==========================
// PERSON
// ==========================

export async function createPerson(name, email) {

  const response = await fetch(
    `${API_URL}/persons/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,
        email: email
      })
    }
  );


  if (!response.ok) {

    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to create person"
    );
  }


  return response.json();
}


export async function verifyPerson(name, email) {

  const response = await fetch(
    `${API_URL}/persons/verify?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
  );


  if (!response.ok) {

    const errorData = await response.json();

    throw new Error(
      errorData.detail || "Person not found"
    );
  }


  return response.json();
}



// ==========================
// PLANTS
// ==========================

export async function getPlants(search = "") {

  const response = await fetch(
    `${API_URL}/plants/?search=${encodeURIComponent(search)}`
  );


  if (!response.ok) {

    throw new Error("Failed to load plants");

  }


  return response.json();
}


export async function addPlant(plant) {

  const response = await fetch(
    `${API_URL}/plants/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        name: plant.name,

        plant_type: plant.plant_type,

        location: plant.location || null,

        owner_name: plant.owner_name

      })
    }
  );


  if (!response.ok) {

    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to add plant"
    );
  }


  return response.json();
}


export async function deletePlant(id) {

  const response = await fetch(
    `${API_URL}/plants/${id}`,
    {
      method: "DELETE"
    }
  );


  if (!response.ok) {

    const errorData = await response.json();

    throw new Error(
      errorData.detail || "Failed to delete plant"
    );
  }


  return response.json();
}