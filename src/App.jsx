import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { supabase } from "./Lib/supabaseClient";
import FlashcardArtikel from "./Components/FlashcardArtikel";
import BuyMeCoffee from "./Components/BuyMeCoffee";
import Myself from "./Components/Myself";
import Navbar from "./Components/Navbar";
import ArticulosIndefinidos from "./Components/ArticulosIndefinidos";
import ArticulosDefinidos from "./Components/ArticulosDefinidos";


function Home() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("id, artikel, nomen, palabra_completa, espanol");

      if (error) {
        console.error(error);
        return;
      }

      setWords(data ?? []);
    };

    fetchWords();
  }, []);

  return (
    <div className="app-container">
      <FlashcardArtikel words={words} />

      <BuyMeCoffee />

      <Myself />
    </div>
  );
}

function App() {
  const [dativ, setDativ] = useState([]);

  useEffect(() => {

   const fetchDativ = async () => {
      const { data, error } = await supabase
        .from("dativo")
        .select("id, artikel, nomen, palabra_completa, espanol");

      if (error) {
        console.error(error);
        return;
      }

      setDativ(data ?? []);
    };

    fetchDativ();
  }, []);
  return (
    <>
      <Navbar />

      <main className="app-content">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/articulos-definidos"
            element={<Home />}
          />

          <Route
            path="/articulos-indefinidos"
            element={<ArticulosIndefinidos dativ={dativ} />}
          />

        </Routes>
      </main>
    </>
  );
}


export default App;