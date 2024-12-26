import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Data from './pages/Data';
import Report from './pages/Report';
import LLM from './pages/LLM';
import LLMOutput from './pages/LLMOutput';
import AdminPage from './pages/AdminPage'; // Import AdminPage

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/report" element={<Report />} />
          <Route path="/llm" element={<LLM />} />
          <Route path="/llmOutput" element={<LLMOutput />} />
          <Route path="/AdminPage" element={<AdminPage />} /> {/* Route for AdminPage */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
