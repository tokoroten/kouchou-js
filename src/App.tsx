import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css' // Import Tailwind CSS
import { useAppStore } from './store' // Import the Zustand store

function App() {
  // Use Zustand store instead of local state
  const count = useAppStore((state) => state.count)
  const increment = useAppStore((state) => state.increment)
  const decrement = useAppStore((state) => state.decrement) // Added decrement for completeness

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {/* Example of using Tailwind CSS classes */}
      <h1 className="text-3xl font-bold underline text-red-500">
        Vite + React with Tailwind
      </h1>
      <div className="card">
        {/* Update button to use Zustand actions */}
        <button
          onClick={increment}
          className="m-2 rounded bg-blue-500 p-2 text-white"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="m-2 rounded bg-red-500 p-2 text-white"
        >
          Decrement
        </button>
        <p className="text-xl">count is {count}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
