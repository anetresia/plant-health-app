import { useState } from "react";

import { createPerson } from "../services/api";


function Register({ setPage }) {

  // User enter panna name-a store panna state
  const [name, setName] = useState("");

  // User enter panna email-a store panna state
  const [email, setEmail] = useState("");

  // Backend request loading-la irukka-nu track panna
  const [loading, setLoading] = useState(false);

  // Error message display panna
  const [error, setError] = useState("");

  // Success message display panna
  const [message, setMessage] = useState("");


  // Register form submit aagumbothu
  // intha function execute aagum
  async function handleSubmit(e) {

    // Browser default form refresh-a stop pannrom
    e.preventDefault();

    // Previous error / success message clear pannrom
    setError("");
    setMessage("");


    // Name empty-aa iruntha error show pannrom
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }


    // Email empty-aa iruntha error show pannrom
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }


    try {

      // Backend request start aaguthu
      setLoading(true);


      // api.js-la irukkura createPerson()
      // function-a call pannrom
      //
      // name + email backend-ku send aagum
      const data = await createPerson(
        name,
        email
      );


      // Backend success response vandha
      // success message display pannrom
      setMessage(
        `Registration successful. Welcome ${data.name}!`
      );


      // Input fields-a clear pannrom
      setName("");
      setEmail("");


      // Konjam delay-ku apram Login page-ku pogum
      setTimeout(() => {

        setPage("login");

      }, 1200);


    } catch (error) {

      // Backend-la error vandha
      // error message display pannrom
      console.error(error);

      setError(
        error.message ||
        "Registration failed. Please try again."
      );


    } finally {

      // Request complete aana loading stop pannrom
      setLoading(false);

    }
  }


  return (

    <div className="auth-page">

      {/* =================================
          REGISTER CARD

          User registration form
          inga display pannrom.
      ================================== */}

      <div className="auth-card">


        {/* Register icon */}
        <div className="auth-icon">
          🌱
        </div>


        {/* Page heading */}
        <h1>
          Create Your Account
        </h1>


        {/* Small description */}
        <p>
          Register to start managing your plants
          and checking their health.
        </p>


        {/* =================================
            ERROR MESSAGE

            Backend or validation error
            iruntha mattum display aagum.
        ================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =================================
            SUCCESS MESSAGE

            Registration successful aana
            intha message display aagum.
        ================================== */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {/* =================================
            REGISTER FORM

            User name + email enter pannuvaanga.
        ================================== */}

        <form onSubmit={handleSubmit}>


          {/* Name input */}

          <label>
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your name"
            required
          />


          {/* Email input */}

          <label>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
          />


          {/* =================================
              REGISTER BUTTON

              Loading iruntha button text
              "Registering..." nu maarum.
          ================================== */}

          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Create Account"}
          </button>

        </form>


        {/* =================================
            LOGIN LINK

            Already account iruntha
            Login page-ku pogalaam.
        ================================== */}

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => setPage("login")}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}


export default Register;