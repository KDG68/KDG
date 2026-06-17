/* ==========================================================================
   SOFTZONE TECH UNIVERSE - AUTOMATION SIMULATOR CONTROLLER
   ========================================================================== */

(function() {
  let activeTemplate = null;
  let currentStepIndex = -1;
  let isRunning = false;
  let timeoutId = null;
  let initialized = false;
  
  // Stats counters state
  let simulatedCounts = {
    runs: 0,
    time: 0,
    accuracy: 0
  };

  // Cache DOM
  let container, tabContainer, controlBtn, resetBtn, consoleBody, statusDot;
  let desktopBoard, mobileBoard;

  function init() {
    container = document.getElementById("automation-simulation-section");
    tabContainer = document.getElementById("workflow-tabs-list");
    controlBtn = document.getElementById("run-simulation-btn");
    resetBtn = document.getElementById("reset-simulation-btn");
    consoleBody = document.getElementById("simulation-console-output");
    statusDot = document.getElementById("console-status-indicator");
    desktopBoard = document.getElementById("desktop-flow-board");
    mobileBoard = document.getElementById("mobile-flow-board");

    if (!container) return;

    if (initialized) {
      selectTemplate(activeTemplate ? activeTemplate.id : "cust-support");
      return;
    }

    setupEvents();
    initialized = true;
    
    // Select default template
    selectTemplate("cust-support");
  }

  function setupEvents() {
    controlBtn.addEventListener("click", toggleSimulation);
    resetBtn.addEventListener("click", resetSimulation);

    // Setup viewport observer to pause if scrolled out of view
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && isRunning) {
            pauseSimulation();
            logConsole("Hệ thống: Tạm dừng mô phỏng (Ngoài Viewport)", "warn");
          }
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }
  }

  function selectTemplate(templateId) {
    if (isRunning) {
      resetSimulation();
    }

    const template = window.AppData.workflows.find(w => w.id === templateId);
    if (!template) return;

    activeTemplate = template;
    currentStepIndex = -1;
    
    // Update active tab styling
    const tabBtns = tabContainer.querySelectorAll(".workflow-tab-btn");
    tabBtns.forEach(btn => {
      const active = btn.getAttribute("data-workflow") === templateId;
      btn.classList.toggle("active", active);
    });

    // Reset console
    consoleBody.innerHTML = `<div class="console-line"><span class="console-line-time">[00:00:00]</span> Hệ thống sẵn sàng. Nhấn "Chạy mô phỏng" để bắt đầu.</div>`;
    statusDot.className = "console-status-dot";
    
    // Reset stats display
    renderStats(template.results);

    // Render flowboards
    renderDesktopFlow(template);
    renderMobileFlow(template);

    // Toggle control button disabled states
    controlBtn.disabled = false;
    controlBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Chạy mô phỏng
    `;
    resetBtn.disabled = true;
  }

  function renderStats(results) {
    const runsBox = document.getElementById("stat-sim-runs");
    const timeBox = document.getElementById("stat-sim-time");
    const accuracyBox = document.getElementById("stat-sim-accuracy");

    if (runsBox && timeBox && accuracyBox) {
      runsBox.innerHTML = `
        <div class="stat-number text-cyan">${results[0].value}</div>
        <div class="stat-label">${results[0].label} <span class="text-green">${results[0].trend}</span></div>
      `;
      timeBox.innerHTML = `
        <div class="stat-number text-purple">${results[1].value}</div>
        <div class="stat-label">${results[1].label} <span class="text-green">${results[1].trend}</span></div>
      `;
      accuracyBox.innerHTML = `
        <div class="stat-number text-green">${results[2].value}</div>
        <div class="stat-label">${results[2].label} <span class="text-green">${results[2].trend}</span></div>
      `;
    }
  }

  // ==========================================================================
  // DESKTOP FLOW RENDERING
  // ==========================================================================
  function renderDesktopFlow(template) {
    if (!desktopBoard) return;

    const steps = template.steps;
    let nodesHtml = "";
    
    // Draw SVG connections
    let svgLinesHtml = "";
    const nodeCount = steps.length;
    
    // Calculate node coordinates. Assuming they are evenly spaced horizontally.
    // Board is roughly 600px wide. Center Y is around 140px.
    const boardWidth = 600;
    const startX = 60;
    const endX = 540;
    const spacing = (endX - startX) / (nodeCount - 1);
    const centerY = 120;

    steps.forEach((step, idx) => {
      const posX = startX + idx * spacing;
      
      // Node Markup
      nodesHtml += `
        <div class="flow-node-item state-idle" id="desktop-node-${idx}" style="left: ${posX - 50}px; position: absolute; top: 56px;">
          <div class="node-icon-wrapper">
            ${getIconSvg(step.icon)}
            <div class="node-status-badge">Idle</div>
          </div>
          <div class="node-label">${step.name}</div>
        </div>
      `;

      // Line connection from this node to next
      if (idx < nodeCount - 1) {
        const nextX = startX + (idx + 1) * spacing;
        const lineId = `desktop-line-${idx}`;
        
        svgLinesHtml += `
          <path class="flow-line" id="${lineId}-base" d="M ${posX + 32} ${centerY} L ${nextX - 32} ${centerY}" />
          <path class="flow-line-active" id="${lineId}-flow" d="M ${posX + 32} ${centerY} L ${nextX - 32} ${centerY}" />
        `;
      }
    });

    desktopBoard.innerHTML = `
      <svg class="flow-connection-svg">
        ${svgLinesHtml}
      </svg>
      ${nodesHtml}
    `;
  }

  // ==========================================================================
  // MOBILE FLOW RENDERING
  // ==========================================================================
  function renderMobileFlow(template) {
    if (!mobileBoard) return;

    let stepsHtml = "";
    template.steps.forEach((step, idx) => {
      stepsHtml += `
        <div class="mobile-timeline-step state-idle" id="mobile-node-${idx}">
          <div class="mobile-step-marker"></div>
          <div class="mobile-step-content">
            <div class="mobile-step-icon">
              ${getIconSvg(step.icon)}
            </div>
            <div class="mobile-step-info">
              <div class="mobile-step-label">${step.name}</div>
              <div class="mobile-step-status">Idle • ${step.time}</div>
            </div>
          </div>
        </div>
      `;
    });

    mobileBoard.innerHTML = `
      <div class="mobile-timeline">
        ${stepsHtml}
      </div>
    `;
  }

  // ==========================================================================
  // SIMULATION CYCLE LOOP
  // ==========================================================================
  function toggleSimulation() {
    if (isRunning) {
      pauseSimulation();
    } else {
      startSimulation();
    }
  }

  function startSimulation() {
    isRunning = true;
    controlBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      Tạm dừng
    `;
    resetBtn.disabled = false;
    statusDot.className = "console-status-dot active";
    logConsole("Hệ thống: Khởi chạy workflow mô phỏng...", "info");
    
    // Trigger next step
    runNextStep();
  }

  function pauseSimulation() {
    isRunning = false;
    controlBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Tiếp tục
    `;
    statusDot.className = "console-status-dot";
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  function resetSimulation() {
    isRunning = false;
    currentStepIndex = -1;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Reset visual nodes
    const stepsCount = activeTemplate.steps.length;
    for (let i = 0; i < stepsCount; i++) {
      updateNodeState(i, "idle");
      if (i < stepsCount - 1) {
        updateLineState(i, "idle");
      }
    }

    // Reset console
    consoleBody.innerHTML = `<div class="console-line"><span class="console-line-time">[00:00:00]</span> Hệ thống đã được thiết lập lại.</div>`;
    statusDot.className = "console-status-dot";

    controlBtn.disabled = false;
    controlBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Chạy mô phỏng
    `;
    resetBtn.disabled = true;
  }

  function runNextStep() {
    if (!isRunning) return;

    const steps = activeTemplate.steps;
    
    // If we were running a step, mark it as completed
    if (currentStepIndex >= 0) {
      updateNodeState(currentStepIndex, "completed");
      
      // Complete line connection to next node
      if (currentStepIndex < steps.length - 1) {
        updateLineState(currentStepIndex, "completed");
      }
    }

    currentStepIndex++;

    // Check if simulation completed
    if (currentStepIndex >= steps.length) {
      simulationComplete();
      return;
    }

    // Start active step
    const step = steps[currentStepIndex];
    updateNodeState(currentStepIndex, "running");

    // Output logs mapping to steps
    const stepLog = activeTemplate.logs[currentStepIndex] || `Chạy bước: ${step.name}...`;
    logConsole(stepLog);

    // Active line connection to next node
    if (currentStepIndex < steps.length - 1) {
      updateLineState(currentStepIndex, "running");
    }

    // Parse step time (e.g. "1.2s" -> 1200ms)
    const delay = parseFloat(step.time) * 1000;
    
    timeoutId = setTimeout(runNextStep, delay);
  }

  function simulationComplete() {
    isRunning = false;
    statusDot.className = "console-status-dot";
    controlBtn.disabled = true;
    controlBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Hoàn tất
    `;
    
    const successLog = activeTemplate.logs[activeTemplate.logs.length - 1] || "Hệ thống: Mô phỏng hoàn tất thành công!";
    logConsole(successLog, "success");
    logConsole("Hệ thống: Workflow kết thúc. Trạng thái: COMPLETED.", "success");

    // Show a success toast
    if (window.App && typeof window.App.showToast === "function") {
      window.App.showToast(`Mô phỏng "${activeTemplate.name}" thành công!`, "success");
    }
  }

  // Visual Updates helpers
  function updateNodeState(idx, state) {
    const desktopNode = document.getElementById(`desktop-node-${idx}`);
    const mobileNode = document.getElementById(`mobile-node-${idx}`);

    // State class map
    const statesList = ["state-idle", "state-waiting", "state-running", "state-completed"];
    const targetClass = `state-${state}`;

    if (desktopNode) {
      statesList.forEach(cls => desktopNode.classList.remove(cls));
      desktopNode.classList.add(targetClass);
      
      const badge = desktopNode.querySelector(".node-status-badge");
      if (badge) badge.innerText = state;
    }

    if (mobileNode) {
      statesList.forEach(cls => mobileNode.classList.remove(cls));
      mobileNode.classList.add(targetClass);

      const statusTxt = mobileNode.querySelector(".mobile-step-status");
      if (statusTxt) {
        statusTxt.innerText = `${state} • ${activeTemplate.steps[idx].time}`;
      }
    }
  }

  function updateLineState(idx, state) {
    const flowPath = document.getElementById(`desktop-line-${idx}-flow`);
    if (!flowPath) return;

    if (state === "running") {
      flowPath.classList.remove("completed");
      flowPath.classList.add("pulse");
    } else if (state === "completed") {
      flowPath.classList.remove("pulse");
      flowPath.classList.add("completed");
    } else {
      flowPath.classList.remove("pulse");
      flowPath.classList.remove("completed");
    }
  }

  function logConsole(message, type = "info") {
    if (!consoleBody) return;

    const time = new Date().toLocaleTimeString();
    let typeClass = "console-line-info";
    if (type === "success") typeClass = "console-line-success";
    if (type === "warn") typeClass = "console-line-warn";

    const line = document.createElement("div");
    line.className = "console-line";
    line.innerHTML = `<span class="console-line-time">[${time}]</span> <span class="${typeClass}">${message}</span>`;
    
    consoleBody.appendChild(line);
    
    // Auto Scroll to bottom
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  // Icons Helper
  function getIconSvg(name) {
    const icons = {
      "form": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
      "brain": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
      "database": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>`,
      "terminal": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
      "mail": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      "briefcase": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
      "search": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
      "filter": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
      "file-text": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      "clock": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
      "activity": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
      "user-check": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
      "image": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
      "share-2": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
      "download": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`
    };
    return icons[name] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }

  // Expose module functions
  window.WorkflowSimulator = {
    init,
    selectTemplate,
    resetSimulation
  };
})();
