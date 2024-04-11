import './App.css';
import { Navbar } from './components/User Components/Navbar';
import { Home } from './components/User Components/Home';
import { Footer } from './components/User Components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom'
import { Services } from './components/User Components/Services';
import { Login } from './components/User Components/Login';
import { Registration } from './components/User Components/Registration';
import { About } from './components/User Components/About';
import { ProtectedRoutes } from './hooks/ProtectedRoutes';
import { Order } from './components/Service Provider Components/Order';
import { DataProvider } from './context';
import { History } from './components/Service Provider Components/History';
import { ManageServices } from './components/Service Provider Components/ManageServices';
import { BookNow } from './components/User Components/BookNow';
import { UserOrderPage } from './components/User Components/UserOrderPage';
import DownloadInvoice  from './components/DownloadInvoice';

function App() {

  const location = useLocation();

  return (
    <DataProvider>
      <div className="App">

        <Navbar activeComponent={location.pathname} />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/home' element={<Home />}></Route>

          <Route element={<ProtectedRoutes />}>
            <Route path='/services' element={<Services />} />
            <Route path='/about' element={<About />} />
          <Route path='/userorder' element={<UserOrderPage/>}/>
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />

          <Route path="/order" element={<Order />} />
          <Route path="/history" element={<History/>}/>
          <Route path='/manageservice' element={<ManageServices/>}/>
          <Route path='/booknow' element={<BookNow/>}/>
          <Route path='/invoice-download/:orderId' element={<DownloadInvoice  />} />
        </Routes>
        <Footer />

      </div>
    </DataProvider>

  );
}

export default App;
