function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <div className="logo">
        🌱 PlantCare AI
      </div>

      <div className="nav-links">
        <button onClick={() => setPage("verify")}>
          Verify
        </button>

        <button onClick={() => setPage("plants")}>
          My Plants
        </button>

        <button onClick={() => setPage("analysis")}>
          Analyze
        </button>
      </div>
    </nav>
  );
}

export default Navbar;