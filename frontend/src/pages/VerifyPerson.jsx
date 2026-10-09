import { useState } from "react";

// Backend API functions-a import pannrom.
// createPerson use panni person-a register pannalaam.
// verifyPerson use panni person details-a verify pannalaam.
import {
  createPerson,
  verifyPerson
} from "../services/api";


function VerifyPerson() {

  // User enter panra name-a store pannrom.
  const [name, setName] = useState("");

  // User enter panra email-a store pannrom.
  const [email, setEmail] = useState("");

  // Success illa error message-a display panna use pannrom.
  const [message, setMessage] = useState("");

  // Operation success aachaa illaiyaa-nu track pannrom.
  // true na success message; false na error message.
  const [success, setSuccess] = useState(false);

  // API request process-la irukkumbodhu loading state-a track pannrom.
  const [loading, setLoading] = useState(false);


  // =================================
  // REGISTER PERSON
  // =================================
  // Create Person button click pannumbodhu
  // indha function execute aagum.

  async function handleRegister(e) {

    // Form submit aagumbodhu page refresh aaguradha stop pannrom.
    e.preventDefault();

    // Name and email rendu fields-um fill pannirukkaangalaa-nu check pannrom.
    if (!name || !email) {

      // Required details missing na success-a false pannrom.
      setSuccess(false);

      // User-ku error message display pannrom.
      setMessage(
        "Please enter your name and email."
      );

      return;
    }


    try {

      // API request start aagumbodhu loading-a true pannrom.
      setLoading(true);

      // Previous message irundha adha clear pannrom.
      setMessage("");


      // User enter panna name and email-a
      // backend API-ku send panni person-a create pannrom.
      await createPerson(
        name,
        email
      );


      // Person successfully register aana success-a true pannrom.
      setSuccess(true);

      // Registration success message display pannrom.
      setMessage(
        "Person registered successfully."
      );


    } catch (error) {

      // Error vandha developer debugging-ku console-la display pannrom.
      console.error(error);

      // Registration fail aana success-a false pannrom.
      setSuccess(false);

      // Backend error message irundha adha display pannrom.
      // Illaina default registration error message display aagum.
      setMessage(
        error.message || "Registration failed."
      );

    } finally {

      // Request success aanaalum fail aanaalum loading-a stop pannrom.
      setLoading(false);

    }
  }


  // =================================
  // VERIFY PERSON
  // =================================
  // Verify Person button click pannumbodhu
  // indha function execute aagum.

  async function handleVerify(e) {

    // Form submit aagumbodhu page refresh aaguradha stop pannrom.
    e.preventDefault();

    // Name and email enter pannirukkaangalaa-nu check pannrom.
    if (!name || !email) {

      // Required details missing na success-a false pannrom.
      setSuccess(false);

      // User-ku required fields message display pannrom.
      setMessage(
        "Please enter your name and email."
      );

      return;
    }


    try {

      // Verification process start aagumbodhu loading-a true pannrom.
      setLoading(true);

      // Previous message-a clear pannrom.
      setMessage("");


      // Enter panna name and email-a backend-ku send pannrom.
      // Backend-la matching person irundha details return aagum.
      const data = await verifyPerson(
        name,
        email
      );


      // Verification successful aana success-a true pannrom.
      setSuccess(true);

      // Backend-la irundhu return aana name-a use panni
      // welcome message display pannrom.
      setMessage(
        `Welcome ${data.name}! Your identity has been verified successfully.`
      );


    } catch (error) {

      // Verification error-a developer console-la display pannrom.
      console.error(error);

      // Verification fail aana success-a false pannrom.
      setSuccess(false);

      // Backend error message irundha adha display pannrom.
      // Illaina default verification error message display aagum.
      setMessage(
        error.message ||
        "Verification failed. Please check your name and email."
      );

    } finally {

      // Verification mudinja piragu loading-a stop pannrom.
      setLoading(false);

    }
  }


  // =================================
  // USER INTERFACE
  // =================================
  // Register and Verify forms-a browser-la display pannrom.

  return (

    <div className="page">

      {/* Page heading and introduction */}

      <div className="hero-small">

        {/* Lock emoji verification-a represent pannudhu. */}
        <span>🔐</span>

        <h1>
          Person Verification
        </h1>

        {/* Page enna purpose-ku use aagudhu-nu explain pannrom. */}
        <p>
          Register and verify your identity using your name and email.
        </p>

      </div>


      {/* Person details enter panna form card */}

      <div className="form-card">

        <h2>
          Person Details
        </h2>

        <p className="card-description">
          Enter your name and email to continue.
        </p>


        {/* Name and email fields-a group pannrom. */}

        <form>

          {/* Full name label */}

          <label>
            Full Name
          </label>

          {/* User name type pannumbodhu state update aagum. */}

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          {/* Email label */}

          <label>
            Email Address
          </label>

          {/* Email input field.
              type="email" use pannradhu email format-ku suitable input kodukkum. */}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          {/* CREATE PERSON BUTTON */}
          {/* Click pannina handleRegister function call aagum. */}

          <button
            className="primary-btn"
            type="button"
            onClick={handleRegister}
            disabled={loading}
          >

            {/* Loading irundha processing text display aagum.
                Illaina Create Person button text display aagum. */}

            {loading
              ? "🔄 Processing..."
              : "Create Person"
            }

          </button>


          {/* VERIFY PERSON BUTTON */}
          {/* Click pannina handleVerify function call aagum. */}

          <button
            className="secondary-btn"
            type="button"
            onClick={handleVerify}
            disabled={loading}
          >

            🔐 Verify Person

          </button>

        </form>


        {/* SUCCESS / ERROR MESSAGE */}
        {/* Message empty-aa illama irundha mattum indha section display aagum. */}

        {message && (

          <div
            className={
              // Success true na success-message CSS class use pannrom.
              // Illaina error-message CSS class use pannrom.
              success
                ? "success-message"
                : "error-message"
            }
          >

            {/* Success-ku tick emoji; error-ku cross emoji display pannrom. */}

            {success ? "✅ " : "❌ "}

            {/* Register illa verify operation-la irundhu varra message. */}

            {message}

          </div>

        )}

      </div>

    </div>

  );
}


// VerifyPerson component-a vera files-la use panna export pannrom.
export default VerifyPerson;