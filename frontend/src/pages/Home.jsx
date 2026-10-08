function Home({ setPage }) {

  return (
    <div className="home-page">


      {/* =================================
          HERO SECTION

          User application open pannumbothu
          first-aa paakura main section.
      ================================== */}

      <section className="home-hero">


        {/* =================================
            HERO TEXT

            Application enna purpose-ku
            use aaguthu-nu explain pannrom.
        ================================== */}

        <div className="hero-content">

          {/* Small badge */}
          <span className="hero-badge">
            🌿 AI-Powered Plant Care
          </span>


          {/* Main heading */}
          <h1>
            Understand Your Plant.
            <br />
            <span>Care For It Better.</span>
          </h1>


          {/* Short description */}
          <p>
            Get simple AI-powered insights about
            your plant's health and learn how to
            care for it better.
          </p>


          {/* =================================
              HERO BUTTONS

              Login/Register pages-ku
              navigate panna use pannrom.
          ================================== */}

          <div className="hero-buttons">

            {/* Login button */}

            <button
              className="primary-btn"
              onClick={() => setPage("login")}
            >
              Check Your Plant
            </button>


            {/* Register button */}

            <button
              className="secondary-btn"
              onClick={() => setPage("register")}
            >
              Get Started
            </button>

          </div>

        </div>


        {/* =================================
            HERO VISUAL

            Actual image use pannama simple
            CSS + emoji visual create pannrom.
        ================================== */}

        <div className="hero-visual">

          {/* Main plant circle */}
          <div className="plant-circle">
            🌿
          </div>


          {/* Floating information cards */}

          <div className="floating-card card-one">
            🌱 Healthy Growth
          </div>

          <div className="floating-card card-two">
            🔍 AI Analysis
          </div>

          <div className="floating-card card-three">
            💚 Better Care
          </div>

        </div>

      </section>



      {/* =================================
          FEATURES SECTION

          Application-la user-ku available
          irukkura main features-a explain pannrom.
      ================================== */}

      <section className="features-section">

        <div className="section-heading">

          <span>
            WHY PLANTCARE AI?
          </span>

          <h2>
            Simple Tools for Better Plant Care
          </h2>

          <p>
            Manage your plants, describe their symptoms,
            and get simple AI-powered care suggestions.
          </p>

        </div>


        {/* Feature cards */}

        <div className="feature-grid">


          {/* Feature 1 */}

          <div className="feature-card">

            <div className="feature-icon">
              🌱
            </div>

            <h3>
              Manage Your Plants
            </h3>

            <p>
              Save your plants with their name,
              type, and location so you can
              manage them easily.
            </p>

          </div>


          {/* Feature 2 */}

          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>
              AI Health Analysis
            </h3>

            <p>
              Describe the symptoms you notice
              and receive simple AI-generated
              plant health information.
            </p>

          </div>


          {/* Feature 3 */}

          <div className="feature-card">

            <div className="feature-icon">
              📋
            </div>

            <h3>
              Check History
            </h3>

            <p>
              Review previous plant checks and
              see the AI results saved for each
              plant.
            </p>

          </div>

        </div>

      </section>



      {/* =================================
          HOW IT WORKS

          Application use panna vendiya
          basic steps-a explain pannrom.
      ================================== */}

      <section className="how-section">

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Four Simple Steps
          </h2>

          <p>
            Start taking better care of your
            plants in just a few steps.
          </p>

        </div>


        <div className="steps-grid">


          {/* Step 1 */}

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <h3>
              Create an Account
            </h3>

            <p>
              Register your name and email
              to start using PlantCare AI.
            </p>

          </div>


          {/* Step 2 */}

          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <h3>
              Add Your Plant
            </h3>

            <p>
              Save your plant details so you
              can check its health later.
            </p>

          </div>


          {/* Step 3 */}

          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <h3>
              Describe Symptoms
            </h3>

            <p>
              Tell us what you notice about
              your plant.
            </p>

          </div>


          {/* Step 4 */}

          <div className="step-card">

            <div className="step-number">
              04
            </div>

            <h3>
              Get AI Insights
            </h3>

            <p>
              Receive simple care suggestions
              based on the symptoms.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


export default Home;