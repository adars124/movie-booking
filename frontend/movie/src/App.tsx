import { useEffect, useState } from 'react';
import AllRoutes from './routes/AllRoutes';
import Loader from './common/Loader';

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
