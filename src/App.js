import React, { useState, useEffect } from 'react';
import './App.css';

const checklistData = [
  {
    title: "Define Your Business and Structure",
    subtasks: [
      { text: "Decided on commercial cleaning focus", completed: false, notes: "" },
      { text: "Registered with HMRC (Self-Assessment)", completed: false, notes: "" },
      { text: "Made decision: Sole trader only / Seeking partner (draft agreement if yes)", completed: false, notes: "" },
    ],
  },
  {
    title: "Secure Initial Funding and Equipment",
    subtasks: [
      { text: "Budgeted £1000", completed: false, notes: "" },
      { text: "Purchased equipment and supplies", completed: false, notes: "" },
      { text: "Researched funding", completed: false, notes: "" },
      { text: "Applied for loan or grant (if applicable)", completed: false, notes: "" },
    ],
  },
  // Add remaining steps similarly (shortened for brevity; full version in GitHub link)
];

function App() {
  const [checklist, setChecklist] = useState(checklistData);
  const [expanded, setExpanded] = useState({});

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cleaningChecklist');
    if (saved) setChecklist(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever checklist changes
  useEffect(() => {
    localStorage.setItem('cleaningChecklist', JSON.stringify(checklist));
  }, [checklist]);

  // Calculate total tasks and completed tasks for progress
  const totalTasks = checklist.reduce((sum, step) => sum + step.subtasks.length, 0);
  const completedTasks = checklist.reduce(
    (sum, step) => sum + step.subtasks.filter((sub) => sub.completed).length,
    0
  );
  const progress = Math.round((completedTasks / totalTasks) * 100);

  // Toggle task completion
  const toggleTask = (stepIdx, subIdx) => {
    const newChecklist = [...checklist];
    const subtask = newChecklist[stepIdx].subtasks[subIdx];
    subtask.completed = !subtask.completed;
    subtask.timestamp = subtask.completed ? new Date().toLocaleString() : "";
    setChecklist(newChecklist);
  };

  // Update notes
  const updateNotes = (stepIdx, subIdx, value) => {
    const newChecklist = [...checklist];
    newChecklist[stepIdx].subtasks[subIdx].notes = value;
    setChecklist(newChecklist);
  };

  // Toggle step expansion
  const toggleExpand = (stepIdx) => {
    setExpanded((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  // Reset progress
  const resetProgress = () => {
    setChecklist(checklistData);
    localStorage.setItem('cleaningChecklist', JSON.stringify(checklistData));
  };

  return (
    <div className="app">
      <header>
        <h1>Macclesfield Cleaning Business Tracker</h1>
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
          <span>{progress}% Complete ({completedTasks}/{totalTasks})</span>
        </div>
        <button onClick={resetProgress}>Reset Progress</button>
      </header>
      <div className="checklist">
        {checklist.map((step, stepIdx) => (
          <div key={stepIdx} className="step">
            <h2 onClick={() => toggleExpand(stepIdx)}>
              {step.title} {expanded[stepIdx] ? "▲" : "▼"}
            </h2>
            {expanded[stepIdx] && (
              <ul>
                {step.subtasks.map((subtask, subIdx) => (
                  <li key={subIdx} className={subtask.completed ? "completed" : ""}>
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleTask(stepIdx, subIdx)}
                    />
                    <span>{subtask.text}</span>
                    <details>
                      <summary>Notes</summary>
                      <textarea
                        value={subtask.notes}
                        onChange={(e) => updateNotes(stepIdx, subIdx, e.target.value)}
                        placeholder="Add notes here..."
                      />
                      {subtask.timestamp && <p>Completed: {subtask.timestamp}</p>}
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;