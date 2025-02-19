import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import AddPricing from "./components/AddPricing";
import ManagePricing from "./components/ManagePricing";
import ManageSubcription from "./components/ManageSubcriptions";
import AddSDriver from "./components/AddSDriver";
import AddSRider from "./components/AddSRider";
import ManageAllDriver from "./components/ManageAllDriver";
import ManageAllRider from "./components/ManageAllRider";
import AddCab from "./components/AddCab";
import ManageCabs from "./components/ManageCabs";
import AddDriver from "./components/AddDriver";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/addPricing" element={<AddPricing />} />
              <Route path="/pricing" element={<ManagePricing />} />
              <Route path="/subcription" element={<ManageSubcription />} />
              <Route path="/addSubcriptionDriver" element={<AddSDriver />} />
              <Route path="/addSubcriptionDriver" element={<AddSDriver />} />
              <Route path="/addSubcriptionRider" element={<AddSRider />} />
              <Route path="/add-drivers" element={<AddDriver />} />
              <Route path="/drivers" element={<ManageAllDriver />} />
              <Route path="/riders" element={<ManageAllRider />} />
              <Route path="/add-cabs" element={<AddCab />} />
              <Route path="/cabs" element={<ManageCabs />} />






            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
