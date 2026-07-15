import { ThemeProvider } from '@/context/ThemeContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { ToastProvider } from '@/context/ToastContext';
import { Home } from '@/pages/Home';

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          <Home />
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
