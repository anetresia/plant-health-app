import { useState } from "react";

import { verifyPerson } from "../services/api";


function Login({ setPage, onLogin }) {

  // User enter panna name-a store panna state
  const [name, setName] = useState("");

  // User enter panna email-a store panna state
  const [email, setEmail] = useState("");

  // Backend request loading-la irukka-nu track panna
  const [loading, setLoading] = useState(false);

  // Login error message store panna
  const [error, setError] = useState("");


  // Login form submit aagumbothu
  // intha function execute aagum
  async function handleSubmit(e) {

    // Browser default form refresh-a stop pannrom
    e.preventDefault();

    // Previous error message clear pannrom
    setError("");


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

      // Backend request start
      setLoading(true);


      // api.js-la irukkura verifyPerson()
      // function-a call pannrom
      //
      // Name + email backend-ku send aagum
      const data = await verifyPerson(
        name,
        email
      );


      // Backend-la person found aana
      // App component-ku user information send pannrom
      onLogin(data);


    } catch (error) {

      // Backend error vandha
      // error message display pannrom
      console.error(error);

      setError(
        error.message ||
        "Login failed. Please check your details."
      );


    } finally {

      // Request complete aana loading stop pannrom
      setLoading(false);

    }
  }


  return (

    <div className="auth-page">

      {/* =================================
          LOGIN CARD
      ================================== */}

      <div className="auth-card">


        {/* Login icon */}
        <div className="auth-icon">
          🔐
        </div>


        {/* Page heading */}
        <h1>
          Welcome Back
        </h1>


        {/* Small description */}
        <p>
          Login to manage your plants and
          check their health.
        </p>


        {/* =================================
            ERROR MESSAGE

            Login fail aana mattum
            intha message display aagum.
        ================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =================================
            LOGIN FORM
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
              LOGIN BUTTON

              Backend request nadakkumbothu
              button disable aagum.
          ================================== */}

          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =================================
            REGISTER LINK

            Account illana Register page-ku
            navigate panna use pannrom.
        ================================== */}

        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() => setPage("register")}
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
}


export default Login;