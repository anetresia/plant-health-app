
const API_URL = "http://127.0.0.1:8000";

async function readResponse(response) {
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("The server returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : `Request failed (${response.status}).`
    );
  }

  return data;
}

export async function createPerson(name, email) {
  const response = await fetch(`${API_URL}/persons/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  return readResponse(response);
}

export async function verifyPerson(name, email) {
  const query = new URLSearchParams({ name, email });

  const response = await fetch(
    `${API_URL}/persons/verify?${query.toString()}`
  );

  return readResponse(response);
}

export async function getPlants(search = "", ownerName = "") {
  const query = new URLSearchParams({
    search,
    owner_name: ownerName,
  });

  const response = await fetch(
    `${API_URL}/plants/?${query.toString()}`
  );

  return readResponse(response);
}

export async function addPlant(plant) {
  const response = await fetch(`${API_URL}/plants/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: plant.name,
      plant_type: plant.plant_type,
      location: plant.location || null,
      owner_name: plant.owner_name,
    }),
  });

  return readResponse(response);
}

export async function deletePlant(id, ownerName) {
  const query = new URLSearchParams({ owner_name: ownerName });

  const response = await fetch(
    `${API_URL}/plants/${id}?${query.toString()}`,
    { method: "DELETE" }
  );

  return readResponse(response);
}

export async function createPlantCheck(checkData) {
  const formData = new FormData();

  formData.append("plant_id", String(checkData.plant_id));
  formData.append("symptoms", checkData.symptoms);
  formData.append("check_date", checkData.check_date);

  const response = await fetch(`${API_URL}/plant-checks/`, {
    method: "POST",
    body: formData,
  });

  return readResponse(response);
}

export async function analyzePlantCheck(checkId, imageFile = null) {
  const formData = new FormData();

  if (imageFile instanceof File) {
    formData.append("image", imageFile);

    console.log("[API] Image attached:", imageFile.name);
    console.log("[API] Image type:", imageFile.type);
    console.log("[API] Image size:", imageFile.size);
  } else {
    console.log("[API] Text-only analysis; no image selected.");
  }

  console.log("[API] Analyzing check:", checkId);

  const response = await fetch(
    `${API_URL}/plant-checks/${checkId}/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  console.log("[API] HTTP status:", response.status);

  return readResponse(response);
}

export async function getPlantChecks(plantId) {
  const response = await fetch(
    `${API_URL}/plant-checks/plant/${plantId}`
  );

  return readResponse(response);
}
