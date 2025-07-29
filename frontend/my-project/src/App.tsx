// App.tsx (fixed version)
import { useSelector } from "react-redux";

function App() {
    const user = useSelector((state: any) => state.auth.user);
    return (
        <div>
            <h1>Welcome {user?.name || 'Guest'}</h1>
        </div>
    );
}

export default App;
