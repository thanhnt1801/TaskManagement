import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '../src/routes/routes';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import { Fragment, useEffect, useState } from 'react';
import ProjectLayout from './layouts/ProjectLayout/ProjectLayout';
import './App.css'

function App() {
   const [items, setItems] = useState([]);

   useEffect(() => {
      const items = JSON.parse(localStorage.getItem('user'));
      if (items) {
         setItems(items);
      } 
   }, []);

   return (
         <Router>
            <div className="App">
               <Routes>

                  {publicRoutes.map((route, index) => {
                     const Page = route.component;
                     let Layout = DefaultLayout;
                     let LayoutProject = ProjectLayout;

                     if (route.layout) {
                        Layout = route.layout;
                     } else if (route.layout === LayoutProject) {
                        Layout = route.layout;
                     } else if (route.layout === null) {
                        Layout = Fragment;
                     }

                     return (
                        <Route
                           key={index}
                           path={route.path}
                           element={
                              <Layout>
                                    <Page />
                              </Layout>
                           }
                        />
                     );
                  })}
               </Routes>
            </div>
         </Router>
   );
}

export default App;
