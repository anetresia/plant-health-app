const API_URL = "http://127.0.0.1:8000";


// ===============================
// PERSON
// ===============================

export async function createPerson(name, email) {

  const response = await fetch(
    `${API_URL}/persons/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
    {
      method: "POST"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create person");
  }

  return response.json();
}


export async function verifyPerson(name, email) {

  const response = await fetch(
    `${API_URL}/persons/verify?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error("Person not found");
  }

  return response.json();
}



// ===============================
// PLANTS
// ===============================

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

  const params = new URLSearchParams();

  params.append(
    "name",
    plant.name
  );

  params.append(
    "plant_type",
    plant.plant_type
  );

  params.append(
    "location",
    plant.location || ""
  );

  params.append(
    "symptoms",
    plant.symptoms || ""
  );


  const response = await fetch(
    `${API_URL}/plants/?${params.toString()}`,
    {
      method: "POST"
    }
  );


  if (!response.ok) {
    throw new Error("Failed to add plant");
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
    throw new Error("Failed to delete plant");
  }

  return response.json();
}