
const API_URL = "http://127.0.0.1:8000";


// =================================
// CREATE PERSON
// =================================

export async function createPerson(name, email) {
  const response = await fetch(`${API_URL}/persons/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to create person"
    );
  }

  return response.json();
}


// =================================
// VERIFY PERSON
// =================================

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


// =================================
// GET PLANTS
// =================================

export async function getPlants(
  search = "",
  ownerName = ""
) {
  const response = await fetch(
    `${API_URL}/plants/?search=${encodeURIComponent(search)}&owner_name=${encodeURIComponent(ownerName)}`
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to load plants"
    );
  }

  return response.json();
}


// =================================
// ADD PLANT
// =================================

export async function addPlant(plant) {
  const response = await fetch(`${API_URL}/plants/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: plant.name,
      plant_type: plant.plant_type,
      location: plant.location || null,
      owner_name: plant.owner_name,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to add plant"
    );
  }

  return response.json();
}


// =================================
// DELETE PLANT
// =================================

export async function deletePlant(id, ownerName) {
  const response = await fetch(
    `${API_URL}/plants/${id}?owner_name=${encodeURIComponent(ownerName)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to delete plant"
    );
  }

  return response.json();
}


// =================================
// CREATE PLANT CHECK
// =================================
// Symptoms + date mattum database-la save pannrom.
// Image-ai indha endpoint-la save panna maattom.

export async function createPlantCheck(checkData) {
  const formData = new FormData();

  formData.append(
    "plant_id",
    String(checkData.plant_id)
  );

  formData.append(
    "symptoms",
    checkData.symptoms
  );

  formData.append(
    "check_date",
    checkData.check_date
  );

  const response = await fetch(
    `${API_URL}/plant-checks/`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail || "Failed to create plant check"
    );
  }

  return response.json();
}


// =================================
// ANALYZE PLANT CHECK WITH AI
// =================================
// Selected image-ai analysis request-la mattum send pannrom.
// Image database-la save panna maattom.

export async function analyzePlantCheck(
  checkId,
  imageFile = null
) {
  const formData = new FormData();

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(
    `${API_URL}/plant-checks/${checkId}/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    const detail = errorData.detail;

    throw new Error(
      typeof detail === "string"
        ? detail
        : "Failed to analyze plant"
    );
  }

  return response.json();
}


// =================================
// GET PLANT CHECK HISTORY
// =================================

export async function getPlantChecks(plantId) {
  const response = await fetch(
    `${API_URL}/plant-checks/plant/${plantId}`
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Backend error:", errorData);

    throw new Error(
      errorData.detail ||
      "Failed to load plant check history"
    );
  }

  return response.json();
}
