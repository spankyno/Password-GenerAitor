import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { ToastProvider } from '@/context/ToastContext';
import { Home } from '@/pages/Home';

const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/acerca-de"
                element={
                  <Suspense fallback={null}>
                    <About />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
