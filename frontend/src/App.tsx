import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import Start from "./pages/Start";
import Processing from "./pages/Processing";
import Results from "./pages/Results";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageBackground from "./components/PageBackground";

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageBackground />
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/diagnosis/start" element={<Start />} />
          <Route path="/diagnosis/processing" element={<Processing />} />
          <Route path="/diagnosis/results" element={<Results />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
