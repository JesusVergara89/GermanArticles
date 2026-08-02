import { useEffect, useState } from "react";
import { supabase } from "./Lib/supabaseClient";
import FlashcardArtikel from "./Components/FlashcardArtikel";
import BuyMeCoffee from "./Components/BuyMeCoffee";

function App() {
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

  console.log(words.length)

 return (
  <div className="app-container">

    <FlashcardArtikel words={words} />

    <BuyMeCoffee />

  </div>
);
  
}

export default App;

