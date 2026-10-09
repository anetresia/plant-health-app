import { useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyPerson from "./pages/VerifyPerson";
import MyPlants from "./pages/MyPlants";
import PlantCheck from "./pages/PlantCheck";

import "./index.css";


function App() {

  // =================================
  // CURRENT PAGE
  // =================================

  // Ippo user entha page-la irukkaaru
  // nu track panna intha state use panrom.
  const [page, setPage] = useState("home");


  // =================================
  // LOGGED-IN USER
  // =================================

  // Login pannina user information
  // localStorage-la irundhu edukkrom.
  const [user, setUser] = useState(
    localStorage.getItem("plantCareUser")
  );


  // =================================
  // SELECTED PLANT
  // =================================

  // My Plants-la user click panna
  // plant-oda ID inga store aagum.
  // Example:
  // Tomato Plant → id = 5
  // selectedPlantId = 5
  const [selectedPlantId, setSelectedPlantId] =
    useState(null);


  // =================================
  // LOGIN
  // =================================

  // Login successful aana
  // intha function call aagum.
  function handleLogin(userData) {

    // Logged-in user information-a
    // browser localStorage-la save pannrom.
    localStorage.setItem(
      "plantCareUser",
      JSON.stringify(userData)
    );


    // React state-kum user data save pannrom.
    setUser(userData);


    // Login success aana
    // direct-aa My Plants page-ku pogum.
    setPage("plants");
  }


  // =================================
  // LOGOUT
  // =================================

  // User logout click pannumbothu
  // intha function execute aagum.
  function handleLogout() {

    // Browser-la save pannirukkura
    // user data remove pannrom.
    localStorage.removeItem(
      "plantCareUser"
    );


    // React state-la irundhum
    // user information remove pannrom.
    setUser(null);


    // Logout aana Home page-ku return.
    setPage("home");


    // Previously selected plant-um clear pannrom.
    setSelectedPlantId(null);
  }


  return (

    <div className="app">


      {/* =================================
          NAVBAR
         Navbar-ku current page, navigation function, logged-in user, logout function pass pannrom.
      ================================== */}

      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />


      {/* =================================
          MAIN CONTENT
          page state based on different pages display pannrom.
      ================================== */}

      <main>

        {/* HOME */}

        {page === "home" && (

          <Home
            setPage={setPage}
          />

        )}


        {/* REGISTER */}

        {page === "register" && (

          <Register
            setPage={setPage}
          />

        )}


        {/* LOGIN */}

        {page === "login" && (

          <Login
            setPage={setPage}
            onLogin={handleLogin}
          />

        )}


        {/* VERIFY PERSON */}

        {page === "verify" && (

          <VerifyPerson />

        )}


        {page === "plants" && (

          <MyPlants
            setPage={setPage}
            setSelectedPlantId={setSelectedPlantId}
          />

        )}

        {page === "plant-check" && (

          <PlantCheck
            selectedPlantId={selectedPlantId}
          />

        )}

      </main>

      <Footer />

    </div>
  );
}


export default App;