function Navbar({
  page,
  setPage,
  user,
  onLogout
}) {

  return (
    <nav className="navbar">

      {/* ================================
          LOGO
          Logo click panna Home page-ku pogum
      ================================= */}

      <div
        className="logo"
        onClick={() => setPage("home")}
      >
        🌱 PlantCare AI
      </div>


      {/* ================================
          NAVIGATION
      ================================= */}

      <div className="nav-links">

        {/* Home */}

        <button
          className={
            page === "home"
              ? "active"
              : ""
          }
          onClick={() => setPage("home")}
        >
          Home
        </button>


        {/* Login pannala na */}
        {!user && (

          <>

            <button
              className={
                page === "login"
                  ? "active"
                  : ""
              }
              onClick={() => setPage("login")}
            >
              Login
            </button>


            <button
              className="register-nav-btn"
              onClick={() => setPage("register")}
            >
              Register
            </button>

          </>

        )}


        {/* Login panniruntha */}
        {user && (

          <>

            <button
              className={
                page === "plants"
                  ? "active"
                  : ""
              }
              onClick={() => setPage("plants")}
            >
              My Plants
            </button>


            <button
              className={
                page === "plant-check"
                  ? "active"
                  : ""
              }
              onClick={() => setPage("plant-check")}
            >
              Plant Check
            </button>


            <button
              className="logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>
  );
}


export default Navbar;