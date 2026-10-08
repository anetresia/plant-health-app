import { useState } from "react";

function PlantAnalysis() {

  const [loading, setLoading] = useState(false);

  function handleAnalyze(e) {

    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("AI API will be connected here.");
    }, 1000);
  }

  return (
    <div className="page">

      <div className="hero">

        <div className="hero-icon">
          🌱
        </div>

        <h1>
          AI Plant Health Analysis
        </h1>

        <p>
          Describe your plant and its symptoms
          to understand possible health issues.
        </p>

      </div>


      <div className="form-card">

        <form onSubmit={handleAnalyze}>

          <label>Plant Name</label>

          <input
            type="text"
            placeholder="Example: Tomato"
            required
          />


          <label>Plant Type</label>

          <input
            type="text"
            placeholder="Example: Vegetable"
            required
          />


          <label>Location <span>(Optional)</span></label>

          <input
            type="text"
            placeholder="Example: Jaffna"
          />


          <label>Symptoms</label>

          <textarea
            rows="5"
            placeholder="Example: Lower leaves are turning yellow and curling..."
            required
          />


          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "🔄 Analyzing..."
              : "🔍 Analyze Plant"
            }
          </button>

        </form>

      </div>

    </div>
  );
}

export default PlantAnalysis;