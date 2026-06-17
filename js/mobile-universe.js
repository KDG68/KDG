/* ==========================================================================
   KDG MOBILE TECH UNIVERSE - MOBILE PORT PORTING ENGINE
   ========================================================================== */

(function() {
  let scene, camera, renderer;
  let container, canvas;
  let sphereGroup, lineMesh, coreMesh, coreWireframe, pointsObj;
  
  let nodeSprites = [];
  let filteredNodes = [];
  let connectionsList = [];
  let colorsArray = null;

  // Interaction States
  let isDragging = false;
  let startX = 0, startY = 0;
  let prevX = 0, prevY = 0;
  let dragDist = 0;
  let rotationSpeedX = 0, rotationSpeedY = 0;
  let autoRotate = true;
  let isNeedsRender = true;
  let lastDragEnd = 0;
  
  let activeSelectedNodeId = null;

  // Focus Camera Animations
  let animatingFocus = false;
  let targetRotationX = 0;
  let targetRotationY = 0;

  // Render Loop handle
  let animationFrameId = null;
  let activePerformanceMode = "lite";

  // App raw data references
  let rawObjects = [];
  let coreData = null;

  // Stepper Demo State
  let demoActiveInterval = null;

  // Save the desktop HTML template on start
  window.desktopUniverseTemplate = "";
  window.currentUniverseMode = ""; // "desktop" or "mobile"

  function renderMobileUniverse() {
    const viewHome = document.getElementById("view-home");
    if (!viewHome) return;

    viewHome.innerHTML = `
      <div class="mobile-universe">
        <div class="mobile-universe-intro">
          <span class="hero-tag">KDG AI & SOFTWARE</span>
          <h1>AI và phần mềm thông minh cho công việc hiện đại.</h1>
          <p>Chạm vào quả cầu để khám phá công cụ, dịch vụ và giải pháp tự động hóa.</p>
        </div>

        <main class="mobile-universe-stage">
          <div class="mobile-sphere-viewport" id="mobile-sphere-viewport">
            <canvas class="mobile-sphere-canvas" id="mobile-sphere-canvas"></canvas>
            <div class="mobile-selected-node-label" id="mobile-selected-node-label" style="display: none;"></div>
          </div>

          <nav class="mobile-sector-selector" aria-label="Nhóm công nghệ" id="mobile-sector-selector">
            <button class="active" data-category="all">Tất cả</button>
            <button data-category="ai">AI</button>
            <button data-category="automation">Automation</button>
            <button data-category="marketing">Marketing</button>
            <button data-category="data">Data</button>
            <button data-category="developer">Developer</button>
            <button data-category="business">Business</button>
          </nav>

          <div class="mobile-universe-controls">
            <button class="control-btn" id="mobile-btn-core" aria-label="Về Core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </button>
            <button class="control-btn" id="mobile-btn-rotate" aria-label="Bật/Tắt tự động xoay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </button>
            <button class="control-btn" id="mobile-btn-list" aria-label="Danh sách chức năng">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button class="control-btn" id="mobile-btn-perf" aria-label="Chế độ hiệu năng">Mode: Lite</button>
          </div>
        </main>

        <aside class="mobile-universe-sheet" id="mobile-universe-sheet">
          <div class="sheet-handle" id="mobile-sheet-handle"></div>
          <header class="sheet-header">
            <div class="sheet-title" id="mobile-sheet-title">Chức năng</div>
            <button class="sheet-close" id="mobile-sheet-close">×</button>
          </header>
          <div class="sheet-body" id="mobile-sheet-body"></div>
        </aside>

        <div class="mobile-nodes-drawer" id="mobile-nodes-drawer">
          <div class="mobile-nodes-drawer-header">
            <h3>Hệ sinh thái chức năng</h3>
            <button class="sheet-close" id="mobile-nodes-drawer-close">×</button>
          </div>
          <div class="mobile-nodes-drawer-search">
            <input type="text" class="form-control" id="mobile-nodes-search-input" placeholder="Tìm kiếm nhanh chức năng...">
          </div>
          <div class="mobile-nodes-drawer-body" id="mobile-nodes-drawer-content"></div>
        </div>
      </div>
    `;
  }

  function initMobileUniverse() {
    container = document.getElementById("mobile-sphere-viewport");
    canvas = document.getElementById("mobile-sphere-canvas");
    if (!container || !canvas) return;

    rawObjects = window.UniverseData ? window.UniverseData.objects : [];
    coreData = rawObjects.find(o => o.id === "sz-core" || o.id === "core");

    // 1. Setup Three.js Scene
    scene = new THREE.Scene();

    // 2. Setup camera positioned Z = 240 for mobile scale focus
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 240;

    // 3. Setup Renderer (optimized pixelRatio <= 1.2)
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.15));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x22d3ee, 1.5, 300);
    pointLight1.position.set(80, 80, 80);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 1.2, 300);
    pointLight2.position.set(-80, -80, -80);
    scene.add(pointLight2);

    // 5. Sphere Group
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // 6. Populate 13 key nodes + Core
    nodeSprites = [];
    filteredNodes = [];
    connectionsList = [];

    // Filter nodes to keep strictly 13 surface nodes
    const surfaceNodes = rawObjects.filter(o => o.id !== "sz-core" && o.id !== "core");
    const allowedIds = [
      "sat-ai-content", "sat-ai-chatbot", "sat-ai-coding",
      "sat-auto-email", "sat-auto-social", "sat-mkt-lead",
      "sat-data-scrape", "sat-dev-api", "sat-biz-pm",
      "util-search", "util-cart", "util-wishlist", "util-compare"
    ];
    const keySurfaceNodes = surfaceNodes.filter(o => allowedIds.includes(o.id));

    // Fibonacci sphere distribution (R = 80)
    const R = 80;
    const count = keySurfaceNodes.length;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY * R;
      const z = Math.sin(theta) * radiusAtY * R;

      const node = keySurfaceNodes[i];
      node.position3D = new THREE.Vector3(x, y * R, z);
      filteredNodes.push(node);

      createMobileNodeSprite(node);
    }

    // Create Core Node
    if (coreData) {
      createMobileCore();
    }

    // Connections (2 links max per node on mobile)
    initMobileConnections();

    // Minor particles (network points count = 20)
    createMobileNetworkPoints(20);

    // 7. Event Handlers
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    // Sector Selector click bindings
    const selector = document.getElementById("mobile-sector-selector");
    if (selector) {
      selector.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
          const category = btn.getAttribute("data-category");
          focusSectorMobile(category);
        };
      });
    }

    // Controls bar bindings
    const btnCore = document.getElementById("mobile-btn-core");
    const btnRotate = document.getElementById("mobile-btn-rotate");
    const btnList = document.getElementById("mobile-btn-list");
    const btnPerf = document.getElementById("mobile-btn-perf");

    if (btnCore) {
      btnCore.onclick = () => {
        resetMobileSphereState();
        closeMobileSheet();
      };
    }
    if (btnRotate) {
      btnRotate.onclick = () => {
        autoRotate = !autoRotate;
        btnRotate.classList.toggle("active", !autoRotate);
      };
    }
    if (btnList) {
      btnList.onclick = openMobileNodesDrawer;
    }
    if (btnPerf) {
      btnPerf.onclick = toggleMobilePerformanceMode;
    }

    // Bottom sheet drag and close handlers
    const sheetClose = document.getElementById("mobile-sheet-close");
    if (sheetClose) sheetClose.onclick = closeMobileSheet;

    const sheetHandle = document.getElementById("mobile-sheet-handle");
    const sheet = document.getElementById("mobile-universe-sheet");
    if (sheetHandle && sheet) {
      sheetHandle.onclick = () => {
        sheet.classList.toggle("is-expanded");
      };

      let touchStartY = 0;
      sheetHandle.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      sheetHandle.addEventListener("touchend", (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        if (diffY > 40) {
          sheet.classList.add("is-expanded");
        } else if (diffY < -40) {
          if (sheet.classList.contains("is-expanded")) {
            sheet.classList.remove("is-expanded");
          } else {
            closeMobileSheet();
          }
        }
      }, { passive: true });
    }

    // Accessibility drawer close
    const drawerClose = document.getElementById("mobile-nodes-drawer-close");
    if (drawerClose) drawerClose.onclick = closeMobileNodesDrawer;

    // Accessibility search input handler
    const searchInput = document.getElementById("mobile-nodes-search-input");
    if (searchInput) {
      searchInput.oninput = () => {
        renderMobileNodesDrawerContent(searchInput.value.trim());
      };
    }

    // Initial Performance Mode
    setMobilePerformanceMode("lite");

    // Start mobile render loop
    startMobileRenderLoop();
  }

  // ==========================================================================
  // MOBILE SCENE COMPONENT BUILDERS
  // ==========================================================================
  function createMobileNodeSprite(node) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.copy(node.position3D);
    sprite.scale.set(24, 24, 1);
    sprite.userData = { id: node.id, node: node, isFunctional: true };

    updateMobileNodeTexture(node, canvas, texture, false);

    sphereGroup.add(sprite);
    nodeSprites.push(sprite);
  }

  function updateMobileNodeTexture(node, canvas, texture, isSelected) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = node.color || "#22d3ee";

    // Draw circular node backing centered at (64, 64)
    ctx.beginPath();
    ctx.arc(64, 64, 38, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? "rgba(255, 255, 255, 0.15)" : "rgba(10, 15, 30, 0.88)";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isSelected ? 5 : 3;
    ctx.stroke();

    if (isSelected) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const rawSvg = node.icon || "";
    if (rawSvg) {
      const strokeColor = encodeURIComponent(isSelected ? "#ffffff" : color);
      const cleanedSvg = rawSvg
        .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`)
        .replace(/stroke-width="[^"]*"/g, 'stroke-width="2.5"');

      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">${cleanedSvg}</svg>`;
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
      img.onload = () => {
        ctx.drawImage(img, 64 - 20, 64 - 20, 40, 40);
        texture.needsUpdate = true;
      };
    }
    texture.needsUpdate = true;
  }

  function createMobileCore() {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);

    const sphereGeo = new THREE.SphereGeometry(12, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.85
    });
    coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
    coreMesh.userData = { id: coreData.id, node: coreData, isCore: true };
    coreGroup.add(coreMesh);

    const wireGeo = new THREE.IcosahedronGeometry(20, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    coreWireframe = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(coreWireframe);

    sphereGroup.add(coreGroup);
  }

  function initMobileConnections() {
    const maxLinks = 2; // Connect to only 2 nearest neighbors on mobile
    const connectedPairs = new Set();
    connectionsList = [];

    const nodes = filteredNodes;
    nodes.forEach((node, i) => {
      const neighbors = nodes
        .map((other, j) => ({
          index: j,
          node: other,
          dist: node.position3D.distanceTo(other.position3D)
        }))
        .filter(item => item.index !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, maxLinks);

      neighbors.forEach(n => {
        const key = i < n.index ? `${i}-${n.index}` : `${n.index}-${i}`;
        if (!connectedPairs.has(key)) {
          connectedPairs.add(key);
          connectionsList.push({ a: node, b: n.node });
        }
      });
    });

    const count = connectionsList.length;
    const positions = new Float32Array(count * 2 * 3);
    colorsArray = new Float32Array(count * 2 * 3);

    connectionsList.forEach((conn, index) => {
      positions[index * 6] = conn.a.position3D.x;
      positions[index * 6 + 1] = conn.a.position3D.y;
      positions[index * 6 + 2] = conn.a.position3D.z;

      positions[index * 6 + 3] = conn.b.position3D.x;
      positions[index * 6 + 4] = conn.b.position3D.y;
      positions[index * 6 + 5] = conn.b.position3D.z;

      setMobileDefaultColor(index);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });

    lineMesh = new THREE.LineSegments(geometry, material);
    sphereGroup.add(lineMesh);
  }

  function setMobileDefaultColor(index) {
    const conn = connectionsList[index];
    const colorA = new THREE.Color(conn.a.color || "#22d3ee");
    const colorB = new THREE.Color(conn.b.color || "#22d3ee");

    colorsArray[index * 6] = colorA.r * 0.15;
    colorsArray[index * 6 + 1] = colorA.g * 0.15;
    colorsArray[index * 6 + 2] = colorA.b * 0.15;

    colorsArray[index * 6 + 3] = colorB.r * 0.15;
    colorsArray[index * 6 + 4] = colorB.g * 0.15;
    colorsArray[index * 6 + 5] = colorB.b * 0.15;
  }

  function highlightMobileConnections(nodeId) {
    if (!lineMesh || !colorsArray) return;
    const geometry = lineMesh.geometry;
    const colorAttr = geometry.getAttribute("color");

    if (!nodeId) {
      connectionsList.forEach((conn, index) => {
        setMobileDefaultColor(index);
      });
    } else {
      connectionsList.forEach((conn, index) => {
        const isConnected = conn.a.id === nodeId || conn.b.id === nodeId;
        if (isConnected) {
          const colorA = new THREE.Color(conn.a.color || "#22d3ee");
          const colorB = new THREE.Color(conn.b.color || "#22d3ee");

          colorsArray[index * 6] = colorA.r;
          colorsArray[index * 6 + 1] = colorA.g;
          colorsArray[index * 6 + 2] = colorA.b;

          colorsArray[index * 6 + 3] = colorB.r;
          colorsArray[index * 6 + 4] = colorB.g;
          colorsArray[index * 6 + 5] = colorB.b;
        } else {
          const colorA = new THREE.Color(conn.a.color || "#22d3ee");
          const colorB = new THREE.Color(conn.b.color || "#22d3ee");

          colorsArray[index * 6] = colorA.r * 0.03;
          colorsArray[index * 6 + 1] = colorA.g * 0.03;
          colorsArray[index * 6 + 2] = colorA.b * 0.03;

          colorsArray[index * 6 + 3] = colorB.r * 0.03;
          colorsArray[index * 6 + 4] = colorB.g * 0.03;
          colorsArray[index * 6 + 5] = colorB.b * 0.03;
        }
      });
    }
    colorAttr.needsUpdate = true;
    isNeedsRender = true;
  }

  function highlightMobileConnectionsForSector(sectorId) {
    if (!lineMesh || !colorsArray) return;
    const geometry = lineMesh.geometry;
    const colorAttr = geometry.getAttribute("color");

    connectionsList.forEach((conn, index) => {
      const belongs = conn.a.sector === sectorId && conn.b.sector === sectorId;
      if (belongs) {
        const colorA = new THREE.Color(conn.a.color || "#22d3ee");
        const colorB = new THREE.Color(conn.b.color || "#22d3ee");

        colorsArray[index * 6] = colorA.r * 0.8;
        colorsArray[index * 6 + 1] = colorA.g * 0.8;
        colorsArray[index * 6 + 2] = colorA.b * 0.8;

        colorsArray[index * 6 + 3] = colorB.r * 0.8;
        colorsArray[index * 6 + 4] = colorB.g * 0.8;
        colorsArray[index * 6 + 5] = colorB.b * 0.8;
      } else {
        const colorA = new THREE.Color(conn.a.color || "#22d3ee");
        const colorB = new THREE.Color(conn.b.color || "#22d3ee");

        colorsArray[index * 6] = colorA.r * 0.03;
        colorsArray[index * 6 + 1] = colorA.g * 0.03;
        colorsArray[index * 6 + 2] = colorA.b * 0.03;

        colorsArray[index * 6 + 3] = colorB.r * 0.03;
        colorsArray[index * 6 + 4] = colorB.g * 0.03;
        colorsArray[index * 6 + 5] = colorB.b * 0.03;
      }
    });
    colorAttr.needsUpdate = true;
    isNeedsRender = true;
  }

  function createMobileNetworkPoints(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const R = 80;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i + Math.random() * 0.15;
      const r = R * (0.85 + Math.random() * 0.13);

      positions[i * 3] = Math.cos(theta) * radiusAtY * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext("2d");
    pCtx.beginPath();
    pCtx.arc(8, 8, 3, 0, Math.PI * 2);
    pCtx.fillStyle = "rgba(34, 211, 238, 0.35)";
    pCtx.fill();

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const material = new THREE.PointsMaterial({
      size: 4,
      map: pTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    pointsObj = new THREE.Points(geometry, material);
    sphereGroup.add(pointsObj);
  }

  // ==========================================================================
  // MOBILE INTERACTION HANDLERS
  // ==========================================================================
  function handlePointerDown(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    prevX = e.clientX;
    prevY = e.clientY;
    dragDist = 0;
    isNeedsRender = true;
    autoRotate = false;

    rotationSpeedX = 0;
    rotationSpeedY = 0;
    animatingFocus = false;
    canvas.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (isDragging) {
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      // X drag rotates around Y axis, Y drag rotates around X axis
      sphereGroup.rotation.y += dx * 0.0035;
      sphereGroup.rotation.x += dy * 0.0035;

      rotationSpeedY = dx * 0.0035;
      rotationSpeedX = dy * 0.0035;

      prevX = e.clientX;
      prevY = e.clientY;
      dragDist += Math.sqrt(dx * dx + dy * dy);
      isNeedsRender = true;
    }
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    canvas.releasePointerCapture(e.pointerId);

    const now = Date.now();
    // Drag vs Tap threshold (8px) and Debounce (150ms after dragging ends)
    if (dragDist < 8 && (now - lastDragEnd > 150)) {
      executeMobileSelection(e);
    } else {
      lastDragEnd = now;
      
      // Cap rotation inertia speed
      const maxSpeed = 0.018;
      rotationSpeedX = Math.max(-maxSpeed, Math.min(maxSpeed, rotationSpeedX));
      rotationSpeedY = Math.max(-maxSpeed, Math.min(maxSpeed, rotationSpeedY));
    }
  }

  function executeMobileSelection(e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const targets = [...nodeSprites];
    if (coreMesh) targets.push(coreMesh);

    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const node = hit.userData.node;
      if (node) {
        selectMobileNode(node);
      }
    }
  }

  function selectMobileNode(node) {
    activeSelectedNodeId = node.id;

    // 1. Highlight Sprite texture circle
    nodeSprites.forEach(sprite => {
      const isSel = sprite.userData.id === node.id;
      const canvasEl = sprite.material.map.image;
      if (canvasEl) {
        updateMobileNodeTexture(sprite.userData.node, canvasEl, sprite.material.map, isSel);
      }
      sprite.scale.set(isSel ? 30 : 24, isSel ? 30 : 24, 1);
    });

    // 2. Highlight connections
    highlightMobileConnections(node.id);

    // 3. Show selected node name in pill
    const labelPill = document.getElementById("mobile-selected-node-label");
    if (labelPill) {
      labelPill.style.display = "block";
      labelPill.style.opacity = "1";
      labelPill.textContent = node.title;
    }

    // 4. Open Bottom Sheet in Half State (46dvh)
    openMobileSheet(node);

    // 5. Update route hash URL
    window.location.hash = `#/universe/${node.id}`;

    // 6. Animate camera focus angle alignment
    focusMobileNode(node);
  }

  function focusMobileNode(node) {
    const pos = node.position3D.clone().normalize();
    targetRotationY = -Math.atan2(pos.x, pos.z);
    const projZ = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    targetRotationX = Math.atan2(pos.y, projZ);
    
    animatingFocus = true;
    isNeedsRender = true;
  }

  function focusSectorMobile(sectorId) {
    const btns = document.querySelectorAll("#mobile-sector-selector button");
    btns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-category") === sectorId);
    });

    // Scroll active sector button into center view
    const activeBtn = document.querySelector(`#mobile-sector-selector button[data-category="${sectorId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    if (sectorId === "all") {
      highlightMobileConnections(null);
      nodeSprites.forEach(sprite => {
        const canvasEl = sprite.material.map.image;
        if (canvasEl) {
          updateMobileNodeTexture(sprite.userData.node, canvasEl, sprite.material.map, false);
        }
        sprite.scale.set(24, 24, 1);
      });
      isNeedsRender = true;
      return;
    }

    const sectorNodes = nodeSprites.filter(s => s.userData.node.sector === sectorId);
    if (sectorNodes.length > 0) {
      const targetNode = sectorNodes[0].userData.node;
      focusMobileNode(targetNode);

      nodeSprites.forEach(sprite => {
        const isPart = sprite.userData.node.sector === sectorId;
        const canvasEl = sprite.material.map.image;
        if (canvasEl) {
          updateMobileNodeTexture(sprite.userData.node, canvasEl, sprite.material.map, isPart);
        }
        sprite.scale.set(isPart ? 28 : 18, isPart ? 28 : 18, 1);
      });

      highlightMobileConnectionsForSector(sectorId);
    }
    isNeedsRender = true;
  }

  function resetMobileSphereState() {
    targetRotationX = 0;
    targetRotationY = 0;
    animatingFocus = true;

    // Reset Highlights
    highlightMobileConnections(null);
    nodeSprites.forEach(sprite => {
      const canvasEl = sprite.material.map.image;
      if (canvasEl) {
        updateMobileNodeTexture(sprite.userData.node, canvasEl, sprite.material.map, false);
      }
      sprite.scale.set(24, 24, 1);
    });

    const labelPill = document.getElementById("mobile-selected-node-label");
    if (labelPill) {
      labelPill.style.display = "none";
    }

    activeSelectedNodeId = null;
    window.location.hash = `#/universe`;
    isNeedsRender = true;
  }

  // ==========================================================================
  // MOBILE BOTTOM SHEET CONTROLLER & CONTENT RENDERERS
  // ==========================================================================
  function openMobileSheet(node) {
    const sheet = document.getElementById("mobile-universe-sheet");
    const title = document.getElementById("mobile-sheet-title");
    const body = document.getElementById("mobile-sheet-body");
    if (!sheet || !title || !body) return;

    title.textContent = node.title;
    body.scrollTop = 0;

    renderMobileSheetContent(node, body);

    sheet.classList.add("is-open");
    sheet.classList.remove("is-expanded"); // Start in default Half state
  }

  function closeMobileSheet() {
    const sheet = document.getElementById("mobile-universe-sheet");
    if (sheet) {
      sheet.classList.remove("is-open");
      sheet.classList.remove("is-expanded");
    }

    // Reset highlights
    nodeSprites.forEach(sprite => {
      const canvasEl = sprite.material.map.image;
      if (canvasEl) {
        updateMobileNodeTexture(sprite.userData.node, canvasEl, sprite.material.map, false);
      }
      sprite.scale.set(24, 24, 1);
    });
    highlightMobileConnections(null);

    const labelPill = document.getElementById("mobile-selected-node-label");
    if (labelPill) {
      labelPill.style.display = "none";
    }

    if (demoActiveInterval) {
      clearInterval(demoActiveInterval);
      demoActiveInterval = null;
    }

    activeSelectedNodeId = null;
    window.location.hash = `#/universe`;
    isNeedsRender = true;
  }

  function renderMobileSheetContent(node, containerEl) {
    if (node.id === "sz-core" || node.id === "core") {
      containerEl.innerHTML = `
        <p class="sheet-desc">Chào mừng tới Trung tâm Chỉ huy KDG. Quản lý bộ lọc phễu và theo dõi tài nguyên của hệ thống.</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
          <a href="#/store" class="btn btn-cyan btn-sm flex-center" style="font-size:0.8rem; min-height:42px;">Tất cả sản phẩm</a>
          <a href="#/store?sort=rating" class="btn btn-outline btn-sm flex-center" style="font-size:0.8rem; min-height:42px; border-color:var(--purple); color:var(--purple);">Đánh giá cao</a>
        </div>
        <div class="sheet-section-title">Phiên bản mới cập nhật</div>
        <div style="font-size:0.8rem; line-height:1.6; color:var(--text-secondary);">
          <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding:8px 0; display:flex; justify-content:space-between;">
            <span>OmniPost RPA</span>
            <span style="color:var(--green)">v2.4.1 (Stable)</span>
          </div>
          <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding:8px 0; display:flex; justify-content:space-between;">
            <span>DeepScrape Data</span>
            <span style="color:var(--green)">v1.9.0 (Stable)</span>
          </div>
          <div style="padding:8px 0; display:flex; justify-content:space-between;">
            <span>Synthetix Chatbot</span>
            <span style="color:var(--cyan)">v3.0.2 (Beta)</span>
          </div>
        </div>
      `;
      return;
    }

    if (node.id === "util-search") {
      containerEl.innerHTML = `
        <p class="sheet-desc">Tìm kiếm nhanh các công cụ và vệ tinh tính năng trong toàn thư viện KDG.</p>
        <input type="text" class="form-control" id="mobile-sheet-search-input" placeholder="Nhập tên sản phẩm..." style="margin-bottom:14px; min-height:42px;">
        <div id="mobile-sheet-search-results"></div>
      `;
      
      const searchInput = document.getElementById("mobile-sheet-search-input");
      const resultsDiv = document.getElementById("mobile-sheet-search-results");
      
      const doSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
          resultsDiv.innerHTML = `<div style="text-align:center; font-size:0.8rem; color:var(--text-muted); padding:10px;">Nhập từ khóa tìm kiếm...</div>`;
          return;
        }
        const hits = rawObjects.filter(o => o.title && o.title.toLowerCase().includes(query));
        if (hits.length === 0) {
          resultsDiv.innerHTML = `<div style="text-align:center; font-size:0.8rem; color:var(--text-muted); padding:10px;">Không tìm thấy trạm nào.</div>`;
          return;
        }
        resultsDiv.innerHTML = hits.map(hit => `
          <div class="mobile-list-item" onclick="window.MobileUniverse.selectAndCloseSearch('${hit.id}')">
            <div class="mobile-list-item-icon" style="border-color:${hit.color}; color:${hit.color};">
              ${hit.icon || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}
            </div>
            <div class="mobile-list-item-title">${hit.title}</div>
          </div>
        `).join("");
      };

      searchInput.oninput = doSearch;
      doSearch();
      return;
    }

    if (node.id === "util-cart") {
      renderMobileCart(containerEl);
      return;
    }

    if (node.id === "util-wishlist") {
      renderMobileWishlist(containerEl);
      return;
    }

    if (node.id === "util-compare") {
      renderMobileCompare(containerEl);
      return;
    }

    // Satellite details
    let demoHtml = "";
    if (node.action === "demo-panel" && node.demoType) {
      demoHtml = `
        <div class="sheet-section-title">Quy trình mô phỏng Demo</div>
        <div class="sheet-demo-stepper" id="mobile-demo-stepper-wrap">
          ${renderStepperSteps(node.demoType, 0)}
        </div>
        <button class="btn btn-cyan btn-sm flex-center" id="mobile-demo-run-btn" style="width:100%; margin-top:12px; min-height:42px;">Chạy thử Demo</button>
      `;
    }

    let productsHtml = "";
    if (node.relatedProducts && node.relatedProducts.length > 0) {
      const prods = window.AppData ? window.AppData.products.filter(p => node.relatedProducts.includes(p.id)) : [];
      productsHtml = `
        <div class="sheet-section-title">Sản phẩm liên quan</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${prods.map(prod => `
            <div class="sheet-product-card">
              <div class="sheet-product-card__logo" style="color:${prod.themeColor}; border-color:${prod.themeColor}">
                ${getCategoryIconSvg(prod.category)}
              </div>
              <div class="sheet-product-card__info">
                <h5>${prod.name}</h5>
                <p>${prod.shortDesc}</p>
                <div class="sheet-product-card__meta">
                  <span>$${prod.price}/tháng</span>
                  <span>${prod.rating} ⭐</span>
                </div>
              </div>
              <div class="sheet-product-card__actions">
                <a href="#/product/${prod.id}" class="btn btn-secondary">Chi tiết</a>
                <button class="btn btn-cyan" onclick="window.MobileUniverse.quickAddCart('${prod.id}')">Thêm giỏ</button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    containerEl.innerHTML = `
      <p class="sheet-desc">${node.desc}</p>
      ${demoHtml}
      ${productsHtml}
    `;

    // Bind demo run click
    const demoBtn = document.getElementById("mobile-demo-run-btn");
    if (demoBtn) {
      demoBtn.onclick = () => {
        runMobileDemoSimulation(node.demoType, demoBtn);
      };
    }
  }

  function renderStepperSteps(demoType, activeIndex) {
    // 3 mock steps based on category
    const stepsData = {
      "ai-content": [
        { title: "Đọc dữ liệu nguồn", desc: "Lấy bài viết gốc từ thư viện dữ liệu." },
        { title: "Mô hình sinh Caption", desc: "Mô hình LLM KDG tự động tối ưu hóa từ khóa." },
        { title: "Đăng tải tự động", desc: "Publish Caption và hashtag lên Fanpage." }
      ],
      "ai-chatbot": [
        { title: "Tiếp nhận câu hỏi", desc: "Đọc dữ liệu chat đầu vào của người dùng." },
        { title: "AI Phân loại ý định", desc: "NLP phân tích ý định hỏi giá hay chính sách." },
        { title: "Phản hồi thông tin", desc: "Trả câu trả lời tự động và ghi log." }
      ],
      "ai-coding": [
        { title: "Quét mã nguồn", desc: "Nhập file Javascript hoặc CSS vào hệ thống." },
        { title: "AI đề xuất tối ưu", desc: "Tìm các hàm trùng lặp và đề xuất viết gọn." },
        { title: "Áp dụng bản vá", desc: "Xuất file code sạch đã tối ưu hiệu năng." }
      ],
      "auto-email": [
        { title: "Quét phễu đăng ký", desc: "Nhận tin nhắn đăng ký dịch vụ của khách hàng." },
        { title: "Tạo Email chuỗi", desc: "AI tự động cá nhân hóa nội dung mail theo tên." },
        { title: "Gửi đồng bộ qua API", desc: "Gửi email hàng loạt không rơi vào spam." }
      ],
      "auto-social": [
        { title: "Lấy ảnh minh họa", desc: "Sinh ảnh graphic phù hợp qua AI Image Engine." },
        { title: "Đăng tải Fanpages", desc: "Đồng bộ OmniPost đăng bài lên FB, Insta, Tiktok." },
        { title: "Thu thập tương tác", desc: "Đọc chỉ số like/share trả về Dashboard." }
      ],
      "mkt-lead": [
        { title: "Quét leads B2B", desc: "Tìm thông tin liên hệ doanh nghiệp tiềm năng." },
        { title: "Lọc trùng và email ảo", desc: "Tự động xác thực địa chỉ email còn hoạt động." },
        { title: "Đồng bộ cơ sở dữ liệu", desc: "Đẩy 138 liên hệ vào phễu marketing." }
      ],
      "data-scrape": [
        { title: "Quét web mục tiêu", desc: "Thu thập dữ liệu thô qua Proxy xoay vòng." },
        { title: "Trích xuất cấu trúc", desc: "Chuyển dữ liệu HTML thành dạng bảng JSON." },
        { title: "Lọc nhiễu thông tin", desc: "Đẩy dữ liệu sạch đã chuẩn hóa về server." }
      ],
      "dev-api": [
        { title: "Thiết lập Endpoint", desc: "Trạm API Gateway đón nhận POST request." },
        { title: "Tự động kiểm tra", desc: "Kiểm thử API phản hồi 200 OK dưới 45ms." },
        { title: "Xác thực bảo mật", desc: "Quét mã token chống tấn công chéo." }
      ],
      "biz-pm": [
        { title: "Tạo Tasks tự động", desc: "Tạo task trên Kanban khi có đơn hàng mới." },
        { title: "Tính toán hóa đơn", desc: "Tự xuất hóa đơn VAT điện tử qua PDF." },
        { title: "Báo cáo doanh số", desc: "Đồng bộ biểu đồ doanh thu gửi quản lý." }
      ]
    };

    const steps = stepsData[demoType] || [
      { title: "Bắt đầu trạm", desc: "Đọc dữ liệu cấu hình ban đầu của thiết bị." },
      { title: "Đang xử lý", desc: "Mô phỏng tự động hóa các tác vụ liên thông." },
      { title: "Hoàn thành", desc: "Xuất báo cáo kết quả và kết thúc luồng chạy." }
    ];

    return steps.map((s, idx) => {
      let statusClass = "";
      if (idx < activeIndex) statusClass = "completed";
      else if (idx === activeIndex) statusClass = "active";

      return `
        <div class="stepper-step ${statusClass}">
          <div class="stepper-circle">${idx + 1}</div>
          <div class="stepper-info">
            <h6>${s.title}</h6>
            <p>${s.desc}</p>
          </div>
        </div>
      `;
    }).join("");
  }

  function runMobileDemoSimulation(demoType, btnEl) {
    if (demoActiveInterval) {
      clearInterval(demoActiveInterval);
    }
    
    let activeIndex = 0;
    btnEl.disabled = true;
    btnEl.textContent = "Đang chạy mô phỏng...";
    
    const wrap = document.getElementById("mobile-demo-stepper-wrap");

    demoActiveInterval = setInterval(() => {
      activeIndex++;
      if (wrap) {
        wrap.innerHTML = renderStepperSteps(demoType, activeIndex);
      }

      if (activeIndex >= 3) {
        clearInterval(demoActiveInterval);
        demoActiveInterval = null;
        btnEl.disabled = false;
        btnEl.textContent = "Đã hoàn thành! Nhấp để chạy lại";
        if (window.App) window.App.showToast("Mô phỏng luồng chạy tự động thành công!", "success");
      }
    }, 1000);
  }

  // Mobile sub-components rendering
  function renderMobileCart(containerEl) {
    const cartItems = window.Store ? window.Store.getCartItems() : [];
    if (cartItems.length === 0) {
      containerEl.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px; height:40px; margin-bottom:12px; opacity:0.5;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p style="font-size:0.85rem;">Giỏ hàng của bạn đang trống.</p>
          <a href="#/store" onclick="window.MobileUniverse.closeMobileSheet()" class="btn btn-cyan btn-sm" style="display:inline-flex; margin-top:12px;">Khám phá cửa hàng</a>
        </div>
      `;
      return;
    }

    const itemsHtml = cartItems.map(item => `
      <div class="mobile-list-item" style="justify-content:space-between; padding:12px 0;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="mobile-list-item-icon" style="color:${item.themeColor || 'var(--cyan)'};">
            ${getCategoryIconSvg(item.category)}
          </div>
          <div>
            <div style="font-size:0.85rem; font-weight:700; color:#ffffff;">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--cyan); font-weight:600;">$${item.price}</div>
          </div>
        </div>
        <button class="sheet-close" onclick="window.MobileUniverse.removeCartItem('${item.id}')" style="background:rgba(239, 68, 68, 0.1); color:var(--pink);">×</button>
      </div>
    `).join("");

    const subtotal = window.Store.getSubtotal();
    const discount = subtotal * (window.Store.getDiscountPercent ? window.Store.getDiscountPercent() : 0);
    const total = subtotal - discount;

    containerEl.innerHTML = `
      <p class="sheet-desc">Trạm quản lý các phần mềm đã chọn mua. Nhập mã coupon để áp dụng chiết khấu.</p>
      <div style="display:flex; flex-direction:column; margin-bottom:16px;">
        ${itemsHtml}
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:12px; margin-bottom:16px; font-size:0.85rem; color:var(--text-secondary);">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Tạm tính:</span>
          <span>$${subtotal}</span>
        </div>
        ${discount > 0 ? `
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:var(--pink);">
            <span>Giảm giá:</span>
            <span>-$${discount}</span>
          </div>
        ` : ""}
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#ffffff; font-size:0.95rem; margin-top:6px;">
          <span>Tổng cộng:</span>
          <span>$${total}</span>
        </div>
      </div>
      <a href="#/checkout" class="btn btn-cyan" style="width:100%; min-height:44px; display:flex; align-items:center; justify-content:center;">Tiến hành thanh toán</a>
    `;
  }

  function renderMobileWishlist(containerEl) {
    const listIds = window.Store ? window.Store.getWishlist() : [];
    const prods = window.AppData ? window.AppData.products.filter(p => listIds.includes(p.id)) : [];

    if (prods.length === 0) {
      containerEl.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px; height:40px; margin-bottom:12px; opacity:0.5;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p style="font-size:0.85rem;">Danh sách yêu thích trống.</p>
        </div>
      `;
      return;
    }

    const itemsHtml = prods.map(item => `
      <div class="mobile-list-item" style="justify-content:space-between; padding:12px 0;">
        <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
          <div class="mobile-list-item-icon" style="color:${item.themeColor || 'var(--cyan)'};">
            ${getCategoryIconSvg(item.category)}
          </div>
          <div style="min-width:0; flex:1;">
            <div style="font-size:0.85rem; font-weight:700; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--cyan); font-weight:600;">$${item.price}</div>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-cyan btn-sm" onclick="window.MobileUniverse.quickAddCart('${item.id}')" style="min-height:32px; padding:0 8px; font-size:0.75rem;">+ Giỏ</button>
          <button class="sheet-close" onclick="window.MobileUniverse.toggleWishlist('${item.id}')" style="background:rgba(239, 68, 68, 0.1); color:var(--pink);">×</button>
        </div>
      </div>
    `).join("");

    containerEl.innerHTML = `
      <p class="sheet-desc">Sản phẩm bạn đã lưu thích để tham khảo mua sau.</p>
      <div style="display:flex; flex-direction:column;">
        ${itemsHtml}
      </div>
    `;
  }

  function renderMobileCompare(containerEl) {
    const list = window.Store ? window.Store.getCompareList() : [];
    const prods = window.AppData ? window.AppData.products : [];

    const listHtml = prods.map(prod => {
      const isChecked = list.includes(prod.id);
      return `
        <label class="filter-checkbox-label" style="padding:10px; border:1px solid rgba(255,255,255,0.05); border-radius:8px; display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.01);">
          <input type="checkbox" value="${prod.id}" class="mobile-compare-checkbox-select" ${isChecked ? "checked" : ""} onchange="window.MobileUniverse.toggleCompareCheckbox('${prod.id}', this.checked)">
          <span class="custom-checkbox" style="border-color:${prod.themeColor};"></span>
          <span style="font-size:0.8rem; color:#ffffff;">${prod.name}</span>
        </label>
      `;
    }).join("");

    containerEl.innerHTML = `
      <p class="sheet-desc">Chọn tối đa 3 sản phẩm KDG để đối chiếu cấu hình chi tiết.</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:14px;">
        ${listHtml}
      </div>
      <button class="btn btn-cyan" onclick="window.MobileUniverse.runCompare()" style="width:100%; min-height:42px; background:var(--green); color:var(--bg-deep); font-weight:700;">So sánh cấu hình (${list.length})</button>
      <div id="mobile-compare-table-wrap" style="margin-top:14px; display:none; overflow-x:auto;"></div>
    `;
  }

  // ==========================================================================
  // MOBILE ACCESSIBILITY LIST DRAWER CONTROLLER
  // ==========================================================================
  function openMobileNodesDrawer() {
    const drawer = document.getElementById("mobile-nodes-drawer");
    if (drawer) {
      drawer.classList.add("is-open");
      renderMobileNodesDrawerContent("");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMobileNodesDrawer() {
    const drawer = document.getElementById("mobile-nodes-drawer");
    if (drawer) {
      drawer.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  function renderMobileNodesDrawerContent(searchQuery) {
    const wrap = document.getElementById("mobile-nodes-drawer-content");
    if (!wrap) return;

    let objects = filteredNodes;
    if (searchQuery) {
      objects = objects.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (objects.length === 0) {
      wrap.innerHTML = `<div style="text-align:center; font-size:0.85rem; color:var(--text-muted); padding:30px;">Không tìm thấy chức năng nào.</div>`;
      return;
    }

    // Group by sector/category
    const groups = {};
    objects.forEach(obj => {
      const cat = obj.sector || "other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(obj);
    });

    const categoryNames = {
      ai: "AI Intelligence",
      automation: "Automation Hub",
      marketing: "Marketing Network",
      data: "Data System",
      developer: "Developer Lab",
      business: "Business Ops",
      other: "Tiện ích hệ thống"
    };

    let html = "";
    for (const key in groups) {
      html += `<div class="mobile-list-group-title">${categoryNames[key] || key}</div>`;
      html += groups[key].map(obj => `
        <div class="mobile-list-item" onclick="window.MobileUniverse.selectAndCloseSearch('${obj.id}')">
          <div class="mobile-list-item-icon" style="color:${obj.color}; border-color:${obj.color};">
            ${obj.icon || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}
          </div>
          <div class="mobile-list-item-title">${obj.title}</div>
        </div>
      `).join("");
    }

    wrap.innerHTML = html;
  }

  function selectAndCloseSearch(nodeId) {
    closeMobileNodesDrawer();
    const node = filteredNodes.find(n => n.id === nodeId);
    if (node) {
      setTimeout(() => {
        selectMobileNode(node);
      }, 150);
    }
  }

  // ==========================================================================
  // MOBILE PERFORMANCE MODE & RENDER CONTROLLERS
  // ==========================================================================
  function toggleMobilePerformanceMode() {
    const nextMode = activePerformanceMode === "lite" ? "balanced" : "lite";
    setMobilePerformanceMode(nextMode);
  }

  function setMobilePerformanceMode(mode) {
    activePerformanceMode = mode;
    const btn = document.getElementById("mobile-btn-perf");
    if (btn) {
      btn.textContent = `Mode: ${mode === 'lite' ? 'Lite' : 'Balanced'}`;
      btn.classList.toggle("active", mode === "balanced");
    }

    // Apply scene configurations
    if (pointsObj) {
      pointsObj.visible = (mode === "balanced");
    }
    if (lineMesh) {
      lineMesh.material.opacity = (mode === "balanced") ? 0.35 : 0.15;
    }
    
    isNeedsRender = true;
    if (window.App) window.App.showToast(`Đã chuyển sang chế độ: ${mode.toUpperCase()}`, "success");
  }

  function startMobileRenderLoop() {
    if (animationFrameId) return;

    let lastTime = 0;
    const interval = 1000 / 30; // Limit rendering up to 30-40 fps to save mobile battery

    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);

      // Check if auto-rotation or animations are active to trigger render
      let shouldRender = isNeedsRender;

      if (autoRotate && !isDragging) {
        sphereGroup.rotation.y += 0.00012;
        shouldRender = true;
      }

      if (animatingFocus) {
        sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.12;
        sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.12;

        if (Math.abs(targetRotationY - sphereGroup.rotation.y) < 0.005 &&
            Math.abs(targetRotationX - sphereGroup.rotation.x) < 0.005) {
          sphereGroup.rotation.y = targetRotationY;
          sphereGroup.rotation.x = targetRotationX;
          animatingFocus = false;
        }
        shouldRender = true;
      }

      // Rotate core mesh
      if (coreWireframe) {
        coreWireframe.rotation.y += 0.005;
        coreWireframe.rotation.x += 0.003;
        shouldRender = true;
      }

      // Drag inertia decay
      if (!isDragging && (Math.abs(rotationSpeedX) > 0.0001 || Math.abs(rotationSpeedY) > 0.0001)) {
        sphereGroup.rotation.y += rotationSpeedY;
        sphereGroup.rotation.x += rotationSpeedX;
        
        rotationSpeedX *= 0.91;
        rotationSpeedY *= 0.91;
        shouldRender = true;
      }

      // Render frames throttled for battery efficiency
      if (shouldRender) {
        const delta = time - lastTime;
        if (delta >= interval) {
          renderer.render(scene, camera);
          lastTime = time - (delta % interval);
          isNeedsRender = false; // Reset render need flag
        }
      }
    };

    render(0);
    console.log("[INFO] Mobile Three.js Render Loop Started.");
  }

  function stopMobileRenderLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      console.log("[INFO] Mobile Three.js Render Loop Stopped.");
    }
  }

  function pause() {
    stopMobileRenderLoop();
  }

  function resume() {
    startMobileRenderLoop();
  }

  // ==========================================================================
  // MOBILE CLEANUP & DESTRUCTOR
  // ==========================================================================
  function cleanupMobile() {
    stopMobileRenderLoop();

    if (demoActiveInterval) {
      clearInterval(demoActiveInterval);
      demoActiveInterval = null;
    }

    if (canvas) {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    }

    // Dispose geometries & materials
    if (scene) {
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }

    if (renderer) renderer.dispose();

    scene = null;
    camera = null;
    renderer = null;
    container = null;
    canvas = null;
    sphereGroup = null;
    lineMesh = null;
    coreMesh = null;
    coreWireframe = null;
    pointsObj = null;

    nodeSprites = [];
    filteredNodes = [];
    connectionsList = [];
    colorsArray = null;
  }

  // Helpers
  function getCategoryIconSvg(catId) {
    if (!window.AppData) return "";
    const cat = window.AppData.categories.find(c => c.id === catId);
    return cat ? cat.icon : "";
  }

  // Expose global methods
  window.MobileUniverse = {
    renderMobileUniverse,
    initMobileUniverse,
    cleanupMobile,
    selectAndCloseSearch,
    closeMobileSheet,
    pause,
    resume,
    
    // Inline cart actions inside sheet
    quickAddCart: (id) => {
      if (window.Store) {
        window.Store.addToCart(id);
        if (window.App) window.App.showToast("Đã thêm sản phẩm vào giỏ hàng!", "success");
        // Re-render cart sheet content
        const body = document.getElementById("mobile-sheet-body");
        if (body && activeSelectedNodeId === "util-cart") {
          renderMobileCart(body);
        }
      }
    },
    removeCartItem: (id) => {
      if (window.Store) {
        window.Store.removeFromCart(id);
        const body = document.getElementById("mobile-sheet-body");
        if (body && activeSelectedNodeId === "util-cart") {
          renderMobileCart(body);
        }
      }
    },
    toggleWishlist: (id) => {
      if (window.Store) {
        const list = window.Store.getWishlist();
        if (list.includes(id)) {
          window.Store.removeFromWishlist(id);
        } else {
          window.Store.addToWishlist(id);
        }
        const body = document.getElementById("mobile-sheet-body");
        if (body && activeSelectedNodeId === "util-wishlist") {
          renderMobileWishlist(body);
        }
      }
    },
    toggleCompareCheckbox: (id, isChecked) => {
      if (window.Store) {
        if (isChecked) {
          window.Store.addToCompare(id);
        } else {
          window.Store.removeFromCompare(id);
        }
        // Update compare button count
        const list = window.Store.getCompareList();
        const btn = document.querySelector(".mobile-universe-sheet .btn");
        if (btn) btn.textContent = `So sánh cấu hình (${list.length})`;
      }
    },
    runCompare: () => {
      if (!window.Store) return;
      const list = window.Store.getCompareList();
      const wrap = document.getElementById("mobile-compare-table-wrap");
      if (!wrap) return;

      if (list.length < 2) {
        if (window.App) window.App.showToast("Vui lòng chọn tối thiểu 2 sản phẩm để đối chiếu.", "error");
        return;
      }

      wrap.style.display = "block";
      const prods = window.AppData ? window.AppData.products.filter(p => list.includes(p.id)) : [];

      wrap.innerHTML = `
        <table style="width:100%; border-collapse:collapse; font-size:0.75rem; color:var(--text-secondary); text-align:left; margin-top:10px;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:#ffffff;">
              <th style="padding:6px 4px;">Tính năng</th>
              ${prods.map(p => `<th style="padding:6px 4px; color:${p.themeColor}">${p.name}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:6px 4px; font-weight:700;">Giá</td>
              ${prods.map(p => `<td style="padding:6px 4px;">$${p.price}/mo</td>`).join("")}
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:6px 4px; font-weight:700;">Đánh giá</td>
              ${prods.map(p => `<td style="padding:6px 4px;">${p.rating} ⭐</td>`).join("")}
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:6px 4px; font-weight:700;">License</td>
              ${prods.map(p => `<td style="padding:6px 4px;">${p.licenseType}</td>`).join("")}
            </tr>
            <tr>
              <td style="padding:6px 4px; font-weight:700;">API Support</td>
              ${prods.map(p => `<td style="padding:6px 4px;">Tích hợp sẵn</td>`).join("")}
            </tr>
          </tbody>
        </table>
      `;
    }
  };
})();
