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
  {
    title: "Set Up Legal and Safety Basics",
    subtasks: [
      { text: "Obtained insurance (note provider and cost)", completed: false, notes: "" },
      { text: "Reviewed COSHH basics", completed: false, notes: "" },
      { text: "Contacted council / Confirmed waste plan", completed: false, notes: "" },
    ],
  },
  {
    title: "Build Your Marketing Foundation",
    subtasks: [
      { text: "Website live", completed: false, notes: "" },
      { text: "Profiles created (social media)", completed: false, notes: "" },
      { text: "First ad launched", completed: false, notes: "" },
      { text: "Flyers distributed", completed: false, notes: "" },
      { text: "Joined local business group", completed: false, notes: "" },
    ],
  },
  {
    title: "Launch Operations Part-Time",
    subtasks: [
      { text: "Secured first client", completed: false, notes: "" },
      { text: "Set up booking system", completed: false, notes: "" },
      { text: "First job completed", completed: false, notes: "" },
      { text: "Feedback received", completed: false, notes: "" },
    ],
  },
  {
    title: "Monitor and Scale",
    subtasks: [
      { text: "Reinvested £___ into ___ (e.g., new vacuum)", completed: false, notes: "" },
      { text: "Hired first staff", completed: false, notes: "" },
      { text: "Insurance updated", completed: false, notes: "" },
      { text: "Secured first contract", completed: false, notes: "" },
    ],
  },
  {
    title: "Research Competition and Refine",
    subtasks: [
      { text: "Competition researched", completed: false, notes: "" },
      { text: "Defined unique edge (e.g., eco-friendly)", completed: false, notes: "" },
      { text: "Updated offerings", completed: false, notes: "" },
    ],
  },
  {
    title: "Expand Toward Your Vision",
    subtasks: [
      { text: "First Manchester client", completed: false, notes: "" },
      { text: "Locked in first long-term deal", completed: false, notes: "" },
    ],
  },
];

function App() {
  const [checklist, setChecklist] = useState(checklistData);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('cleaningChecklist');
    if (saved) setChecklist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cleaningChecklist', JSON.stringify(checklist));
  }, [checklist]);

  const totalTasks = checklist.reduce((sum, step) => sum + (step.subtasks?.length || 0), 0);
  const completedTasks = checklist.reduce(
    (sum, step) => sum + (step.subtasks?.filter((sub) => sub.completed).length || 0),
    0
  );
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTask = (stepIdx, subIdx) => {
    const newChecklist = [...checklist];
    const subtask = newChecklist[stepIdx].subtasks[subIdx];
    subtask.completed = !subtask.completed;
    subtask.timestamp = subtask.completed ? new Date().toLocaleString() : "";
    setChecklist(newChecklist);
  };

  const updateNotes = (stepIdx, subIdx, value) => {
    const newChecklist = [...checklist];
    newChecklist[stepIdx].subtasks[subIdx].notes = value;
    setChecklist(newChecklist);
  };

  const toggleExpand = (stepIdx) => {
    setExpanded((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

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
            {expanded[stepIdx] && step.subtasks && (
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