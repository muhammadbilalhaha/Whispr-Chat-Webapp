import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Registration from './components/pages/authentication/registration';
import Login from './components/pages/authentication/login';
import ForgetPassword from './components/pages/authentication/forgetPassword';
import ResetPassword from './components/pages/authentication/resetPassword';
import EmailSentSuccessful from './components/pages/authentication/emailSentSuccessful';
import ResetPasswordSuccessful from './components/pages/authentication/resetPasswordSuccessful';
import { useEffect } from 'react';
import { userAuthenticationStore } from './store/userAuthenticationStore';
import Home from './components/pages/home/home'
import RouteProtector from './components/pages/RouteProtector';
import Loader from './components/Loader/Loader'
import AdminDashboard from './components/pages/dashboard/dashboardMain';


function App() {

  const { checkAuthentication, isCheckingAuthentication, onlineUsers } = userAuthenticationStore();

  useEffect(() => {
    checkAuthentication();
  }, []);
  
  if (isCheckingAuthentication) {
    return <Loader />;
  }
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Authentication routes */}
          <Route element={<RouteProtector requireAuth={false} redirectTo={"/"} />} >
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/emailSentSuccessfull" element={<EmailSentSuccessful />} />
            <Route path="/userResetPassword/:token" element={<ResetPassword />} />
            <Route path="/resetPasswordSuccessfull" element={<ResetPasswordSuccessful />} />

          </Route>

          {/* Loggedin User */}
          <Route element={<RouteProtector requireAuth={true} redirectTo={"/login"} />} >
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
