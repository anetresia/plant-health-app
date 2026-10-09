const API_URL = "http://127.0.0.1:8000";


// =================================
// PERSON
// =================================


// =================================
// CREATE PERSON
// =================================
// Register page-la user enter panna
// name + email backend-ku send pannrom.
// Backend:
// POST /persons/
export async function createPerson(
  name,
  email
) {

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


  // Backend error vandha
  // error message eduthu throw pannrom.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to create person"
    );
  }


  // Successful response return pannrom.
  return response.json();
}



// =================================
// VERIFY PERSON
// =================================
// Login page-la user enter panna
// name + email backend-la verify pannrom.
// Backend:
// GET /persons/verify
export async function verifyPerson(
  name,
  email
) {

  const response = await fetch(
    `${API_URL}/persons/verify?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
  );


  // User database-la illa na
  // backend error return pannum.
  if (!response.ok) {

    const errorData =
      await response.json();

    throw new Error(
      errorData.detail ||
      "Person not found"
    );
  }


  // User information return pannrom.
  return response.json();
}



// =================================
// PLANTS
// =================================


// =================================
// GET PLANTS
// =================================
// search:
// User search panna plant name.
// ownerName:
// Currently login pannirukkura
// user's name.
// Example:
// ownerName = "Resia"
// search = "Tomato"
// Backend rendu condition-um check pannum:
// owner_name = Resia
// AND
// plant name contains Tomato
// So Resia-oda Tomato plants mattum varum.
export async function getPlants(
  search = "",
  ownerName = ""
) {

  const response = await fetch(
    `${API_URL}/plants/?search=${encodeURIComponent(search)}&owner_name=${encodeURIComponent(ownerName)}`
  );


  // Backend error check.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to load plants"
    );
  }


  // Plants array return pannrom.
  return response.json();
}



// =================================
// ADD PLANT
// =================================
// MyPlants page-la user add panna
// plant details backend-ku send pannrom.
// owner_name:
// Login pannirukkura user's name.
// User owner name manually enter
// panna vendiya avasiyam illa.
export async function addPlant(
  plant
) {

  const response = await fetch(
    `${API_URL}/plants/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        name: plant.name,

        plant_type:
          plant.plant_type,

        location:
          plant.location || null,

        owner_name:
          plant.owner_name

      })
    }
  );


  // Backend error check.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to add plant"
    );
  }


  // Newly created plant return pannrom.
  return response.json();
}



// =================================
// DELETE PLANT
// =================================
// id:
// Delete panna pora plant ID.
// ownerName:
// Currently login pannirukkura
// user's name.
// Backend rendu information-um
// verify pannum.
// Same owner:
// Delete ✅
// Different owner:
// Delete ❌
export async function deletePlant(
  id,
  ownerName
) {

  const response = await fetch(
    `${API_URL}/plants/${id}?owner_name=${encodeURIComponent(ownerName)}`,
    {
      method: "DELETE"
    }
  );


  // Delete fail aana
  // backend error message edukkrom.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to delete plant"
    );
  }


  // Delete success response.
  return response.json();
}



// =================================
// PLANT CHECK
// =================================


// =================================
// CREATE PLANT CHECK
// =================================
// User symptoms + date save pannumbothu
// backend-ku request send pannrom.
// Backend:
// POST /plant-checks/
export async function createPlantCheck(
  checkData
) {

  const response = await fetch(
    `${API_URL}/plant-checks/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        // Selected plant ID
        plant_id:
          checkData.plant_id,

        // User enter panna symptoms
        symptoms:
          checkData.symptoms,

        // Check date
        check_date:
          checkData.check_date

      })
    }
  );


  // Backend error check.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to create plant check"
    );
  }


  // Saved check return pannrom.
  return response.json();
}



// =================================
// ANALYSE PLANT CHECK WITH AI
// =================================
// Current check ID backend-ku send pannrom.
// Backend:
// Plant Check
//      ↓
// Gemini AI
//      ↓
// AI result

export async function analyzePlantCheck(
  checkId
) {

  const response = await fetch(
    `${API_URL}/plant-checks/${checkId}/analyze`,
    {
      method: "POST"
    }
  );


  // AI request fail aana
  // backend error message show pannrom.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to analyze plant"
    );
  }


  // AI result-oda updated
  // plant check return pannrom.
  return response.json();
}



// =================================
// GET PLANT CHECK HISTORY
// =================================
// Specific plant-oda previous
// health checks mattum fetch pannrom.
// Example:
// plantId = 5
// Backend:
// GET /plant-checks/plant/5
export async function getPlantChecks(
  plantId
) {

  const response = await fetch(
    `${API_URL}/plant-checks/plant/${plantId}`
  );


  // Backend error check.
  if (!response.ok) {

    const errorData =
      await response.json();

    console.error(
      "Backend error:",
      errorData
    );

    throw new Error(
      errorData.detail ||
      "Failed to load plant check history"
    );
  }


  // Previous checks return pannrom.
  return response.json();
}