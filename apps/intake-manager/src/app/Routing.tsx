import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

let any: any;

const Routing = ({
  defaultView = any
}) => {

  function CatchAllRoute({ type = 'view' }) { // wont work after compile since it cant run the import after the render

    const location = useLocation();

    let Output = lazy(() => import(`./${location.pathname.slice(1)}/`));

    // Dynamically import the component
    if (type == 'component') Output = lazy(() => import(`./${location.pathname.slice(1)}/component`));

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Output />
      </Suspense>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<CatchAllRoute />} />
          <Route path="/components/*" element={<CatchAllRoute type='component' />} />
          <Route path="/intake-manager/*" element={<CatchAllRoute />} />
          <Route path="/intake-manager/components/*" element={<CatchAllRoute type='component' />} />
          <Route
            path="/"
            element={
              typeof defaultView === 'string'
                ? lazy(() => import(`./views/${defaultView}`))
                : defaultView
            }
          />
          <Route
            path="/intake-manager/"
            element={
              typeof defaultView === 'string'
                ? lazy(() => import(`./views/${defaultView}`))
                : defaultView
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;