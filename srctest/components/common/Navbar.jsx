// // src/components/common/Navbar.jsx
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { toggleTheme } from '../../redux/slices/themeSlice';

// const Navbar = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { isDark } = useSelector((state) => state.theme);

//   return (
//     <nav className="navbar">
//       <div className="nav-brand">
//         <Link to="/">Developer Tools Hub</Link>
//       </div>

//       <div className="nav-links">
//         <Link
//           to="/json"
//           className={location.pathname === '/json' || location.pathname === '/' ? 'active' : ''}
//         >
//           JSON
//         </Link>
//         <Link
//           to="/jwt"
//           className={location.pathname === '/jwt' ? 'active' : ''}
//         >
//           JWT
//         </Link>
//         <Link
//           to="/base64"
//           className={location.pathname === '/base64' ? 'active' : ''}
//         >
//           Base64
//         </Link>
//       </div>

//       <button
//         className="theme-toggle"
//         onClick={() => dispatch(toggleTheme())}
//       >
//         {isDark ? '☀️' : '🌙'}
//       </button>
//     </nav>
//   );
// };

// export default Navbar;



import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Developer Tools Hub</Link>
      </div>
      <div className="nav-links">
        <Link to="/json" className={location.pathname === '/json' || location.pathname === '/' ? 'active' : ''}>JSON</Link>
        <Link to="/jwt" className={location.pathname === '/jwt' ? 'active' : ''}>JWT</Link>
        <Link to="/base64" className={location.pathname === '/base64' ? 'active' : ''}>Base64</Link>
      </div>
      <button className="theme-toggle" onClick={() => dispatch(toggleTheme())}>
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
};
export default Navbar;
