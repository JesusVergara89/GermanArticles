import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('vocabulario') // 👈 tu tabla real
        .select('*')

      if (error) {
        console.error('Error:', error)
      } else {
        console.log('Datos:', data)
      }
    }

    fetchData()
  }, [])

  return <h1>Supabase conectado 🚀</h1>
}

export default App