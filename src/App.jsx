import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import FlashcardArtikel from "./Components/FlashcardArtikel";

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

  return <FlashcardArtikel words={words} />;
}

export default App;

