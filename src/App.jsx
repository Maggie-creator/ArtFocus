import React, { useState } from "react";
import Card1 from "./components/Card1";
import Card2 from "./components/Card2";
import Card3 from "./components/Card3";
import Card4 from "./components/Card4";
import Card5 from "./components/Card5";
import Card6 from "./components/Card6";
import Card7 from "./components/Card7";
import Card8 from "./components/Card8";
import Card9 from "./components/Card9";
import Card10 from "./components/Card10";
import Canvas from "./components/Canvas";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [showCanvas, setShowCanvas] = useState(true);
  const [showKanban, setShowKanban] = useState(true);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        My Responsive Dashboard
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        <Card1 />
        {showCanvas && <Canvas onClose={() => setShowCanvas(false)} />}
        <Card3 />
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <Card4 />
        <div className="w-96 flex-1">
          {showKanban && <KanbanBoard onClose={() => setShowKanban(false)} />}
        </div>
        <Card6 />
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <Card2 />
        <div className="w-96 flex-1">
          <Card7 />
        </div>
        <Card8 />
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <Card5 />
        <div className="w-96 flex-1 justify-center items-center">
          <Card9 />
        </div>
        <Card10 />
      </div>
    </div>
  );
}

export default App;
