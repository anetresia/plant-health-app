import { useEffect, useState } from "react";

import {
  getPlants,
  createPlantCheck,
  analyzePlantCheck,
  getPlantChecks
} from "../services/api";


function PlantCheck({ selectedPlantId }) {

  // =================================
  // PLANTS
  // =================================

  // Backend-la irundhu varra plants list
  // inga store pannrom.
  const [plants, setPlants] = useState([]);


  // =================================
  // SELECTED PLANT
  // =================================

  // User currently check panna pora
  // plant ID-a store pannrom.
  const [selectedId, setSelectedId] = useState(
    selectedPlantId || ""
  );


  // User enter panna symptoms
  const [symptoms, setSymptoms] = useState("");


  // Plant check date
  const [checkDate, setCheckDate] = useState("");


  // Ippo create panna check details
  const [currentCheck, setCurrentCheck] = useState(null);


  // Selected plant-oda previous
  // check history inga store pannrom.
  const [history, setHistory] = useState([]);


  // Save request loading status
  const [loading, setLoading] = useState(false);


  // AI analysis loading status
  const [analyzing, setAnalyzing] = useState(false);


  // Error message
  const [error, setError] = useState("");


  // Success message
  const [message, setMessage] = useState("");


  // =================================
  // LOAD PLANTS
  // =================================

  useEffect(() => {

    async function loadPlants() {

      try {

        // Backend-la irundhu saved plants
        // fetch pannrom.
        const data = await getPlants();

        setPlants(data);

      } catch (error) {

        console.error(error);

        setError(
          error.message ||
          "Failed to load plants"
        );

      }
    }


    loadPlants();

  }, []);


  // =================================
  // UPDATE SELECTED PLANT
  // =================================

  useEffect(() => {

    // MyPlants-la irundhu selected plant ID
    // vandha, atha inga set pannrom.
    if (selectedPlantId) {

      setSelectedId(
        String(selectedPlantId)
      );

    }

  }, [selectedPlantId]);


  // =================================
  // LOAD PLANT HISTORY
  // =================================

  useEffect(() => {

    async function loadHistory() {

      // Plant select pannala na
      // history load panna vendam.
      if (!selectedId) {

        setHistory([]);

        return;
      }


      try {

        setError("");

        // Selected plant-oda ID use panni
        // previous checks fetch pannrom.
        const data = await getPlantChecks(
          selectedId
        );

        setHistory(data);

      } catch (error) {

        console.error(error);

        setError(
          error.message ||
          "Failed to load check history"
        );

      }
    }


    loadHistory();

  }, [selectedId]);


  // =================================
  // PLANT CHANGE
  // =================================

  function handlePlantChange(e) {

    // Dropdown-la user select panna
    // plant ID edukkrom.
    const plantId = e.target.value;


    // Selected plant update pannrom.
    setSelectedId(plantId);


    // Previous current check clear pannrom.
    setCurrentCheck(null);


    // Messages clear pannrom.
    setMessage("");

    setError("");

  }


  // =================================
  // SAVE PLANT CHECK
  // =================================

  async function handleSubmit(e) {

    // Browser form refresh stop pannrom.
    e.preventDefault();


    // Old messages clear pannrom.
    setError("");

    setMessage("");

    setCurrentCheck(null);


    // Plant select pannala na
    // error show pannrom.
    if (!selectedId) {

      setError(
        "Please select a plant."
      );

      return;
    }


    // Symptoms empty-aa irukka koodathu.
    if (!symptoms.trim()) {

      setError(
        "Please enter the plant symptoms."
      );

      return;
    }


    // Date select pannirukkanum.
    if (!checkDate) {

      setError(
        "Please select the check date."
      );

      return;
    }


    try {

      // Save request start.
      setLoading(true);


      // Plant check details backend-ku
      // send pannrom.
      const data = await createPlantCheck({

        plant_id: Number(selectedId),

        symptoms: symptoms,

        check_date: checkDate

      });


      // Newly created check-a
      // current check-aa store pannrom.
      setCurrentCheck(data);


      // Success message.
      setMessage(
        "Plant check saved successfully."
      );


      // Form clear pannrom.
      setSymptoms("");

      setCheckDate("");


      // Save panna apram latest
      // history fetch pannrom.
      const updatedHistory =
        await getPlantChecks(selectedId);


      setHistory(updatedHistory);

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Failed to save plant check"
      );

    } finally {

      // Loading stop.
      setLoading(false);

    }
  }


  // =================================
  // ANALYSE WITH AI
  // =================================

  async function handleAnalyze() {

    // Current check illana
    // AI analysis panna mudiyathu.
    if (!currentCheck) {

      return;
    }


    try {

      // AI loading start.
      setAnalyzing(true);

      setError("");

      setMessage("");


      // Backend-ku check ID send pannrom.
      //
      // Backend:
      // PlantCheck → Gemini AI
      const data = await analyzePlantCheck(
        currentCheck.id
      );


      // AI result-oda updated check
      // current check-aa save pannrom.
      setCurrentCheck(data);


      // Success message.
      setMessage(
        "Plant analysis completed successfully."
      );


      // Latest history fetch pannrom.
      const updatedHistory =
        await getPlantChecks(selectedId);


      setHistory(updatedHistory);

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Failed to analyze plant"
      );

    } finally {

      // AI loading stop.
      setAnalyzing(false);

    }
  }


  // =================================
  // FIND SELECTED PLANT
  // =================================

  // Selected ID use panni
  // actual plant object-a find pannrom.
  const selectedPlant = plants.find(
    (plant) =>
      plant.id === Number(selectedId)
  );


  return (

    <div className="page">


      {/* =================================
          PAGE HEADER
      ================================== */}

      <div className="hero">

        <div className="hero-icon">
          🌱
        </div>

        <h1>
          Plant Health Check
        </h1>

        <p>
          Check your plant's symptoms and
          review its previous health information.
        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* SUCCESS */}

      {message && (

        <div className="success-message">
          {message}
        </div>

      )}


      {/* =================================
          SELECTED PLANT INFORMATION
      ================================== */}

      {selectedPlant && (

        <div className="form-card">

          <h2>
            🌿 {selectedPlant.name}
          </h2>

          <p>
            <strong>Type:</strong>{" "}
            {selectedPlant.plant_type}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {selectedPlant.location ||
              "Not specified"}
          </p>

          <p>
            <strong>Owner:</strong>{" "}
            {selectedPlant.owner_name}
          </p>

        </div>

      )}


      {/* =================================
          PLANT CHECK FORM
      ================================== */}

      <div className="form-card">

        <h2>
          New Health Check
        </h2>

        <p className="card-description">
          Describe what you notice about
          your plant.
        </p>


        <form onSubmit={handleSubmit}>


          {/* PLANT SELECT */}

          <label>
            Select Plant
          </label>

          <select
            value={selectedId}
            onChange={handlePlantChange}
            required
          >

            <option value="">
              -- Select a plant --
            </option>


            {plants.map((plant) => (

              <option
                key={plant.id}
                value={plant.id}
              >

                {plant.name} - {plant.plant_type}

              </option>

            ))}

          </select>


          {/* =================================
              SYMPTOMS / QUESTION
          ================================== */}

          <label>
            What problem are you noticing?
          </label>

          <textarea
            rows="5"
            value={symptoms}
            onChange={(e) =>
              setSymptoms(e.target.value)
            }
            placeholder="Example: The lower leaves are turning yellow and curling..."
            required
          />


          {/* CHECK DATE */}

          <label>
            Check Date
          </label>

          <input
            type="date"
            value={checkDate}
            onChange={(e) =>
              setCheckDate(e.target.value)
            }
            required
          />


          {/* SAVE CHECK */}

          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save Plant Check"}

          </button>

        </form>

      </div>


      {/* =================================
          CURRENT CHECK
      ================================== */}

      {currentCheck && (

        <div className="form-card">

          <h2>
            Latest Health Check
          </h2>


          <p>
            <strong>Problem:</strong>
          </p>

          <p>
            {currentCheck.symptoms}
          </p>


          <p>
            <strong>Check Date:</strong>{" "}
            {currentCheck.check_date}
          </p>


          {/* =================================
              ANALYSE BUTTON
              AI result illana mattum button display aagum.
          ================================== */}

          {!currentCheck.ai_result && (

            <button
              className="primary-btn"
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
            >

              {analyzing
                ? "Analysing..."
                : "Analyse with AI"}

            </button>

          )}


          {/* =================================
              AI RESULT
          ================================== */}

          {currentCheck.ai_result && (

            <div className="ai-result">

              <h2>
                🤖 AI Analysis Result
              </h2>

              <p>
                {currentCheck.ai_result}
              </p>

            </div>

          )}

        </div>

      )}


      {/* =================================
          PREVIOUS HISTORY
      ================================== */}

      {selectedId && (

        <div className="form-card">

          <h2>
            Previous Health Checks
          </h2>


          {history.length === 0 ? (

            <p>
              No previous checks found for
              this plant.
            </p>

          ) : (

            history.map((check) => (

              <div
                className="history-card"
                key={check.id}
              >

                <h3>
                  Check #{check.id}
                </h3>


                <p>
                  <strong>Date:</strong>{" "}
                  {check.check_date}
                </p>


                {/* User previous question /
                    symptom */}

                <p>
                  <strong>
                    Problem noticed:
                  </strong>
                </p>

                <p>
                  {check.symptoms}
                </p>


                {/* Previous AI result */}

                {check.ai_result && (

                  <div className="ai-result">

                    <h4>
                      🤖 AI Result
                    </h4>

                    <p>
                      {check.ai_result}
                    </p>

                  </div>

                )}

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}


export default PlantCheck;