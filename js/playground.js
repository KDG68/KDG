/* ============================================================
   SoftZone — Automation Playground Engine (js/playground.js)
   ============================================================ */

window.SoftwareStore = window.SoftwareStore || {};

SoftwareStore.Playground = (() => {
  const LOCAL_STORAGE_KEY = 'softzone_playground_state';

  // Node types available
  const NODE_TYPES = {
    trigger: { name: 'Lead Form', icon: 'file-text', category: 'trigger', colorClass: 'color-trigger', desc: 'Kích hoạt khi khách điền Form' },
    webhook: { name: 'Webhook API', icon: 'webhook', category: 'trigger', colorClass: 'color-trigger', desc: 'Kích hoạt khi nhận dữ liệu HTTP POST' },
    ai: { name: 'AI Generator', icon: 'brain', category: 'ai', colorClass: 'color-ai', desc: 'AI phân tích & viết nội dung tự động' },
    condition: { name: 'Kiểm Tra', icon: 'split', category: 'action', colorClass: 'color-action', desc: 'Phân loại khách hàng theo phễu' },
    crm: { name: 'Lưu CRM', icon: 'database', category: 'crm', colorClass: 'color-crm', desc: 'Tự động tạo bản ghi khách hàng mới' },
    mail: { name: 'Gửi Email', icon: 'send', category: 'notification', colorClass: 'color-notification', desc: 'Gửi thư phản hồi tự động' },
    chatbot: { name: 'Chatbot AI', icon: 'message-circle', category: 'ai', colorClass: 'color-ai', desc: 'Tự động trả lời thắc mắc khách hàng' },
    notify: { name: 'Báo Admin', icon: 'bell', category: 'notification', colorClass: 'color-notification', desc: 'Gửi tin nhắn Telegram/Slack báo đội ngũ' }
  };

  // Pre-configured templates
  const TEMPLATES = {
    'lead-automation': {
      name: 'Chăm Sóc Khách Hàng',
      nodes: [
        { id: 'n1', type: 'trigger', name: 'Lead Form', x: 50, y: 150, config: { title: 'Form Khách Hàng', active: true } },
        { id: 'n2', type: 'ai', name: 'AI Phân Tích', x: 270, y: 150, config: { prompt: 'Phân tích nhu cầu khách từ form và phân loại', active: true } },
        { id: 'n3', type: 'condition', name: 'Lead Score > 80?', x: 490, y: 150, config: { field: 'score', condition: 'gt', value: '80', active: true } },
        { id: 'n4', type: 'crm', name: 'Cập Nhật CRM', x: 710, y: 60, config: { database: 'CRM Pro', stage: 'Tiềm Năng Cao', active: true } },
        { id: 'n5', type: 'mail', name: 'Gửi Email VIP', x: 930, y: 60, config: { template: 'Email tư vấn chuyên sâu VIP', active: true } },
        { id: 'n6', type: 'notify', name: 'Báo Slack Admin', x: 930, y: 240, config: { webhook: 'Slack #leads-channel', active: true } }
      ],
      connections: [
        { id: 'c1', fromNodeId: 'n1', toNodeId: 'n2' },
        { id: 'c2', fromNodeId: 'n2', toNodeId: 'n3' },
        { id: 'c3', fromNodeId: 'n3', toNodeId: 'n4' },
        { id: 'c4', fromNodeId: 'n4', toNodeId: 'n5' },
        { id: 'c5', fromNodeId: 'n3', toNodeId: 'n6' }
      ]
    },
    'social-publish': {
      name: 'Đăng Bài Tự Động',
      nodes: [
        { id: 'n1', type: 'webhook', name: 'Lịch Đăng Bài', x: 50, y: 150, config: { title: 'Google Calendar API Trigger', active: true } },
        { id: 'n2', type: 'ai', name: 'AI Content Creator', x: 300, y: 150, config: { prompt: 'Tạo caption đăng bài Facebook & LinkedIn từ bài viết gốc', active: true } },
        { id: 'n3', type: 'notify', name: 'Đăng Đa Kênh', x: 580, y: 150, config: { platforms: ['Facebook', 'LinkedIn'], active: true } }
      ],
      connections: [
        { id: 'c1', fromNodeId: 'n1', toNodeId: 'n2' },
        { id: 'c2', fromNodeId: 'n2', toNodeId: 'n3' }
      ]
    },
    'chatbot-support': {
      name: 'Hỗ Trợ Khách Hàng AI',
      nodes: [
        { id: 'n1', type: 'webhook', name: 'Messenger Chat', x: 50, y: 150, config: { title: 'Facebook Page Inbox', active: true } },
        { id: 'n2', type: 'chatbot', name: 'Chatbot AI Support', x: 300, y: 150, config: { knowledge: 'SoftZone Guidebook PDF', active: true } },
        { id: 'n3', type: 'notify', name: 'Telegram Admin', x: 580, y: 150, config: { chat: 'Admin Group Chat', message: 'Chatbot chuyển giao việc tư vấn khó', active: true } }
      ],
      connections: [
        { id: 'c1', fromNodeId: 'n1', toNodeId: 'n2' },
        { id: 'c2', fromNodeId: 'n2', toNodeId: 'n3' }
      ]
    }
  };

  // State
  let state = {
    nodes: [],
    connections: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    selectedNodeId: null,
    selectedConnectionId: null,
    history: [],
    historyIndex: -1,
    isRunning: false
  };

  // Bounding rect for dragging
  let dragNodeId = null;
  let dragOffset = { x: 0, y: 0 };
  let activePortElement = null;
  let activePortFromNodeId = null;
  let canvasTranslate = { x: 0, y: 0 };
  let isPanning = false;
  let panStart = { x: 0, y: 0 };

  // Results Stats
  let resultsState = {
    completedTasks: 0,
    savedMinutes: 0,
    leadsProcessed: 0,
    emailsSent: 0,
    recordsCreated: 0
  };

  // Logs List
  let logsList = [];

  function loadState() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.nodes = parsed.nodes || [];
        state.connections = parsed.connections || [];
      } else {
        // Load default template
        loadTemplate('lead-automation', false);
      }
    } catch {
      loadTemplate('lead-automation', false);
    }
  }

  function saveState() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      nodes: state.nodes,
      connections: state.connections
    }));
    const statusEl = document.getElementById('playground-save-status');
    if (statusEl) {
      statusEl.innerHTML = '<i data-lucide="check-circle"></i> Đã tự động lưu';
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [statusEl] });
    }
  }

  function loadTemplate(templateId, notify = true) {
    const template = TEMPLATES[templateId];
    if (template) {
      // deep copy
      state.nodes = JSON.parse(JSON.stringify(template.nodes));
      state.connections = JSON.parse(JSON.stringify(template.connections));
      state.selectedNodeId = null;
      state.selectedConnectionId = null;
      
      // reset zoom & pan
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
      
      saveState();
      
      if (notify && SoftwareStore.Utils) {
        SoftwareStore.Utils.showToast(`Đã tải workflow mẫu: ${template.name}`, 'info');
      }
    }
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="playground-container" id="softzone-playground-app">
        <!-- TOP TOOLBAR -->
        <div class="playground-header">
          <div class="playground-header__title">
            <i data-lucide="cpu" style="width: 20px; height: 20px;"></i>
            <span class="playground-header__name">SoftZone Playground</span>
            <span class="playground-header__status saved" id="playground-save-status">
              <i data-lucide="check-circle"></i> Đã tự động lưu
            </span>
          </div>

          <div class="playground-header__controls">
            <select class="settings-input" id="template-select" style="width: 180px; padding: 0.35rem 0.5rem;" onchange="SoftwareStore.Playground.handleTemplateChange(this.value)">
              <option value="lead-automation" selected>Mẫu: Chăm sóc khách</option>
              <option value="social-publish">Mẫu: Đăng bài tự động</option>
              <option value="chatbot-support">Mẫu: Hỗ trợ khách AI</option>
            </select>
            
            <button class="playground-header__btn btn--outline" onclick="SoftwareStore.Playground.resetToDefault()" title="Khôi phục mặc định">
              <i data-lucide="rotate-ccw"></i>
            </button>
            <button class="playground-header__btn btn--outline" onclick="SoftwareStore.Playground.deleteSelected()" title="Xóa phần tử đang chọn">
              <i data-lucide="trash-2"></i> Xóa
            </button>
            
            <button class="playground-header__btn playground-header__btn--run" id="btn-run-simulation" onclick="SoftwareStore.Playground.runSimulation()">
              <i data-lucide="play"></i> Chạy thử
            </button>
          </div>
        </div>

        <!-- MAIN WORKSPACE -->
        <div class="playground-workspace">
          
          <!-- LEFT SIDEBAR: DRAG NODES -->
          <div class="node-sidebar">
            <div class="sidebar-section">
              <h3 class="sidebar-section__title">Kéo thả node vào canvas</h3>
            </div>
            <div class="node-list">
              ${Object.entries(NODE_TYPES).map(([type, value]) => `
                <div class="sidebar-node-item" draggable="true" data-node-type="${type}" 
                     ondragstart="SoftwareStore.Playground.handleSidebarDragStart(event)"
                     onclick="SoftwareStore.Playground.handleSidebarNodeClick('${type}')">
                  <div class="sidebar-node-item__icon ${value.colorClass}">
                    <i data-lucide="${value.icon}"></i>
                  </div>
                  <div class="sidebar-node-item__name">${value.name}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CENTER CANVAS -->
          <div class="workflow-canvas" id="canvas-container" 
               onmousedown="SoftwareStore.Playground.handleCanvasMouseDown(event)"
               onmousemove="SoftwareStore.Playground.handleCanvasMouseMove(event)"
               onmouseup="SoftwareStore.Playground.handleCanvasMouseUp(event)"
               ondragover="event.preventDefault()"
               ondrop="SoftwareStore.Playground.handleCanvasDrop(event)">
            
            <div class="canvas-transform" id="canvas-transform" style="transform: translate(0px, 0px) scale(1);">
              <!-- Connection SVG wires -->
              <svg class="canvas-svg" id="canvas-svg-wires">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
                  </marker>
                  <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cyan)" />
                  </marker>
                </defs>
              </svg>

              <!-- Dynamic nodes list container -->
              <div id="nodes-layer"></div>
            </div>

            <!-- Toolbar buttons (zoom, fit) -->
            <div class="canvas-toolbar">
              <button class="canvas-toolbar__btn" onclick="SoftwareStore.Playground.handleZoom(0.1)" title="Phóng to"><i data-lucide="zoom-in"></i></button>
              <button class="canvas-toolbar__btn" onclick="SoftwareStore.Playground.handleZoom(-0.1)" title="Thu nhỏ"><i data-lucide="zoom-out"></i></button>
              <button class="canvas-toolbar__btn" onclick="SoftwareStore.Playground.handleFitScreen()" title="Căn giữa"><i data-lucide="maximize-2"></i></button>
            </div>
          </div>

          <!-- RIGHT SIDEBAR: NODE PROPERTIES & ADS -->
          <div class="settings-panel" id="settings-panel">
            <div class="settings-panel__header">
              <i data-lucide="settings"></i> Cấu hình Node
            </div>
            <div class="settings-panel__content" id="settings-panel-content">
              <!-- Content gets rendered dynamically when a node is clicked -->
              <div class="settings-empty">
                <i data-lucide="mouse-pointer"></i>
                <p>Click chọn một node trong canvas để thiết lập cấu hình & xem phần mềm đề xuất tương ứng.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTTOM DASHBOARD & LOGS -->
        <div class="playground-footer">
          <!-- Results stats -->
          <div class="results-dashboard">
            <div class="result-stat">
              <span class="result-stat__val" id="stat-tasks">0</span>
              <span class="result-stat__label">Tác vụ hoàn thành</span>
            </div>
            <div class="result-stat">
              <span class="result-stat__val" id="stat-minutes">0m</span>
              <span class="result-stat__label">Thời gian tiết kiệm</span>
            </div>
            <div class="result-stat">
              <span class="result-stat__val" id="stat-leads">0</span>
              <span class="result-stat__label">Lead được xử lý</span>
            </div>
          </div>

          <!-- Running execution logs -->
          <div class="execution-log" id="execution-log-container">
            <div class="log-entry log-entry--info">> Hệ thống đã sẵn sàng chạy thử workflow...</div>
          </div>
        </div>

        <!-- MOBILE NAVIGATION TABS (visible only on <=768px screens) -->
        <div class="playground-mobile-actions">
          <button class="playground-mobile-action-btn" id="p-mob-btn-nodes" onclick="SoftwareStore.Playground.toggleMobilePanel('nodes')">
            <i data-lucide="plus-circle"></i><span>Thêm Node</span>
          </button>
          <button class="playground-mobile-action-btn" id="p-mob-btn-settings" onclick="SoftwareStore.Playground.toggleMobilePanel('settings')">
            <i data-lucide="sliders"></i><span>Cấu Hình</span>
          </button>
          <button class="playground-mobile-action-btn" id="p-mob-btn-logs" onclick="SoftwareStore.Playground.toggleMobilePanel('logs')">
            <i data-lucide="terminal"></i><span>Nhật Ký</span>
          </button>
        </div>
      </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [container] });
    
    // Initial nodes & connections drawing
    drawNodes();
    drawConnections();
  }

  // Draw active nodes on canvas
  function drawNodes() {
    const nodesLayer = document.getElementById('nodes-layer');
    if (!nodesLayer) return;

    nodesLayer.innerHTML = state.nodes.map(node => {
      const value = NODE_TYPES[node.type] || NODE_TYPES.trigger;
      const isSelected = state.selectedNodeId === node.id ? 'selected' : '';
      const runClass = node.status || ''; // running, completed, error
      
      let statusIcon = '';
      if (node.status === 'running') statusIcon = '<i data-lucide="refresh-cw" class="node-header__status-icon spinning"></i>';
      if (node.status === 'completed') statusIcon = '<i data-lucide="check-circle" class="node-header__status-icon done"></i>';
      if (node.status === 'error') statusIcon = '<i data-lucide="alert-circle" class="node-header__status-icon err"></i>';

      return `
        <div class="canvas-node ${isSelected} ${runClass}" 
             id="node-${node.id}"
             style="transform: translate(${node.x}px, ${node.y}px);"
             onmousedown="SoftwareStore.Playground.handleNodeMouseDown(event, '${node.id}')"
             onclick="SoftwareStore.Playground.handleNodeClick(event, '${node.id}')">
             
          <div class="node-header ${value.colorClass}">
            <i class="node-header__icon" data-lucide="${value.icon}"></i>
            <span class="node-header__name">${node.name}</span>
            <span id="node-status-icon-${node.id}">${statusIcon}</span>
          </div>
          
          <div class="node-body">
            ${getNodePreviewText(node)}
          </div>

          <!-- Connection Ports -->
          ${node.type !== 'trigger' && node.type !== 'webhook' ? `
            <div class="node-port node-port--input" 
                 onmousedown="SoftwareStore.Playground.handlePortMouseDown(event, '${node.id}', 'input')"
                 title="Cổng vào"></div>
          ` : ''}
          
          <div class="node-port node-port--output" 
               onmousedown="SoftwareStore.Playground.handlePortMouseDown(event, '${node.id}', 'output')"
               title="Cổng ra"></div>
        </div>
      `;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [nodesLayer] });
  }

  function getNodePreviewText(node) {
    if (!node.config) return 'Idle';
    if (node.type === 'trigger') return node.config.title || 'Mẫu lead mới';
    if (node.type === 'webhook') return 'Webhook URL: /leads/webhook';
    if (node.type === 'ai') return SoftwareStore.Utils.truncateText(node.config.prompt || 'Chưa thiết lập prompt', 60);
    if (node.type === 'condition') return `Kiểm tra: ${node.config.field || 'score'} > ${node.config.value || '80'}`;
    if (node.type === 'crm') return `Lưu vào ${node.config.database || 'CRM'} (${node.config.stage || 'Mới'})`;
    if (node.type === 'mail') return `Mẫu: ${node.config.template || 'Default Template'}`;
    if (node.type === 'chatbot') return `Dữ liệu: ${node.config.knowledge || 'File hướng dẫn'}`;
    if (node.type === 'notify') return `Gửi đi: ${node.config.webhook || 'Slack/Telegram'}`;
    return 'Ready';
  }

  // Draw connections (wires)
  function drawConnections() {
    const svgEl = document.getElementById('canvas-svg-wires');
    if (!svgEl) return;

    // Remove old lines but keep definitions
    const paths = svgEl.querySelectorAll('path');
    paths.forEach(p => p.remove());

    state.connections.forEach(conn => {
      const fromNode = state.nodes.find(n => n.id === conn.fromNodeId);
      const toNode = state.nodes.find(n => n.id === conn.toNodeId);
      if (!fromNode || !toNode) return;

      // Output coordinates
      const x1 = fromNode.x + 180; // node width
      const y1 = fromNode.y + 45;  // half node height
      
      // Input coordinates
      const x2 = toNode.x;
      const y2 = toNode.y + 45;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const isSelected = state.selectedConnectionId === conn.id ? 'selected' : '';
      
      // Cubic Bezier curve
      const dx = Math.abs(x2 - x1) * 0.5;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      path.setAttribute('d', d);
      path.setAttribute('class', `svg-connection ${isSelected}`);
      path.setAttribute('id', `conn-${conn.id}`);
      path.setAttribute('marker-end', isSelected ? 'url(#arrow-active)' : 'url(#arrow)');
      path.addEventListener('click', (e) => {
        e.stopPropagation();
        SoftwareStore.Playground.handleConnectionClick(conn.id);
      });

      svgEl.appendChild(path);
    });
  }

  // Drag-and-drop triggers
  function handleSidebarDragStart(e) {
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.nodeType);
  }

  function handleCanvasDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!NODE_TYPES[type]) return;

    const container = document.getElementById('canvas-container');
    const transformEl = document.getElementById('canvas-transform');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    
    // Account for zoom and pan offsets
    const x = (e.clientX - rect.left - state.panX) / state.zoom - 90;
    const y = (e.clientY - rect.top - state.panY) / state.zoom - 25;

    const newNode = {
      id: 'n_' + SoftwareStore.Utils.generateId().slice(0, 6),
      type: type,
      name: NODE_TYPES[type].name,
      x: Math.round(x),
      y: Math.round(y),
      config: getDefaultNodeConfig(type),
      status: 'idle'
    };

    state.nodes.push(newNode);
    saveState();
    drawNodes();
    
    // Select the newly dropped node
    selectNode(newNode.id);
  }

  function getDefaultNodeConfig(type) {
    if (type === 'trigger') return { title: 'Form Khách Hàng', active: true };
    if (type === 'webhook') return { url: '/leads/webhook', active: true };
    if (type === 'ai') return { prompt: 'Tóm tắt nội dung và phân tích tâm lý khách hàng', active: true };
    if (type === 'condition') return { field: 'score', condition: 'gt', value: '80', active: true };
    if (type === 'crm') return { database: 'CRM Pro', stage: 'Mới', active: true };
    if (type === 'mail') return { template: 'Email chào mừng khách hàng', active: true };
    if (type === 'chatbot') return { knowledge: 'Website FAQ Doc', active: true };
    if (type === 'notify') return { webhook: 'Slack #general', message: 'Hệ thống nhận lead mới!', active: true };
    return { active: true };
  }

  // Node Drag
  function handleNodeMouseDown(e, nodeId) {
    if (e.target.classList.contains('node-port')) return; // Ignore if port clicked
    e.stopPropagation();
    
    dragNodeId = nodeId;
    const node = state.nodes.find(n => n.id === nodeId);
    if (node) {
      dragOffset.x = (e.clientX / state.zoom) - node.x;
      dragOffset.y = (e.clientY / state.zoom) - node.y;
    }
  }

  function handlePortMouseDown(e, nodeId, portType) {
    e.stopPropagation();
    e.preventDefault();

    activePortFromNodeId = nodeId;
    
    const svgEl = document.getElementById('canvas-svg-wires');
    if (!svgEl) return;

    // Create a temporary link line
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('id', 'temp-link');
    tempPath.setAttribute('stroke', 'var(--cyan)');
    tempPath.setAttribute('stroke-width', '3');
    tempPath.setAttribute('fill', 'none');
    tempPath.setAttribute('stroke-dasharray', '5, 5');
    svgEl.appendChild(tempPath);

    activePortElement = tempPath;
  }

  // Canvas Drag / Panning
  function handleCanvasMouseDown(e) {
    // Slide down all mobile sheets when interacting with the canvas
    if (window.innerWidth <= 768) {
      closeAllMobilePanels();
    }

    if (e.target.id === 'canvas-container' || e.target.classList.contains('canvas-svg')) {
      isPanning = true;
      panStart.x = e.clientX - state.panX;
      panStart.y = e.clientY - state.panY;
      
      // Deselect all
      state.selectedNodeId = null;
      state.selectedConnectionId = null;
      drawNodes();
      drawConnections();
      renderSettingsPanel();
    }
  }

  function handleCanvasMouseMove(e) {
    const transformEl = document.getElementById('canvas-transform');
    if (!transformEl) return;

    // Panning canvas
    if (isPanning) {
      state.panX = e.clientX - panStart.x;
      state.panY = e.clientY - panStart.y;
      transformEl.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
      return;
    }

    // Dragging node
    if (dragNodeId) {
      const node = state.nodes.find(n => n.id === dragNodeId);
      if (node) {
        node.x = Math.round((e.clientX / state.zoom) - dragOffset.x);
        node.y = Math.round((e.clientY / state.zoom) - dragOffset.y);
        
        // Boundaries
        node.x = Math.max(0, Math.min(node.x, 2500));
        node.y = Math.max(0, Math.min(node.y, 1500));

        const nodeEl = document.getElementById(`node-${dragNodeId}`);
        if (nodeEl) {
          nodeEl.style.transform = `translate(${node.x}px, ${node.y}px)`;
        }
        drawConnections();
      }
      return;
    }

    // Creating port connection line
    if (activePortElement && activePortFromNodeId) {
      const fromNode = state.nodes.find(n => n.id === activePortFromNodeId);
      if (!fromNode) return;

      const rect = document.getElementById('canvas-container').getBoundingClientRect();
      
      const x1 = fromNode.x + 180;
      const y1 = fromNode.y + 45;
      
      const mouseX = (e.clientX - rect.left - state.panX) / state.zoom;
      const mouseY = (e.clientY - rect.top - state.panY) / state.zoom;

      const dx = Math.abs(mouseX - x1) * 0.5;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${mouseX - dx} ${mouseY}, ${mouseX} ${mouseY}`;
      activePortElement.setAttribute('d', d);
    }
  }

  function handleCanvasMouseUp(e) {
    if (isPanning) {
      isPanning = false;
      saveState();
    }

    if (dragNodeId) {
      dragNodeId = null;
      saveState();
    }

    // Handle wire connection dropping
    if (activePortElement && activePortFromNodeId) {
      activePortElement.remove();
      activePortElement = null;

      // Check if dropped on a port input
      const portEl = e.target.closest('.node-port--input');
      if (portEl) {
        const toNodeEl = portEl.closest('.canvas-node');
        if (toNodeEl) {
          const toNodeId = toNodeEl.id.replace('node-', '');
          if (toNodeId !== activePortFromNodeId) {
            // Check if connection already exists
            const exists = state.connections.find(
              c => c.fromNodeId === activePortFromNodeId && c.toNodeId === toNodeId
            );
            if (!exists) {
              const newConn = {
                id: 'c_' + SoftwareStore.Utils.generateId().slice(0, 6),
                fromNodeId: activePortFromNodeId,
                toNodeId: toNodeId
              };
              state.connections.push(newConn);
              saveState();
              drawConnections();
            }
          }
        }
      }
      activePortFromNodeId = null;
    }
  }

  // Node Clicking
  function handleNodeClick(e, nodeId) {
    e.stopPropagation();
    selectNode(nodeId);
  }

  function selectNode(nodeId) {
    state.selectedNodeId = nodeId;
    state.selectedConnectionId = null;
    drawNodes();
    drawConnections();
    renderSettingsPanel();

    // Auto-open settings sheet on mobile
    if (window.innerWidth <= 768 && nodeId) {
      const container = document.getElementById('softzone-playground-app');
      if (container) {
        container.classList.add('show-settings-sheet');
        container.classList.remove('show-nodes-drawer', 'show-logs-sheet');
        updateMobileNavButtons('settings', true);
      }
    }
  }

  function handleConnectionClick(connId) {
    state.selectedConnectionId = connId;
    state.selectedNodeId = null;
    drawNodes();
    drawConnections();
    renderSettingsPanel();

    // Auto-open settings sheet on mobile
    if (window.innerWidth <= 768 && connId) {
      const container = document.getElementById('softzone-playground-app');
      if (container) {
        container.classList.add('show-settings-sheet');
        container.classList.remove('show-nodes-drawer', 'show-logs-sheet');
        updateMobileNavButtons('settings', true);
      }
    }
  }

  // Delete active selections
  function deleteSelected() {
    if (state.selectedNodeId) {
      // Remove node
      state.nodes = state.nodes.filter(n => n.id !== state.selectedNodeId);
      // Remove related connections
      state.connections = state.connections.filter(
        c => c.fromNodeId !== state.selectedNodeId && c.toNodeId !== state.selectedNodeId
      );
      state.selectedNodeId = null;
      saveState();
      drawNodes();
      drawConnections();
      renderSettingsPanel();
      SoftwareStore.Utils.showToast('Đã xóa node', 'info');
    } else if (state.selectedConnectionId) {
      // Remove connection
      state.connections = state.connections.filter(c => c.id !== state.selectedConnectionId);
      state.selectedConnectionId = null;
      saveState();
      drawConnections();
      renderSettingsPanel();
      SoftwareStore.Utils.showToast('Đã xóa dây nối', 'info');
    } else {
      SoftwareStore.Utils.showToast('Hãy chọn một node hoặc dây nối để xóa!', 'warning');
    }
  }

  // Right sidebar details rendering
  function renderSettingsPanel() {
    const panelContent = document.getElementById('settings-panel-content');
    if (!panelContent) return;

    if (state.selectedNodeId) {
      const node = state.nodes.find(n => n.id === state.selectedNodeId);
      if (!node) return;

      const details = NODE_TYPES[node.type];
      
      // Get related product recommendation based on category
      const relatedProduct = getProductRecommendation(node.type);

      panelContent.innerHTML = `
        <div class="settings-group">
          <label>Loại Node</label>
          <div style="font-weight: 600; color: #fff; font-size: 0.95rem; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="${details.icon}" class="${details.colorClass}"></i> ${details.name}
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${details.desc}</span>
        </div>

        <div class="settings-group">
          <label for="node-edit-name">Tên hiển thị</label>
          <input type="text" class="settings-input" id="node-edit-name" value="${node.name}" oninput="SoftwareStore.Playground.updateNodeProp('name', this.value)">
        </div>

        ${renderNodeSpecificSettings(node)}

        <div class="settings-group" style="flex-direction:row; justify-content:space-between; align-items:center;">
          <label for="node-edit-active" style="cursor:pointer;">Kích hoạt Node</label>
          <input type="checkbox" id="node-edit-active" ${node.config.active ? 'checked' : ''} 
                 style="width: 16px; height: 16px; accent-color: var(--purple);" 
                 onchange="SoftwareStore.Playground.updateNodeConfig('active', this.checked)">
        </div>

        <!-- RELATED SOFTWARE PROMO -->
        ${relatedProduct ? `
          <div class="related-products-box">
            <h4 class="related-products-title"><i data-lucide="shopping-bag" style="width:12px; height:12px; display:inline; vertical-align:middle; margin-right:4px;"></i> Phần mềm khuyên dùng</h4>
            <div class="mini-product-card">
              <div class="mini-product-card__icon">${relatedProduct.icon}</div>
              <div class="mini-product-card__info">
                <h5 class="mini-product-card__name">${relatedProduct.name}</h5>
                <span class="mini-product-card__price">${SoftwareStore.Utils.formatCurrency(relatedProduct.plans.find(p => p.type === 'pro').price)}/tháng</span>
              </div>
              <button class="mini-product-card__btn" data-action="addToCart" data-product-id="${relatedProduct.id}" data-plan="pro">
                <i data-lucide="shopping-cart"></i> Mua
              </button>
            </div>
            <a href="#/product/${relatedProduct.id}" class="btn btn--ghost btn--sm" style="width: 100%; text-align: center; font-size: 0.75rem; padding: 0.4rem;">Xem Chi Tiết Mua Bản Quyền</a>
          </div>
        ` : ''}
      `;

      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [panelContent] });

    } else if (state.selectedConnectionId) {
      const conn = state.connections.find(c => c.id === state.selectedConnectionId);
      const fromNode = state.nodes.find(n => n.id === conn?.fromNodeId);
      const toNode = state.nodes.find(n => n.id === conn?.toNodeId);

      panelContent.innerHTML = `
        <div class="settings-group">
          <label>Thông tin Dây Nối</label>
          <div style="font-size:0.85rem; color:#fff; line-height:1.6;">
            Từ Node: <strong>${fromNode ? fromNode.name : 'Unknown'}</strong><br>
            Đến Node: <strong>${toNode ? toNode.name : 'Unknown'}</strong>
          </div>
        </div>
        <p style="font-size:0.75rem; color:var(--text-muted);">Dây nối truyền dữ liệu từ cổng ra (output) của node trước sang cổng vào (input) của node sau.</p>
        <button class="btn btn--danger btn--sm" style="width:100%; margin-top:2rem;" onclick="SoftwareStore.Playground.deleteSelected()">
          <i data-lucide="trash-2"></i> Xóa Dây Nối này
        </button>
      `;

      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [panelContent] });

    } else {
      panelContent.innerHTML = `
        <div class="settings-empty">
          <i data-lucide="mouse-pointer"></i>
          <p>Click chọn một node trong canvas để thiết lập cấu hình & xem phần mềm đề xuất tương ứng.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [panelContent] });
    }
  }

  function getProductRecommendation(nodeType) {
    const { Data } = SoftwareStore;
    // Map node category to a product ID
    if (nodeType === 'ai') return Data.products.find(p => p.id === 20); // AI Content Flow
    if (nodeType === 'chatbot') return Data.products.find(p => p.id === 24); // Chatbot Support Pro
    if (nodeType === 'crm') return Data.products.find(p => p.id === 21); // CRM Automation Pro
    if (nodeType === 'notify' || nodeType === 'mail') return Data.products.find(p => p.id === 22); // Social Auto Manager or emailcraft
    if (nodeType === 'trigger' || nodeType === 'webhook') return Data.products.find(p => p.id === 23); // Data Scraping
    return null;
  }

  function renderNodeSpecificSettings(node) {
    if (node.type === 'trigger') {
      return `
        <div class="settings-group">
          <label for="node-edit-title">Nguồn biểu mẫu</label>
          <input type="text" class="settings-input" id="node-edit-title" value="${node.config.title || ''}" oninput="SoftwareStore.Playground.updateNodeConfig('title', this.value)">
        </div>
      `;
    }
    if (node.type === 'webhook') {
      return `
        <div class="settings-group">
          <label for="node-edit-url">Đường dẫn Webhook URL</label>
          <input type="text" class="settings-input" id="node-edit-url" value="${node.config.url || ''}" oninput="SoftwareStore.Playground.updateNodeConfig('url', this.value)" readonly>
          <span style="font-size:0.65rem; color:var(--text-muted)">Webhook nhận tự động từ các dịch vụ bên ngoài</span>
        </div>
      `;
    }
    if (node.type === 'ai') {
      return `
        <div class="settings-group">
          <label for="node-edit-prompt">AI Prompt Yêu Cầu</label>
          <textarea class="settings-input" id="node-edit-prompt" rows="4" style="resize:vertical;" oninput="SoftwareStore.Playground.updateNodeConfig('prompt', this.value)">${node.config.prompt || ''}</textarea>
        </div>
      `;
    }
    if (node.type === 'condition') {
      return `
        <div class="settings-group">
          <label for="node-edit-field">Trường dữ liệu</label>
          <input type="text" class="settings-input" id="node-edit-field" value="${node.config.field || 'score'}" oninput="SoftwareStore.Playground.updateNodeConfig('field', this.value)">
        </div>
        <div class="settings-group">
          <label for="node-edit-val">Giá trị so sánh</label>
          <input type="text" class="settings-input" id="node-edit-val" value="${node.config.value || '80'}" oninput="SoftwareStore.Playground.updateNodeConfig('value', this.value)">
        </div>
      `;
    }
    if (node.type === 'crm') {
      return `
        <div class="settings-group">
          <label for="node-edit-db">Bảng cơ sở dữ liệu CRM</label>
          <input type="text" class="settings-input" id="node-edit-db" value="${node.config.database || 'CRM Pro'}" oninput="SoftwareStore.Playground.updateNodeConfig('database', this.value)">
        </div>
        <div class="settings-group">
          <label for="node-edit-stage">Bước phễu (Stage)</label>
          <input type="text" class="settings-input" id="node-edit-stage" value="${node.config.stage || 'Mới'}" oninput="SoftwareStore.Playground.updateNodeConfig('stage', this.value)">
        </div>
      `;
    }
    if (node.type === 'mail') {
      return `
        <div class="settings-group">
          <label for="node-edit-template">Mẫu email soạn sẵn</label>
          <input type="text" class="settings-input" id="node-edit-template" value="${node.config.template || 'Chào mừng khách hàng mới'}" oninput="SoftwareStore.Playground.updateNodeConfig('template', this.value)">
        </div>
      `;
    }
    if (node.type === 'chatbot') {
      return `
        <div class="settings-group">
          <label for="node-edit-knowledge">Tài liệu huấn luyện AI</label>
          <input type="text" class="settings-input" id="node-edit-knowledge" value="${node.config.knowledge || 'Tài liệu hướng dẫn'}" oninput="SoftwareStore.Playground.updateNodeConfig('knowledge', this.value)">
        </div>
      `;
    }
    if (node.type === 'notify') {
      return `
        <div class="settings-group">
          <label for="node-edit-webh">Kênh nhận báo cáo (Slack/Tele)</label>
          <input type="text" class="settings-input" id="node-edit-webh" value="${node.config.webhook || 'Slack #leads'}" oninput="SoftwareStore.Playground.updateNodeConfig('webhook', this.value)">
        </div>
      `;
    }
    return '';
  }

  function updateNodeProp(prop, val) {
    if (state.selectedNodeId) {
      const node = state.nodes.find(n => n.id === state.selectedNodeId);
      if (node) {
        node[prop] = val;
        
        // update header directly
        const nodeEl = document.getElementById(`node-${node.id}`);
        if (nodeEl) {
          const nameEl = nodeEl.querySelector('.node-header__name');
          if (nameEl) nameEl.textContent = val;
        }
        saveState();
      }
    }
  }

  function updateNodeConfig(key, val) {
    if (state.selectedNodeId) {
      const node = state.nodes.find(n => n.id === state.selectedNodeId);
      if (node && node.config) {
        node.config[key] = val;
        
        // update body preview text
        const nodeEl = document.getElementById(`node-${node.id}`);
        if (nodeEl) {
          const bodyEl = nodeEl.querySelector('.node-body');
          if (bodyEl) bodyEl.innerHTML = getNodePreviewText(node);
        }
        saveState();
      }
    }
  }

  // Zoom canvas
  function handleZoom(amount) {
    state.zoom = Math.max(0.5, Math.min(2.0, state.zoom + amount));
    const transformEl = document.getElementById('canvas-transform');
    if (transformEl) {
      transformEl.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    }
  }

  // Fit screen / reset pan and zoom
  function handleFitScreen() {
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    const transformEl = document.getElementById('canvas-transform');
    if (transformEl) {
      transformEl.style.transform = `translate(0px, 0px) scale(1)`;
    }
  }

  // Mẫu template select
  function handleTemplateChange(templateId) {
    loadTemplate(templateId);
    drawNodes();
    drawConnections();
  }

  // Reset to default
  function resetToDefault() {
    const select = document.getElementById('template-select');
    const templateId = select ? select.value : 'lead-automation';
    loadTemplate(templateId, true);
    drawNodes();
    drawConnections();
    renderSettingsPanel();
  }

  // ============================================================
  // WORKFLOW RUNNER SIMULATION
  // ============================================================
  function runSimulation() {
    if (state.isRunning) return;
    state.isRunning = true;

    const btnRun = document.getElementById('btn-run-simulation');
    if (btnRun) {
      btnRun.classList.add('running');
      btnRun.innerHTML = '<i data-lucide="loader-2" class="node-header__status-icon spinning" style="width:12px;"></i> Đang chạy...';
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btnRun] });
    }

    // Reset status icons on all nodes
    state.nodes.forEach(n => {
      n.status = 'idle';
      const statusIcon = document.getElementById(`node-status-icon-${n.id}`);
      if (statusIcon) statusIcon.innerHTML = '';
      
      const nodeEl = document.getElementById(`node-${n.id}`);
      if (nodeEl) nodeEl.className = `canvas-node ${state.selectedNodeId === n.id ? 'selected' : ''}`;
    });

    // Reset dashboard results
    resultsState = { completedTasks: 0, savedMinutes: 0, leadsProcessed: 0, emailsSent: 0, recordsCreated: 0 };
    updateStatsHTML();

    // Clear logs
    logsList = [];
    const logContainer = document.getElementById('execution-log-container');
    if (logContainer) logContainer.innerHTML = '';

    addLog('Khởi chạy tiến trình mô phỏng tự động hóa...', 'info');

    // Find trigger node
    const triggerNode = state.nodes.find(n => n.type === 'trigger' || n.type === 'webhook');
    if (!triggerNode) {
      addLog('LỖI: Không tìm thấy Node Kích Hoạt (Form/Webhook) để bắt đầu!', 'error');
      endSimulation(false);
      return;
    }

    // Process nodes recursively based on connections
    let queue = [{ nodeId: triggerNode.id, delay: 200 }];
    
    function runNextNode() {
      if (queue.length === 0) {
        endSimulation(true);
        return;
      }

      const current = queue.shift();
      const node = state.nodes.find(n => n.id === current.nodeId);
      if (!node) {
        runNextNode();
        return;
      }

      // Mark running
      node.status = 'running';
      updateNodeStatusUI(node.id, 'running');
      addLog(`Đang chạy: Node [${node.name}]...`, 'running');

      // Update statistics depending on node type
      setTimeout(() => {
        // Run completed
        node.status = 'completed';
        updateNodeStatusUI(node.id, 'completed');
        
        let logMsg = `Hoàn thành Node [${node.name}]`;
        
        // Update stats and messages
        resultsState.completedTasks++;
        resultsState.savedMinutes += Math.floor(Math.random() * 3) + 2;

        if (node.type === 'trigger' || node.type === 'webhook') {
          resultsState.leadsProcessed++;
          logMsg = `[Form] Đã thu nhận thông tin khách hàng: Nguyễn Minh, Email: minh@example.com`;
        } else if (node.type === 'ai') {
          logMsg = `[AI Core] Phân tích hoàn tất: Phát hiện nhu cầu "Automation Pro", Độ khớp: 92%, Loại Lead: VIP`;
        } else if (node.type === 'crm') {
          resultsState.recordsCreated++;
          logMsg = `[CRM] Lưu thành công lead "Nguyễn Minh" vào bảng Khách hàng Tiềm Năng`;
        } else if (node.type === 'mail') {
          resultsState.emailsSent++;
          logMsg = `[Email] Đã gửi thư cảm ơn tự động tới khách hàng: minh@example.com`;
        } else if (node.type === 'chatbot') {
          logMsg = `[Chatbot] Đã trả lời tự động câu hỏi khách hàng dựa trên FAQ Guidebook`;
        } else if (node.type === 'notify') {
          logMsg = `[Notification] Đã gửi thông báo webhook tới kênh Slack quản trị thành công.`;
        }

        addLog(logMsg, 'success');
        updateStatsHTML();

        // Pulsing active connections leading from this node
        const outgoingConns = state.connections.filter(c => c.fromNodeId === node.id);
        outgoingConns.forEach(conn => {
          const pathEl = document.getElementById(`conn-${conn.id}`);
          if (pathEl) {
            pathEl.classList.add('active-pulse');
            setTimeout(() => pathEl.classList.remove('active-pulse'), 1500);
          }
          
          // Push children to queue
          queue.push({ nodeId: conn.toNodeId, delay: 1500 });
        });

        // Run next node in queue
        setTimeout(runNextNode, 1000);

      }, 1200); // simulation node processing speed
    }

    runNextNode();
  }

  function updateNodeStatusUI(nodeId, status) {
    const statusIcon = document.getElementById(`node-status-icon-${nodeId}`);
    const nodeEl = document.getElementById(`node-${nodeId}`);
    if (!statusIcon || !nodeEl) return;

    nodeEl.className = `canvas-node ${state.selectedNodeId === nodeId ? 'selected' : ''} ${status}`;

    let iconHtml = '';
    if (status === 'running') iconHtml = '<i data-lucide="refresh-cw" class="node-header__status-icon spinning"></i>';
    if (status === 'completed') iconHtml = '<i data-lucide="check-circle" class="node-header__status-icon done"></i>';
    if (status === 'error') iconHtml = '<i data-lucide="alert-circle" class="node-header__status-icon err"></i>';
    
    statusIcon.innerHTML = iconHtml;
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [statusIcon] });
  }

  function addLog(text, type = 'info') {
    const logContainer = document.getElementById('execution-log-container');
    if (!logContainer) return;

    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const log = document.createElement('div');
    log.className = `log-entry log-entry--${type}`;
    log.textContent = `[${time}] ${text}`;
    
    logContainer.appendChild(log);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  function updateStatsHTML() {
    const elTasks = document.getElementById('stat-tasks');
    const elMinutes = document.getElementById('stat-minutes');
    const elLeeds = document.getElementById('stat-leads');

    if (elTasks) elTasks.textContent = resultsState.completedTasks;
    if (elMinutes) elMinutes.textContent = resultsState.savedMinutes + 'm';
    if (elLeeds) elLeeds.textContent = resultsState.leadsProcessed;
  }

  function endSimulation(success) {
    state.isRunning = false;
    const btnRun = document.getElementById('btn-run-simulation');
    if (btnRun) {
      btnRun.className = 'playground-header__btn playground-header__btn--run';
      btnRun.innerHTML = '<i data-lucide="play"></i> Chạy thử';
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btnRun] });
    }

    if (success) {
      addLog('🎉 QUY TRÌNH CHẠY THỬ THÀNH CÔNG! Đã tối ưu hóa và tiết kiệm thời gian vận hành.', 'success');
      if (SoftwareStore.Utils) {
        SoftwareStore.Utils.showToast('Chạy thử workflow thành công! 🎉', 'success');
      }
    } else {
      addLog('❌ Quy trình chạy thử thất bại hoặc bị dừng.', 'error');
    }
  }

  // Inject a workflow for a specific product template
  function loadProductTemplate(productId) {
    if (productId === 20) { // AI Content Flow
      loadTemplate('social-publish', false);
    } else if (productId === 21) { // CRM Automation Pro
      loadTemplate('lead-automation', false);
    } else if (productId === 24) { // Chatbot Support Pro
      loadTemplate('chatbot-support', false);
    }
    
    // Select dropdown in topbar
    const select = document.getElementById('template-select');
    if (select) {
      if (productId === 20) select.value = 'social-publish';
      else if (productId === 21) select.value = 'lead-automation';
      else if (productId === 24) select.value = 'chatbot-support';
    }

    drawNodes();
    drawConnections();
    
    // Automatically trigger run simulation for a cool demo effect
    setTimeout(() => {
      runSimulation();
    }, 500);
  }

  // Click-to-add nodes on mobile
  function handleSidebarNodeClick(type) {
    if (window.innerWidth > 768) return; // Only click to add on mobile screens
    
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;
    
    // Position node in current canvas center
    const rect = canvasContainer.getBoundingClientRect();
    const x = (rect.width / 2 - state.panX) / state.zoom - 90;
    const y = (rect.height / 2 - state.panY) / state.zoom - 25;
    
    const newNode = {
      id: 'n_' + SoftwareStore.Utils.generateId().slice(0, 6),
      type: type,
      name: NODE_TYPES[type].name,
      x: Math.round(x),
      y: Math.round(y),
      config: getDefaultNodeConfig(type),
      status: 'idle'
    };

    state.nodes.push(newNode);
    saveState();
    drawNodes();
    
    // Select the node, which will trigger opening properties
    selectNode(newNode.id);
    
    if (SoftwareStore.Utils) {
      SoftwareStore.Utils.showToast(`Đã thêm node: ${NODE_TYPES[type].name}`, 'success');
    }
  }

  // Mobile navigation bottom sheets helpers
  function toggleMobilePanel(panelType) {
    const container = document.getElementById('softzone-playground-app');
    if (!container) return;
    
    if (panelType === 'nodes') {
      const active = container.classList.toggle('show-nodes-drawer');
      container.classList.remove('show-settings-sheet', 'show-logs-sheet');
      updateMobileNavButtons('nodes', active);
    } else if (panelType === 'settings') {
      const active = container.classList.toggle('show-settings-sheet');
      container.classList.remove('show-nodes-drawer', 'show-logs-sheet');
      updateMobileNavButtons('settings', active);
    } else if (panelType === 'logs') {
      const active = container.classList.toggle('show-logs-sheet');
      container.classList.remove('show-nodes-drawer', 'show-settings-sheet');
      updateMobileNavButtons('logs', active);
    }
  }

  function closeAllMobilePanels() {
    const container = document.getElementById('softzone-playground-app');
    if (container) {
      container.classList.remove('show-nodes-drawer', 'show-settings-sheet', 'show-logs-sheet');
      updateMobileNavButtons(null, false);
    }
  }

  function updateMobileNavButtons(activeType, isActive) {
    const btnNodes = document.getElementById('p-mob-btn-nodes');
    const btnSettings = document.getElementById('p-mob-btn-settings');
    const btnLogs = document.getElementById('p-mob-btn-logs');
    
    if (btnNodes) btnNodes.classList.toggle('is-active', activeType === 'nodes' && isActive);
    if (btnSettings) btnSettings.classList.toggle('is-active', activeType === 'settings' && isActive);
    if (btnLogs) btnLogs.classList.toggle('is-active', activeType === 'logs' && isActive);
  }

  return {
    render,
    init() {
      loadState();
    },
    toggleMobilePanel,
    closeAllMobilePanels,
    handleSidebarNodeClick,
    handleSidebarDragStart,
    handleCanvasDrop,
    handleNodeMouseDown,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handlePortMouseDown,
    handleNodeClick,
    handleConnectionClick,
    handleTemplateChange,
    updateNodeProp,
    updateNodeConfig,
    deleteSelected,
    resetToDefault,
    handleZoom,
    handleFitScreen,
    runSimulation,
    loadProductTemplate
  };
})();
