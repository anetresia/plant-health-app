import { useState } from "react";

import Navbar from "./components/Navbar";

import VerifyPerson from "./pages/VerifyPerson";
import MyPlants from "./pages/MyPlants";
import PlantAnalysis from "./pages/PlantAnalysis";

import "./index.css";


function App() {

  const [page, setPage] = useState("plants");

  return (
    <>

      <Navbar setPage={setPage} />

      <main>

        {page === "verify" && (
          <VerifyPerson />
        )}

        {page === "plants" && (
          <MyPlants />
        )}

        {page === "analysis" && (
          <PlantAnalysis />
        )}

      </main>

    </>
  );
}

export default App;