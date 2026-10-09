
import { useEffect, useState } from "react";

import {
  getPlants,
  createPlantCheck,
  analyzePlantCheck,
  getPlantChecks,
} from "../services/api";

// ==========================================
// STRUCTURED AI RESULT
// ==========================================

function AIResultDisplay({ result }) {
  if (!result) {
    return null;
  }

  let parsedResult = result;

  // Old JSON string irundhaal parse pannrom.
  if (typeof parsedResult === "string") {
    try {
      parsedResult = JSON.parse(parsedResult);
    } catch {
      return (
        <div className="ai-result">
          <h3>🤖 AI Analysis Result</h3>
          <p>
            This saved result is in an older format.
            Please analyse a new plant check.
          </p>
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
      <h3>🤖 AI Analysis Result</h3>

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
// PLANT CHECK COMPONENT
// ==========================================

function PlantCheck({ selectedPlantId }) {
  // Plants list
  const [plants, setPlants] = useState([]);

  // Selected plant
  const [selectedId, setSelectedId] = useState(
    selectedPlantId ? String(selectedPlantId) : ""
  );

  // Form data
  const [symptoms, setSymptoms] = useState("");
  const [checkDate, setCheckDate] = useState("");

  // Current check and history
  const [currentCheck, setCurrentCheck] = useState(null);
  const [history, setHistory] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Messages
  const [error, setError] = useState("");
  const [symptomsError, setSymptomsError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // VALIDATE PLANT SYMPTOMS
  // ==========================================

  function validateSymptoms(value) {
    const keywords = [
      "yellow", "yellowing", "browning", "brown",
      "spots", "spot", "curl", "curling", "curled",
      "wilting", "wilt", "drooping", "droop",
      "dry", "drying", "holes", "hole", "insects",
      "insect", "pests", "pest", "aphids", "fungus",
      "fungal", "mold", "mildew", "rot", "rotting",
      "black", "white", "powder", "sticky", "stunted",
      "discoloration", "discolored", "dying", "decay",
      "damaged", "damage", "blight", "lesions",
      "burnt", "burning", "leaves", "leaf", "stem",
      "roots", "root", "flowers", "flower", "fruit",
      "growth", "falling", "fallen", "pale", "mushy",
      "cracked", "cracking", "webbing", "infestation",
      "patches", "patch",
    ];

    const cleanedText = value.trim().toLowerCase();

    if (!cleanedText) {
      return "Please enter the plant symptoms.";
    }

    if (cleanedText.length < 5) {
      return (
        "Insufficient information. Please describe " +
        "the symptoms you notice on your plant."
      );
    }

    const words = cleanedText
      .replace(/[^a-zA-Z\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    const hasSymptom = words.some((word) =>
      keywords.includes(word)
    );

    if (!hasSymptom) {
      return (
        "Insufficient information. Please describe actual " +
        "plant symptoms, such as yellow leaves, curling leaves, " +
        "or brown spots."
      );
    }

    return "";
  }

  // ==========================================
  // LOAD PLANTS
  // ==========================================

  useEffect(() => {
    async function loadPlants() {
      try {
        const data = await getPlants();
        setPlants(data);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Failed to load plants."
        );
      }
    }

    loadPlants();
  }, []);

  // ==========================================
  // UPDATE SELECTED PLANT
  // ==========================================

  useEffect(() => {
    if (selectedPlantId) {
      setSelectedId(String(selectedPlantId));
    }
  }, [selectedPlantId]);

  // ==========================================
  // LOAD PLANT HISTORY
  // ==========================================

  useEffect(() => {
    async function loadHistory() {
      if (!selectedId) {
        setHistory([]);
        return;
      }

      try {
        setError("");

        const data = await getPlantChecks(selectedId);
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Failed to load check history."
        );
      }
    }

    loadHistory();
  }, [selectedId]);

  // ==========================================
  // PLANT CHANGE
  // ==========================================

  function handlePlantChange(e) {
    const plantId = e.target.value;

    setSelectedId(plantId);
    setCurrentCheck(null);
    setSymptoms("");
    setCheckDate("");
    setMessage("");
    setError("");
    setSymptomsError("");
  }

  // ==========================================
  // SYMPTOMS CHANGE
  // ==========================================

  function handleSymptomsChange(e) {
    setSymptoms(e.target.value);
    setSymptomsError("");
    setError("");
    setMessage("");
  }

  // ==========================================
  // SAVE PLANT CHECK
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setCurrentCheck(null);
    setSymptomsError("");

    if (!selectedId) {
      setError("Please select a plant.");
      return;
    }

    const validationError = validateSymptoms(symptoms);

    if (validationError) {
      setSymptomsError(validationError);
      return;
    }

    if (!checkDate) {
      setError("Please select the check date.");
      return;
    }

    try {
      setLoading(true);

      const data = await createPlantCheck({
        plant_id: Number(selectedId),
        symptoms: symptoms.trim(),
        check_date: checkDate,
      });

      setCurrentCheck(data);
      setMessage("Plant check saved successfully.");

      setSymptoms("");
      setCheckDate("");

      const updatedHistory = await getPlantChecks(
        selectedId
      );

      setHistory(updatedHistory);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to save plant check."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // ANALYSE WITH AI
  // ==========================================

  async function handleAnalyze() {
    if (!currentCheck) {
      return;
    }

    setError("");
    setSymptomsError("");
    setMessage("");

    const validationError = validateSymptoms(
      currentCheck.symptoms
    );

    if (validationError) {
      setSymptomsError(validationError);
      setError(validationError);
      return;
    }

    try {
      setAnalyzing(true);

      const data = await analyzePlantCheck(
        currentCheck.id
      );

      setCurrentCheck(data);

      setMessage(
        "Plant analysis completed successfully."
      );

      const updatedHistory = await getPlantChecks(
        selectedId
      );

      setHistory(updatedHistory);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to analyze plant."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // ==========================================
  // FIND SELECTED PLANT
  // ==========================================

  const selectedPlant = plants.find(
    (plant) => plant.id === Number(selectedId)
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page">
      {/* PAGE HEADER */}
      <div className="hero">
        <div className="hero-icon">🌱</div>

        <h1>Plant Health Check</h1>

        <p>
          Check your plant's symptoms and review its
          previous health information.
        </p>
      </div>

      {/* GENERAL ERROR */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="success-message" role="status">
          {message}
        </div>
      )}

      {/* SELECTED PLANT INFORMATION */}
      {selectedPlant && (
        <div className="form-card">
          <h2>🌿 {selectedPlant.name}</h2>

          <p>
            <strong>Type:</strong>{" "}
            {selectedPlant.plant_type}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {selectedPlant.location || "Not specified"}
          </p>

          <p>
            <strong>Owner:</strong>{" "}
            {selectedPlant.owner_name}
          </p>
        </div>
      )}

      {/* PLANT CHECK FORM */}
      <div className="form-card">
        <h2>New Health Check</h2>

        <p className="card-description">
          Describe what you notice about your plant.
        </p>

        <form onSubmit={handleSubmit}>
          {/* PLANT SELECT */}
          <label htmlFor="plant-select">
            Select Plant
          </label>

          <select
            id="plant-select"
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

          {/* SYMPTOMS */}
          <label htmlFor="plant-symptoms">
            What problem are you noticing?
          </label>

          <textarea
            id="plant-symptoms"
            rows="5"
            value={symptoms}
            onChange={handleSymptomsChange}
            placeholder="Example: The lower leaves are turning yellow and curling..."
            required
            aria-invalid={Boolean(symptomsError)}
            aria-describedby={
              symptomsError ? "symptoms-error" : undefined
            }
            style={
              symptomsError
                ? { border: "1px solid #dc2626" }
                : undefined
            }
          />

          {symptomsError && (
            <p
              id="symptoms-error"
              role="alert"
              style={{
                color: "#dc2626",
                fontSize: "14px",
                marginTop: "6px",
                marginBottom: "12px",
                lineHeight: "1.5",
              }}
            >
              ⚠️ {symptomsError}
            </p>
          )}

          {/* CHECK DATE */}
          <label htmlFor="check-date">
            Check Date
          </label>

          <input
            id="check-date"
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
            disabled={loading || analyzing}
          >
            {loading ? "Saving..." : "Save Plant Check"}
          </button>
        </form>
      </div>

      {/* CURRENT CHECK */}
      {currentCheck && (
        <div className="form-card">
          <h2>Latest Health Check</h2>

          <p>
            <strong>Problem:</strong>
          </p>

          <p>{currentCheck.symptoms}</p>

          <p>
            <strong>Check Date:</strong>{" "}
            {currentCheck.check_date}
          </p>

          {/* ANALYSE BUTTON */}
          {!currentCheck.ai_result && (
            <button
              className="primary-btn"
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing || loading}
            >
              {analyzing
                ? "Analysing..."
                : "Analyse with AI"}
            </button>
          )}

          {/* STRUCTURED AI RESULT */}
          <AIResultDisplay
            result={currentCheck.ai_result}
          />
        </div>
      )}

      {/* PREVIOUS HISTORY */}
      {selectedId && (
        <div className="form-card">
          <h2>Previous Health Checks</h2>

          {history.length === 0 ? (
            <p>
              No previous checks found for this plant.
            </p>
          ) : (
            history.map((check) => (
              <div
                className="history-card"
                key={check.id}
              >
                <h3>Check #{check.id}</h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {check.check_date}
                </p>

                <p>
                  <strong>Problem noticed:</strong>
                </p>

                <p>{check.symptoms}</p>

                {/* STRUCTURED HISTORY AI RESULT */}
                <AIResultDisplay
                  result={check.ai_result}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PlantCheck;
