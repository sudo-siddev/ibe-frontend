import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { ReviewsPage } from './pages/ReviewsPage/ReviewsPage';
import './styles/global.css';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="app">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/rooms/:roomId" element={<ReviewsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;

