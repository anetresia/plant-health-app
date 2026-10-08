function Footer() {

  return (
    <footer className="footer">

      {/* =================================
          FOOTER MAIN CONTENT

          Footer-la 3 information sections
          display panna porom.
      ================================== */}

      <div className="footer-content">


        {/* =================================
            SECTION 1 - BRAND

            Application name and short
            description inga display pannrom.
        ================================== */}

        <div>

          <h3>
            🌱 PlantCare AI
          </h3>

          <p>
            Simple and educational plant health
            analysis for home gardeners.
          </p>

        </div>


        {/* =================================
            SECTION 2 - FEATURES

            Application-la irukkura main
            features-a short-aa show pannrom.
        ================================== */}

        <div>

          <h4>
            Features
          </h4>

          <p>
            Plant Management
          </p>

          <p>
            AI Health Analysis
          </p>

          <p>
            Check History
          </p>

        </div>


        {/* =================================
            SECTION 3 - ABOUT

            AI result pathi small
            information kudukkirom.
        ================================== */}

        <div>

          <h4>
            About
          </h4>

          <p>
            AI-generated results are educational
            and are not guaranteed diagnoses.
          </p>

        </div>

      </div>


      {/* =================================
          FOOTER BOTTOM

          Copyright information
          inga display pannrom.
      ================================== */}

      <div className="footer-bottom">

        <p>
          © 2026 PlantCare AI. All rights reserved.
        </p>

      </div>

    </footer>
  );
}


export default Footer;