// import React from 'react'

// import { Routes, Route, Navigate } from 'react-router-dom';
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import ProtectedRoute from './shared/ProtectedRoute';
// import AdminLayout from './admin/AdminLayout';
// import AdminDashboardPage from './admin/AdminDashboardPage';
// import AdminBooksPage from './admin/AdminBooksPage';
// import AdminUserPage from './admin/AdminUserPage';
// import AdminFinesPage from './admin/AdminFinesPage';
// import UserDashboardPage from "./user/UserDashboardPage";
// import UserLayout from "./user/UserLayout";
// import UserBooksPage from "./user/UserBooksPage";
// import UserEditProfilePage from "./user/UserEditProfilePage";



// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />

//       {/*Protected Routes */}
//       {/* Admin */}
//       <Route element={<ProtectedRoute allowedRole="user" />}>
//         <Route path="/user" element={<UserLayout />}>
//           <Route index element={<Navigate to="/user/dashboard" replace />} />

//           <Route path="dashboard" element={<UserDashboardPage />} />
//           <Route path="books" element={<UserBooksPage />} />
//           <Route path="profile" element={<UserEditProfilePage />} />

//           <Route
//             path="complete-profile"
//             element={<UserCompleteProfilePage />}
//           />
//         </Route>
//       </Route>
//       <Route element={<ProtectedRoute allowedRole="admin" />}>
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Navigate to="/admin/dashboard" replace />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="books" element={<AdminBooksPage />} />
//           <Route path="users" element={<AdminUserPage />} />
//           <Route path="fines" element={<AdminFinesPage />} />
//         </Route>
//       </Route>
//       <Route element={<ProtectedRoute allowedRole="user" />}>
//         <Route path="/user" element={<UserLayout />}>
//           <Route index element={<Navigate to='/user/dashboard' replace />} />
//           <Route path="dashboard" element={<UserDashboardPage />} />
//           <Route path="books" element={<UserBooksPage />} />
//           <Route path="profile" element={<UserEditProfilePage />} />
//         </Route>
//       </Route>

//       <Route path="*" element={<Navigate to="/" replace />} />

//     </Routes>

//   );
// };

// export default App;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./shared/ProtectedRoute";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminBooksPage from "./admin/AdminBooksPage";
import AdminUserPage from "./admin/AdminUserPage";
import AdminFinesPage from "./admin/AdminFinesPage";
import AddStudentPage from "./admin/AddStudentPage";

// User
import UserDashboardPage from "./user/UserDashboardPage";
import UserLayout from "./user/UserLayout";
import UserBooksPage from "./user/UserBooksPage";
import UserEditProfilePage from "./user/UserEditProfilePage";

const App = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* ================= USER ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route path="/user" element={<UserLayout />}>

          {/* /user → /user/dashboard */}
          <Route
            index
            element={<Navigate to="/user/dashboard" replace />}
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<UserDashboardPage />}
          />

          {/* Books */}
          <Route
            path="books"
            element={<UserBooksPage />}
          />

          {/* Profile */}
          <Route
            path="profile"
            element={<UserEditProfilePage />}
          />

          {/* Complete Profile */}
          <Route
            path="complete-profile"
            element={<UserEditProfilePage />}
          />

        </Route>
      </Route>


      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>

          {/* /admin → /admin/dashboard */}
          <Route
            index
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboardPage />}
          />

          {/* Books */}
          <Route
            path="books"
            element={<AdminBooksPage />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<AdminUserPage />}
          />

          {/* Fines */}
          <Route
            path="fines"
            element={<AdminFinesPage />}
          />

          {/* Add Student */}
          <Route
            path="add-student"
            element={<AddStudentPage />}
          />

        </Route>
      </Route>


      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default App;