import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const checklistData = [
  {
    title: "Define Your Business and Structure",
    subtasks: [
      { id: "1-1", text: "Decided on commercial cleaning focus", completed: false, notes: "", priority: "medium" },
      { id: "1-2", text: "Registered with HMRC (Self-Assessment)", completed: false, notes: "", priority: "high" },
      { id: "1-3", text: "Made decision: Sole trader only / Seeking partner (draft agreement if yes)", completed: false, notes: "", priority: "medium" },
    ],
    id: "step-1"
  },
  {
    title: "Secure Initial Funding and Equipment",
    subtasks: [
      { id: "2-1", text: "Budgeted £1000", completed: false, notes: "", priority: "high" },
      { id: "2-2", text: "Purchased equipment and supplies", completed: false, notes: "", priority: "medium" },
      { id: "2-3", text: "Researched funding", completed: false, notes: "", priority: "medium" },
      { id: "2-4", text: "Applied for loan or grant (if applicable)", completed: false, notes: "", priority: "low" },
    ],
    id: "step-2"
  },
  {
    title: "Set Up Legal and Safety Basics",
    subtasks: [
      { id: "3-1", text: "Obtained insurance (note provider and cost)", completed: false, notes: "", priority: "high" },
      { id: "3-2", text: "Reviewed COSHH basics", completed: false, notes: "", priority: "medium" },
      { id: "3-3", text: "Contacted council / Confirmed waste plan", completed: false, notes: "", priority: "medium" },
    ],
    id: "step-3"
  },
  {
    title: "Build Your Marketing Foundation",
    subtasks: [
      { id: "4-1", text: "Website live", completed: false, notes: "", priority: "high" },
      { id: "4-2", text: "Profiles created (social media)", completed: false, notes: "", priority: "medium" },
      { id: "4-3", text: "First ad launched", completed: false, notes: "", priority: "medium" },
      { id: "4-4", text: "Flyers distributed", completed: false, notes: "", priority: "low" },
      { id: "4-5", text: "Joined local business group", completed: false, notes: "", priority: "low" },
    ],
    id: "step-4"
  },
  {
    title: "Launch Operations Part-Time",
    subtasks: [
      { id: "5-1", text: "Secured first client", completed: false, notes: "", priority: "high" },
      { id: "5-2", text: "Set up booking system", completed: false, notes: "", priority: "medium" },
      { id: "5-3", text: "First job completed", completed: false, notes: "", priority: "high" },
      { id: "5-4", text: "Feedback received", completed: false, notes: "", priority: "medium" },
    ],
    id: "step-5"
  },
  {
    title: "Monitor and Scale",
    subtasks: [
      { id: "6-1", text: "Reinvested £___ into ___ (e.g., new vacuum)", completed: false, notes: "", priority: "medium" },
      { id: "6-2", text: "Hired first staff", completed: false, notes: "", priority: "medium" },
      { id: "6-3", text: "Insurance updated", completed: false, notes: "", priority: "high" },
      { id: "6-4", text: "Secured first contract", completed: false, notes: "", priority: "high" },
    ],
    id: "step-6"
  },
  {
    title: "Research Competition and Refine",
    subtasks: [
      { id: "7-1", text: "Competition researched", completed: false, notes: "", priority: "medium" },
      { id: "7-2", text: "Defined unique edge (e.g., eco-friendly)", completed: false, notes: "", priority: "high" },
      { id: "7-3", text: "Updated offerings", completed: false, notes: "", priority: "medium" },
    ],
    id: "step-7"
  },
  {
    title: "Expand Toward Your Vision",
    subtasks: [
      { id: "8-1", text: "First Manchester client", completed: false, notes: "", priority: "medium" },
      { id: "8-2", text: "Locked in first long-term deal", completed: false, notes: "", priority: "high" },
    ],
    id: "step-8"
  },
];

function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [{
      id: "project-1", 
      name: "Cleaning Business Tracker", 
      checklist: checklistData
    }];
  });
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const [newStep, setNewStep] = useState({ title: "", subtasks: [{ text: "", completed: false, notes: "", priority: "medium" }] });
  const [expanded, setExpanded] = useState({});
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectDetails, setNewProjectDetails] = useState({ name: "", stepTitle: "", subtaskText: "" });
  const [editMode, setEditMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [lastAction, setLastAction] = useState({ type: null, data: null });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  // Refs for focused items
  const subtaskRefs = useRef({});
  const stepTitleRefs = useRef({});

  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Ensure all projects have IDs
        const projectsWithIds = parsed.map(project => {
          if (!project.id) {
            project.id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
          
          // Ensure all steps have IDs
          const checklistWithIds = project.checklist.map(step => {
            if (!step.id) {
              step.id = `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }
            
            // Ensure all subtasks have IDs and priority
            const subtasksWithIds = step.subtasks.map(subtask => {
              if (!subtask.id) {
                subtask.id = `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              }
              if (!subtask.priority) {
                subtask.priority = "medium";
              }
              return subtask;
            });
            
            return {...step, subtasks: subtasksWithIds};
          });
          
          return {...project, checklist: checklistWithIds};
        });
        
        setProjects(projectsWithIds);
      } catch (e) {
        console.error("Error parsing saved projects:", e);
        // Fallback to default project
        setProjects([{
          id: "project-1", 
          name: "Cleaning Business Tracker", 
          checklist: checklistData
        }]);
      }
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      showNotification("Error saving your data. Please check your browser storage settings.");
    }
  }, [projects]);

  // Handler for snackbar notifications
  const showNotification = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  // Undo last action
  const undoLastAction = () => {
    if (!lastAction.type) return;

    const { type, data } = lastAction;
    
    if (type === "TOGGLE_TASK") {
      toggleTask(data.stepIdx, data.subIdx, true);
    } else if (type === "DELETE_SUBTASK") {
      const newProjects = [...projects];
      const step = newProjects[currentProjectIdx].checklist[data.stepIdx];
      step.subtasks.splice(data.subIdx, 0, data.subtask);
      setProjects(newProjects);
      showNotification("Subtask restored");
    }
    
    setLastAction({ type: null, data: null });
  };

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const currentProject = projects[currentProjectIdx];
    const term = searchTerm.toLowerCase();
    const results = [];

    currentProject.checklist.forEach((step, stepIdx) => {
      // Search in step title
      if (step.title.toLowerCase().includes(term)) {
        results.push({ type: 'step', stepIdx, title: step.title });
      }

      // Search in subtasks
      step.subtasks.forEach((subtask, subIdx) => {
        if (subtask.text.toLowerCase().includes(term) || 
            subtask.notes.toLowerCase().includes(term)) {
          results.push({ 
            type: 'subtask', 
            stepIdx, 
            subIdx, 
            text: subtask.text,
            completed: subtask.completed
          });
        }
      });
    });

    setSearchResults(results);
  }, [searchTerm, projects, currentProjectIdx]);

  const currentChecklist = projects[currentProjectIdx]?.checklist || [];
  
  // Apply filters to the checklist
  const filteredChecklist = filterOption === "all" 
    ? currentChecklist
    : currentChecklist.map(step => ({
        ...step,
        subtasks: step.subtasks.filter(subtask => 
          filterOption === "completed" ? subtask.completed : !subtask.completed
        )
      })).filter(step => step.subtasks.length > 0);
  
  const totalTasks = currentChecklist.reduce((sum, step) => sum + (step.subtasks?.length || 0), 0);
  const completedTasks = currentChecklist.reduce(
    (sum, step) => sum + (step.subtasks?.filter((sub) => sub.completed).length || 0),
    0
  );
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTask = (stepIdx, subIdx, isUndo = false) => {
    const newProjects = [...projects];
    const subtask = newProjects[currentProjectIdx].checklist[stepIdx].subtasks[subIdx];
    
    // Save the current state for undo functionality
    if (!isUndo) {
      setLastAction({
        type: "TOGGLE_TASK",
        data: { stepIdx, subIdx, previousState: subtask.completed }
      });
    }
    
    subtask.completed = !subtask.completed;
    subtask.timestamp = subtask.completed ? new Date().toLocaleString() : "";
    setProjects(newProjects);
    
    // Show notification
    showNotification(subtask.completed ? "Task completed! 🎉" : "Task marked as incomplete");
  };

  const updateNotes = (stepIdx, subIdx, value) => {
    const newProjects = [...projects];
    newProjects[currentProjectIdx].checklist[stepIdx].subtasks[subIdx].notes = value;
    setProjects(newProjects);
  };

  const updatePriority = (stepIdx, subIdx, priority) => {
    const newProjects = [...projects];
    newProjects[currentProjectIdx].checklist[stepIdx].subtasks[subIdx].priority = priority;
    setProjects(newProjects);
    showNotification(`Priority set to ${priority}`);
  };

  const toggleExpand = (stepIdx) => {
    setExpanded((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const expandAll = () => {
    const allExpanded = {};
    currentChecklist.forEach((_, idx) => {
      allExpanded[idx] = true;
    });
    setExpanded(allExpanded);
    showNotification("All sections expanded");
  };

  const collapseAll = () => {
    setExpanded({});
    showNotification("All sections collapsed");
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset progress? This will keep your steps but clear all completion status, notes, and timestamps.")) {
      const newProjects = [...projects];
      const currentProject = newProjects[currentProjectIdx];
      currentProject.checklist = currentProject.checklist.map(step => ({
        ...step,
        subtasks: step.subtasks.map(subtask => ({
          ...subtask,
          completed: false,
          notes: "",
          timestamp: ""
        }))
      }));
      setProjects(newProjects);
      showNotification("Progress reset successfully");
    }
  };

  const clearProgress = () => {
    if (window.confirm("Are you sure you want to clear all progress? This will remove all steps and subtasks.")) {
      const newProjects = [...projects];
      newProjects[currentProjectIdx].checklist = [];
      setProjects(newProjects);
      showNotification("All tasks cleared");
    }
  };

  const duplicateProject = () => {
    const currentProject = projects[currentProjectIdx];
    const newProject = {
      ...JSON.parse(JSON.stringify(currentProject)),
      id: `project-${Date.now()}`,
      name: `${currentProject.name} (Copy)`
    };
    
    setProjects([...projects, newProject]);
    setCurrentProjectIdx(projects.length);
    showNotification("Project duplicated successfully");
  };

  const deleteProject = () => {
    if (projects.length === 1) {
      alert("You can't delete the last project.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const newProjects = projects.filter((_, idx) => idx !== currentProjectIdx);
      setProjects(newProjects);
      setCurrentProjectIdx(currentProjectIdx >= newProjects.length ? newProjects.length - 1 : currentProjectIdx);
      showNotification("Project deleted");
    }
  };

  const handleAddOrUpdateStep = (e) => {
    e.preventDefault();
    
    const title = newStep.title.trim();
    if (!title) {
      showNotification("Please enter a title for the new task");
      return;
    }
    
    const subtaskText = newStep.subtasks[0].text.trim();
    const newProjects = [...projects];
    const stepId = `step-${Date.now()}`;

    const newChecklist = [
      ...currentChecklist,
      { 
        title, 
        id: stepId,
        subtasks: subtaskText ? [{ 
          id: `subtask-${Date.now()}-1`,
          text: subtaskText, 
          completed: false, 
          notes: "",
          priority: "medium"
        }] : [] 
      }
    ];
    
    newProjects[currentProjectIdx].checklist = newChecklist;
    setProjects(newProjects);
    setNewStep({ title: "", subtasks: [{ text: "", completed: false, notes: "", priority: "medium" }] });
    
    // Auto-expand the new step
    setExpanded({ ...expanded, [newChecklist.length - 1]: true });
    showNotification("New task added");
  };

  const editStep = (stepIdx) => {
    setEditMode({ stepIdx });
    
    // Focus after state update
    setTimeout(() => {
      if (stepTitleRefs.current[stepIdx]) {
        stepTitleRefs.current[stepIdx].focus();
      }
    }, 0);
  };

  const addSubtaskToStep = (stepIdx) => {
    const newProjects = [...projects];
    const newSubtaskId = `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newSubtask = {
      id: newSubtaskId,
      text: "New Subtask",
      completed: false,
      notes: "",
      priority: "medium"
    };
    
    newProjects[currentProjectIdx].checklist[stepIdx].subtasks.push(newSubtask);
    setProjects(newProjects);
    
    // Set edit mode for the new subtask
    const newSubtaskIdx = newProjects[currentProjectIdx].checklist[stepIdx].subtasks.length - 1;
    setEditMode({ stepIdx, subIdx: newSubtaskIdx });
    setExpanded({ ...expanded, [stepIdx]: true });
    
    // Focus the new subtask after state update
    setTimeout(() => {
      const key = `${stepIdx}-${newSubtaskIdx}`;
      if (subtaskRefs.current[key]) {
        subtaskRefs.current[key].focus();
      }
    }, 0);
    
    showNotification("New subtask added");
  };
  
  const deleteSubtask = (stepIdx, subIdx) => {
    if (window.confirm("Are you sure you want to delete this subtask?")) {
      const newProjects = [...projects];
      const step = newProjects[currentProjectIdx].checklist[stepIdx];
      const deletedSubtask = {...step.subtasks[subIdx]};
      
      // Save for undo functionality
      setLastAction({
        type: "DELETE_SUBTASK",
        data: { stepIdx, subIdx, subtask: deletedSubtask }
      });
      
      step.subtasks.splice(subIdx, 1);
      setProjects(newProjects);
      showNotification("Subtask deleted");
    }
  };
  
  const deleteStep = (stepIdx) => {
    if (window.confirm("Are you sure you want to delete this entire step and all its subtasks?")) {
      const newProjects = [...projects];
      newProjects[currentProjectIdx].checklist.splice(stepIdx, 1);
      setProjects(newProjects);
      showNotification("Task group deleted");
    }
  };

  // Manual reorder functions (replacement for drag and drop)
  const moveStepUp = (stepIdx) => {
    if (stepIdx === 0) return;
    
    const newProjects = [...projects];
    const currentProject = newProjects[currentProjectIdx];
    const [removed] = currentProject.checklist.splice(stepIdx, 1);
    currentProject.checklist.splice(stepIdx - 1, 0, removed);
    setProjects(newProjects);
    showNotification("Task group moved up");
  };
  
  const moveStepDown = (stepIdx) => {
    const newProjects = [...projects];
    const currentProject = newProjects[currentProjectIdx];
    
    if (stepIdx === currentProject.checklist.length - 1) return;
    
    const [removed] = currentProject.checklist.splice(stepIdx, 1);
    currentProject.checklist.splice(stepIdx + 1, 0, removed);
    setProjects(newProjects);
    showNotification("Task group moved down");
  };
  
  const moveSubtaskUp = (stepIdx, subIdx) => {
    if (subIdx === 0) return;
    
    const newProjects = [...projects];
    const step = newProjects[currentProjectIdx].checklist[stepIdx];
    const [removed] = step.subtasks.splice(subIdx, 1);
    step.subtasks.splice(subIdx - 1, 0, removed);
    setProjects(newProjects);
    showNotification("Subtask moved up");
  };
  
  const moveSubtaskDown = (stepIdx, subIdx) => {
    const newProjects = [...projects];
    const step = newProjects[currentProjectIdx].checklist[stepIdx];
    
    if (subIdx === step.subtasks.length - 1) return;
    
    const [removed] = step.subtasks.splice(subIdx, 1);
    step.subtasks.splice(subIdx + 1, 0, removed);
    setProjects(newProjects);
    showNotification("Subtask moved down");
  };

  // Export project
  const exportProject = () => {
    try {
      const currentProject = projects[currentProjectIdx];
      const dataStr = JSON.stringify(currentProject, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${currentProject.name.replace(/\s+/g, '_')}_export.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showNotification("Project exported successfully");
    } catch (e) {
      console.error("Export failed:", e);
      showNotification("Export failed. Please try again.");
    }
  };

  // Import project
  const importProject = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          
          // Validate imported data
          if (!imported.name || !Array.isArray(imported.checklist)) {
            throw new Error("Invalid project format");
          }
          
          // Add ID if missing
          if (!imported.id) {
            imported.id = `project-${Date.now()}`;
          }
          
          // Add to projects
          setProjects([...projects, imported]);
          setCurrentProjectIdx(projects.length);
          showNotification("Project imported successfully");
        } catch (err) {
          console.error("Import parsing failed:", err);
          showNotification("Import failed. Invalid file format.");
        }
      };
      reader.readAsText(file);
    } catch (e) {
      console.error("Import failed:", e);
      showNotification("Import failed. Please try again.");
    }
    
    // Clear the input
    e.target.value = null;
  };

  return (
    <div className="app">
      <header>
        <div className="app-header">
          <h1 className="app-title">My Progress Tracker</h1>
          <p className="app-subtitle">Track all your Goals in one place</p>
          <div className="view-controls">
            <button onClick={expandAll} className="icon-button">
              <span role="img" aria-label="Expand All">🔽</span> Expand All
            </button>
            <button onClick={collapseAll} className="icon-button">
              <span role="img" aria-label="Collapse All">🔼</span> Collapse All
            </button>
          </div>
        </div>
        
        <div className="project-controls">
          <select 
            value={currentProjectIdx}
            onChange={(e) => setCurrentProjectIdx(Number(e.target.value))}
            aria-label="Select project"
          >
            {projects.map((project, idx) => (
              <option key={project.id || idx} value={idx}>{project.name}</option>
            ))}
          </select>
          <div className="buttons-group">
            <button 
              onClick={() => setShowNewProject(true)}
              aria-label="Create new project"
              className="primary"
            >
              New Project
            </button>
            <button 
              onClick={duplicateProject}
              aria-label="Duplicate current project"
              className="secondary"
            >
              Duplicate
            </button>
            <button 
              onClick={exportProject}
              aria-label="Export project"
              className="secondary"
            >
              Export
            </button>
            <label className="button secondary import-button">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importProject}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="project-header">
          <h2>{projects[currentProjectIdx]?.name || "New Project"}</h2>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
          <span className="details">({completedTasks}/{totalTasks} tasks completed)</span>
        </div>

        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="filter-options">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              aria-label="Filter tasks"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          
          <div className="progress-controls">
            <button onClick={resetProgress} className="warning">
              Reset Progress
            </button>
            <button onClick={clearProgress} className="warning">
              Clear All Tasks
            </button>
          </div>
        </div>
      </header>
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results for "{searchTerm}"</h3>
          <ul>
            {searchResults.map((result, idx) => (
              <li key={idx} className={result.completed ? "completed" : ""}>
                {result.type === 'step' ? (
                  <strong onClick={() => {
                    setExpanded({ ...expanded, [result.stepIdx]: true });
                    // Scroll to the step
                    document.getElementById(`step-${result.stepIdx}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}>
                    {result.title}
                  </strong>
                ) : (
                  <span onClick={() => {
                    setExpanded({ ...expanded, [result.stepIdx]: true });
                    // Scroll to the subtask
                    document.getElementById(`subtask-${result.stepIdx}-${result.subIdx}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }}>
                    {result.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showNewProject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const { name, stepTitle, subtaskText } = newProjectDetails;
              if (name.trim() && !projects.some(p => p.name === name.trim())) {
                const newProject = {
                  id: `project-${Date.now()}`,
                  name: name.trim(),
                  checklist: stepTitle.trim() ? [{ 
                    id: `step-${Date.now()}-1`,
                    title: stepTitle.trim(), 
                    subtasks: [{ 
                      id: `subtask-${Date.now()}-1`,
                      text: subtaskText.trim() || "Add your first task here", 
                      completed: false, 
                      notes: "", 
                      priority: "medium"
                    }] 
                  }] : []
                };
                setProjects([...projects, newProject]);
                setCurrentProjectIdx(projects.length);
                setShowNewProject(false);
                setNewProjectDetails({ name: "", stepTitle: "", subtaskText: "" });
                showNotification("New project created");
              } else {
                alert("Please enter a unique project name.");
              }
            }}>
              <input 
                value={newProjectDetails.name} 
                onChange={(e) => setNewProjectDetails({ ...newProjectDetails, name: e.target.value })} 
                placeholder="Project Name" 
                required
              />
              <input 
                value={newProjectDetails.stepTitle} 
                onChange={(e) => setNewProjectDetails({ ...newProjectDetails, stepTitle: e.target.value })} 
                placeholder="First Task Group (optional)" 
              />
              <input 
                value={newProjectDetails.subtaskText} 
                onChange={(e) => setNewProjectDetails({ ...newProjectDetails, subtaskText: e.target.value })} 
                placeholder="First Task (optional)" 
              />
              <div className="modal-buttons">
                <button type="submit" className="primary">Create</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectDetails({ name: "", stepTitle: "", subtaskText: "" });
                  }} 
                  className="secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <form onSubmit={handleAddOrUpdateStep} className="add-step-form">
        <input
          value={newStep.title}
          onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
          placeholder="New Task Group"
        />
        <input
          value={newStep.subtasks[0].text}
          onChange={(e) => setNewStep({ 
            ...newStep, 
            subtasks: [{ ...newStep.subtasks[0], text: e.target.value }] 
          })}
          placeholder="First Task (optional)"
        />
        <button type="submit" className="primary">Add Task Group</button>
      </form>

      {lastAction.type && (
        <div className="undo-container">
          <button onClick={undoLastAction} className="undo-button">
            Undo Last Action
          </button>
        </div>
      )}
        
      <div className="checklist">
        {filteredChecklist.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? (
              <>
                <h3>No tasks match your search</h3>
                <p>Try a different search term or clear the search</p>
              </>
            ) : filterOption !== "all" ? (
              <>
                <h3>No {filterOption} tasks found</h3>
                <p>Change the filter to see other tasks</p>
              </>
            ) : (
              <>
                <h3>No tasks yet</h3>
                <p>Add your first task group to get started</p>
              </>
            )}
          </div>
        ) : (
          filteredChecklist.map((step, stepIdx) => (
            <div 
              key={step.id || `step-${stepIdx}`} 
              className="step"
              id={`step-${stepIdx}`}
            >
              <div className="step-header">
                <h3 onClick={() => toggleExpand(stepIdx)}>
                  <span 
                    ref={el => stepTitleRefs.current[stepIdx] = el}
                    contentEditable={editMode?.stepIdx === stepIdx && editMode?.subIdx === undefined}
                    onBlur={(e) => {
                      if (e.target.textContent.trim()) {
                        const newProjects = [...projects];
                        newProjects[currentProjectIdx].checklist[stepIdx].title = e.target.textContent;
                        setProjects(newProjects);
                      }
                      setEditMode(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                      }
                    }}
                    suppressContentEditableWarning={true}
                    className={editMode?.stepIdx === stepIdx && editMode?.subIdx === undefined ? 'editing' : ''}
                  >
                    {step.title}
                  </span>
                  <span className="expand-icon">{expanded[stepIdx] ? "▲" : "▼"}</span>
                </h3>
                <div className="step-controls">
                  <button onClick={() => moveStepUp(stepIdx)} className="icon-button" disabled={stepIdx === 0}>
                    <span role="img" aria-label="Move up">⬆️</span>
                  </button>
                  <button onClick={() => moveStepDown(stepIdx)} className="icon-button" disabled={stepIdx === filteredChecklist.length - 1}>
                    <span role="img" aria-label="Move down">⬇️</span>
                  </button>
                  <button onClick={() => editStep(stepIdx)} className="icon-button edit-btn">
                    <span role="img" aria-label="Edit">✏️</span>
                  </button>
                  <button onClick={() => addSubtaskToStep(stepIdx)} className="icon-button add-btn">
                    <span role="img" aria-label="Add">➕</span>
                  </button>
                  <button onClick={() => deleteStep(stepIdx)} className="icon-button delete-btn">
                    <span role="img" aria-label="Delete">🗑️</span>
                  </button>
                </div>
              </div>
              
              {expanded[stepIdx] && step.subtasks.length > 0 && (
                <ul>
                  {step.subtasks.map((subtask, subIdx) => (
                    <li 
                      key={subtask.id || `subtask-${stepIdx}-${subIdx}`}
                      className={`
                        subtask 
                        ${subtask.completed ? "completed" : ""} 
                        priority-${subtask.priority}
                        ${subtask.notes.trim() ? "has-notes" : ""}
                      `}
                      id={`subtask-${stepIdx}-${subIdx}`}
                    >
                      <div className="subtask-row">
                        <div className="subtask-main">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => toggleTask(stepIdx, subIdx)}
                            id={`checkbox-${stepIdx}-${subIdx}`}
                          />
                          <label 
                            htmlFor={`checkbox-${stepIdx}-${subIdx}`}
                            className="checkbox-label"
                          >
                            <span
                              ref={el => subtaskRefs.current[`${stepIdx}-${subIdx}`] = el}
                              className={`editable-text ${editMode?.stepIdx === stepIdx && editMode?.subIdx === subIdx ? 'editing' : ''}`}
                              contentEditable={editMode?.stepIdx === stepIdx && editMode?.subIdx === subIdx}
                              onBlur={(e) => {
                                if (e.target.textContent.trim()) {
                                  const newProjects = [...projects];
                                  newProjects[currentProjectIdx].checklist[stepIdx].subtasks[subIdx].text = e.target.textContent;
                                  setProjects(newProjects);
                                } else {
                                  deleteSubtask(stepIdx, subIdx);
                                }
                                setEditMode(null);                
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  e.target.blur();
                                }
                              }}
                              onClick={(e) => {
                                if (!subtask.completed) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditMode({ stepIdx, subIdx });
                                  e.target.focus();
                                }
                              }}
                              suppressContentEditableWarning={true}
                              title={subtask.notes.trim() ? subtask.notes : ""} // For accessibility
                            >
                              {subtask.text}
                            </span>
                          </label>
                        </div>
                        
                        <div className="subtask-controls">
                          <select
                            value={subtask.priority}
                            onChange={(e) => updatePriority(stepIdx, subIdx, e.target.value)}
                            className={`priority-select priority-${subtask.priority}`}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          
                          <button 
                            onClick={() => moveSubtaskUp(stepIdx, subIdx)} 
                            className="icon-button" 
                            disabled={subIdx === 0}
                          >
                            <span role="img" aria-label="Move up">⬆️</span>
                          </button>
                          <button 
                            onClick={() => moveSubtaskDown(stepIdx, subIdx)} 
                            className="icon-button" 
                            disabled={subIdx === step.subtasks.length - 1}
                          >
                            <span role="img" aria-label="Move down">⬇️</span>
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditMode({ stepIdx, subIdx });
                              setTimeout(() => {
                                subtaskRefs.current[`${stepIdx}-${subIdx}`]?.focus();
                              }, 0);
                            }} 
                            className="icon-button edit-btn"
                            aria-label="Edit subtask"
                          >
                            <span role="img" aria-label="Edit">✏️</span>
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSubtask(stepIdx, subIdx);
                            }} 
                            className="icon-button delete-btn"
                            aria-label="Delete subtask"
                          >
                            <span role="img" aria-label="Delete">🗑️</span>
                          </button>
                        </div>
                      </div>
                      
                      <details>
                        <summary>Notes</summary>
                        <textarea
                          value={subtask.notes}
                          onChange={(e) => updateNotes(stepIdx, subIdx, e.target.value)}
                          placeholder="Add notes here..."
                        />
                        {subtask.timestamp && (
                          <p className="timestamp">Completed: {subtask.timestamp}</p>
                        )}
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <p>Once you delete a project, there is no going back. Please be certain.</p>
        <button 
          onClick={deleteProject}
          className="danger"
          aria-label="Delete current project"
        >
          Delete Project
        </button>
      </div>
      
      {showSnackbar && (
        <div className="snackbar">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
}

export default App;