import { useState } from "react";

import {
  createPerson,
  verifyPerson
} from "../services/api";


function VerifyPerson() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);


  async function handleRegister(e) {

    e.preventDefault();

    if (!name || !email) {

      setSuccess(false);

      setMessage(
        "Please enter your name and email."
      );

      return;
    }


    try {

      setLoading(true);

      setMessage("");


      await createPerson(
        name,
        email
      );


      setSuccess(true);

      setMessage(
        "Person registered successfully."
      );


    } catch (error) {

      console.error(error);

      setSuccess(false);

      setMessage(
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }
  }


  async function handleVerify(e) {

    e.preventDefault();

    if (!name || !email) {

      setSuccess(false);

      setMessage(
        "Please enter your name and email."
      );

      return;
    }


    try {

      setLoading(true);

      setMessage("");


      const data = await verifyPerson(
        name,
        email
      );


      setSuccess(true);

      setMessage(
        `Welcome ${data.person.name}! Your identity has been verified successfully.`
      );


    } catch (error) {

      console.error(error);

      setSuccess(false);

      setMessage(
        "Verification failed. Please check your name and email."
      );

    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="page">


      <div className="hero-small">

        <span>🔐</span>

        <h1>
          Person Verification
        </h1>

        <p>
          Register and verify your identity using your name and email.
        </p>

      </div>


      <div className="form-card">

        <h2>
          Person Details
        </h2>

        <p className="card-description">
          Enter your name and email to continue.
        </p>


        <form>


          <label>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          <label>
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <button
            className="primary-btn"
            type="button"
            onClick={handleRegister}
            disabled={loading}
          >

            {loading
              ? "🔄 Processing..."
              : "Create Person"
            }

          </button>


          <button
            className="secondary-btn"
            type="button"
            onClick={handleVerify}
            disabled={loading}
          >

            🔐 Verify Person

          </button>

        </form>


        {message && (

          <div
            className={
              success
                ? "success-message"
                : "error-message"
            }
          >

            {success ? "✅ " : "❌ "}

            {message}

          </div>

        )}

      </div>

    </div>

  );
}


export default VerifyPerson;