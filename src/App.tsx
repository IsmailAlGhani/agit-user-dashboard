import { Typography } from "@material-tailwind/react";
import TableUsers from "./components/tableUsers";

function App() {
  return (
    <div className="container mx-auto py-4 px-4 md:w-4/5 h-screen">
      <div className="flex flex-col items-center gap-4">
        <Typography variant="h3" color="blue" textGradient>
          Agit User Dashboard
        </Typography>
        <TableUsers />
      </div>
    </div>
  );
}

export default App;
