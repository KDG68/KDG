/* ==========================================================================
   SOFTZONE 3D TECHNOLOGY SPHERE - INTERACTION CONTROLLER
   ========================================================================== */

(function() {
  const R = 80; // Radius of the 3D Sphere
  let canvas, camera, sphereGroup, scene;
  
  // Interaction states
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let rotationSpeedX = 0;
  let rotationSpeedY = 0;
  const rotationDecay = 0.94;
  
  let autoRotate = true;
  let zoomLevel = 1.0;
  let totalDragDist = 0;
  const DRAG_THRESHOLD = 6; // pixels

  // Selection states
  let hoveredSprite = null;
  let activeSelectedNodeId = null;

  // Camera animations (Reset & Focus transitions)
  let animatingReset = false;
  let animatingFocus = false;
  let targetRotationX = 0;
  let targetRotationY = 0;

  function init(c, cam, group, s) {
    canvas = c;
    camera = cam;
    sphereGroup = group;
    scene = s;

    setupEvents();
    setupAccessibilitySearch();
  }

  function setupEvents() {
    // Pointer Events (unified touch + mouse)
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    // Zoom wheel
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // HUD controls binding
    const btnZoomIn = document.getElementById("sphere-zoom-in");
    const btnZoomOut = document.getElementById("sphere-zoom-out");
    const btnReset = document.getElementById("sphere-reset");
    const btnRotate = document.getElementById("sphere-rotate-toggle");
    const btnPerf = document.getElementById("sphere-perf-toggle");

    if (btnZoomIn) btnZoomIn.onclick = () => { zoomLevel = Math.min(1.45, zoomLevel + 0.15); applyZoom(); };
    if (btnZoomOut) btnZoomOut.onclick = () => { zoomLevel = Math.max(0.8, zoomLevel - 0.15); applyZoom(); };
    if (btnReset) btnReset.onclick = resetSphereState;
    if (btnRotate) {
      btnRotate.onclick = () => {
        autoRotate = !autoRotate;
        btnRotate.classList.toggle("active", !autoRotate); // Active state shows auto-rotate is disabled
      };
    }
    if (btnPerf) {
      btnPerf.onclick = () => {
        if (window.App && typeof window.App.cyclePerformanceMode === "function") {
          window.App.cyclePerformanceMode();
        }
      };
    }
  }

  // ==========================================================================
  // ROTATION AND INERTIA ENGINE
  // ==========================================================================
  function handlePointerDown(e) {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    totalDragDist = 0;
    animatingFocus = false;
    animatingReset = false;
    
    // Capture pointer to track dragging out of bounds
    canvas.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (isDragging) {
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;

      // Adjust rotation (X dragging rotates around Y axis, Y dragging rotates around X axis)
      sphereGroup.rotation.y += dx * 0.0045;
      sphereGroup.rotation.x += dy * 0.0045;

      // Keep tracking drag speeds for inertia
      rotationSpeedX = dx * 0.0045;
      rotationSpeedY = dy * 0.0045;

      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      totalDragDist += Math.sqrt(dx * dx + dy * dy);
    } else {
      // Execute hover raycasting check (PC Only)
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (!isMobile) {
        checkHover(e);
      }
    }
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    canvas.releasePointerCapture(e.pointerId);

    // Click selection trigger if under threshold (not dragging)
    if (totalDragDist < DRAG_THRESHOLD) {
      executeSelection(e);
    }
  }

  function update() {
    if (window.SphereNodes && typeof window.SphereNodes.update === "function") {
      window.SphereNodes.update();
    }

    if (isDragging) return;

    // 1. Animating focus camera transitions
    if (animatingFocus) {
      sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.15;
      sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.15;

      if (Math.abs(targetRotationY - sphereGroup.rotation.y) < 0.002 &&
          Math.abs(targetRotationX - sphereGroup.rotation.x) < 0.002) {
        sphereGroup.rotation.y = targetRotationY;
        sphereGroup.rotation.x = targetRotationX;
        animatingFocus = false;
      }
      return;
    }

    // 2. Animating Reset camera transition
    if (animatingReset) {
      sphereGroup.rotation.x += (0 - sphereGroup.rotation.x) * 0.15;
      sphereGroup.rotation.y += (0 - sphereGroup.rotation.y) * 0.15;

      if (Math.abs(sphereGroup.rotation.x) < 0.002 && Math.abs(sphereGroup.rotation.y) < 0.002) {
        sphereGroup.rotation.set(0, 0, 0);
        animatingReset = false;
      }
      return;
    }

    // 3. Normal Inertial sliding rotation
    sphereGroup.rotation.y += rotationSpeedX;
    sphereGroup.rotation.x += rotationSpeedY;

    rotationSpeedX *= rotationDecay;
    rotationSpeedY *= rotationDecay;

    // Apply very slow auto-rotation if idle
    if (autoRotate && Math.abs(rotationSpeedX) < 0.0002 && Math.abs(rotationSpeedY) < 0.0002) {
      const panelOpen = document.getElementById("technology-sphere-stage")?.classList.contains("is-panel-open");
      const speed = hoveredSprite ? 0.0002 : (panelOpen ? 0.0004 : 0.001);
      sphereGroup.rotation.y += speed;
    }
  }

  // ==========================================================================
  // ZOOM HANDLER
  // ==========================================================================
  function handleWheel(e) {
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.max(0.8, Math.min(1.45, zoomLevel));
    applyZoom();
    e.preventDefault();
  }

  function applyZoom() {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const baseZ = isMobile ? 320 : 250;
    camera.position.z = baseZ / zoomLevel;
  }

  function resetSphereState() {
    zoomLevel = 1.0;
    applyZoom();
    animatingReset = true;
    animatingFocus = false;
  }

  // ==========================================================================
  // RAYCASTING HOVER & SELECTION
  // ==========================================================================
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function checkHover(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const sprites = window.SphereNodes.getNodeSprites();
    const coreMesh = window.SphereNodes.getCoreMesh();

    const targets = [...sprites];
    if (coreMesh) targets.push(coreMesh);

    const intersects = raycaster.intersectObjects(targets);
    const tooltip = document.getElementById("sphere-tooltip");

    if (intersects.length > 0) {
      const target = intersects[0].object;
      const data = target.userData;

      if (data && (data.isFunctional || data.isCore)) {
        document.body.style.cursor = "pointer";

        if (hoveredSprite !== target) {
          // Reset previous hover texture
          if (hoveredSprite && hoveredSprite.userData.isFunctional) {
            resetSpriteTexture(hoveredSprite);
          } else if (hoveredSprite && hoveredSprite.userData.isCore) {
            coreMesh.material.color.setHex(0xf8fafc);
          }

          hoveredSprite = target;

          // Scale and highlight selected hover target
          if (hoveredSprite.userData.isFunctional) {
            hoveredSprite.scale.set(28, 28, 1);
            const node = hoveredSprite.userData.node;
            window.SphereNodes.updateNodeTexture(node, hoveredSprite.material.map.image, hoveredSprite.material.map, true, false);
            window.SphereConnections.highlight(node.id);
          } else if (hoveredSprite.userData.isCore) {
            coreMesh.material.color.setHex(0x22d3ee);
            window.SphereConnections.highlight(coreMesh.userData.id);
          }

          showTooltip(hoveredSprite.userData.node, tooltip);
        }

        updateProjections();
        return;
      }
    }

    // Reset state if hovered off targets
    if (hoveredSprite) {
      if (hoveredSprite.userData.isFunctional) {
        resetSpriteTexture(hoveredSprite);
      } else if (hoveredSprite.userData.isCore) {
        coreMesh.material.color.setHex(0xf8fafc);
      }
      hoveredSprite = null;
      document.body.style.cursor = "default";
      window.SphereConnections.highlight(null);
      if (tooltip) tooltip.classList.remove("is-visible");
    }
  }

  function executeSelection(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const sprites = window.SphereNodes.getNodeSprites();
    const coreMesh = window.SphereNodes.getCoreMesh();

    const targets = [...sprites];
    if (coreMesh) targets.push(coreMesh);

    const intersects = raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      const data = target.userData;

      if (data && (data.isFunctional || data.isCore)) {
        // Select node
        activeSelectedNodeId = data.id;
        
        // Face the node to Z-axis (camera)
        if (data.isFunctional) {
          focusNode(data.node);
        }
        
        // Trigger sliding panel transition
        if (window.SpherePanels) {
          window.SpherePanels.openPanel(data.node);
        }
      }
    }
  }

  function resetSpriteTexture(sprite) {
    sprite.scale.set(24, 24, 1);
    const node = sprite.userData.node;
    window.SphereNodes.updateNodeTexture(node, sprite.material.map.image, sprite.material.map, false, false);
  }

  // ==========================================================================
  // coordinates projection for tooltip (3D -> 2D)
  // ==========================================================================
  function updateProjections() {
    if (!hoveredSprite || !camera || !canvas) return;

    const tempV = new THREE.Vector3();
    if (hoveredSprite.userData.isCore) {
      tempV.set(0, 0, 0); // Core center coords
    } else {
      tempV.copy(hoveredSprite.position);
    }
    
    tempV.applyMatrix4(sphereGroup.matrixWorld); // apply sphere rotations
    tempV.project(camera); // project Z positive facing

    const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (tempV.y * -0.5 + 0.5) * canvas.clientHeight;

    const tooltip = document.getElementById("sphere-tooltip");
    if (tooltip) {
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }
  }

  function showTooltip(node, tooltip) {
    if (!tooltip || !node) return;

    const color = node.color || "var(--cyan)";
    tooltip.style.setProperty("--tooltip-color", color);
    tooltip.innerHTML = `
      <span class="tooltip-cat">${node.sector || node.type || "System"}</span>
      <span class="tooltip-title">${node.title}</span>
      <p class="tooltip-desc">${node.desc}</p>
      <span class="tooltip-hint">Nhấp để khám phá →</span>
    `;
    tooltip.classList.add("is-visible");
  }

  // ==========================================================================
  // SPHERICAL ANGLE ALIGN FOCUS
  // ==========================================================================
  function focusNode(node) {
    const pos = node.position3D.clone();
    
    // Spherical coordinates mapping
    const theta = Math.acos(pos.y / R); 
    const phi = Math.atan2(pos.x, pos.z);

    // Target rotations to face Z positive axis (camera viewport)
    targetRotationY = -phi;
    targetRotationX = -(theta - Math.PI / 2);
    
    // Dim down auto rotate speed
    rotationSpeedX = 0;
    rotationSpeedY = 0;
    
    animatingFocus = true;
    animatingReset = false;
  }

  function focusCategory(catId) {
    // Tapping mobile selector category spins the sphere to face the first node in that category
    const nodes = window.SphereNodes.getFunctionalNodes();
    const match = nodes.find(n => n.sector === catId);
    if (match) {
      focusNode(match);
      
      // Update swiper dock active highlights
      const cards = document.querySelectorAll(".mobile-sector-card");
      cards.forEach(c => {
        const active = c.getAttribute("data-category") === catId;
        c.classList.toggle("active", active);
      });
    }
  }

  // ==========================================================================
  // ACCESSIBILITY SEARCH DRAWER
  // ==========================================================================
  function setupAccessibilitySearch() {
    const searchInput = document.getElementById("nodes-list-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        renderNodesList(q);
      });
    }
  }

  function openNodesList() {
    const drawer = document.getElementById("sphere-nodes-list-drawer");
    const backdrop = document.getElementById("sphere-nodes-list-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      renderNodesList("");
    }
  }

  function closeNodesList() {
    const drawer = document.getElementById("sphere-nodes-list-drawer");
    const backdrop = document.getElementById("sphere-nodes-list-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
    }
  }

  function renderNodesList(filterQuery = "") {
    const listBody = document.getElementById("nodes-list-body-content");
    if (!listBody) return;

    const nodes = window.SphereNodes.getFunctionalNodes();
    const categories = {
      ai: { name: "AI Intelligence", color: "#22d3ee" },
      automation: { name: "Automation Hub", color: "#7c3aed" },
      marketing: { name: "Marketing Network", color: "#ec4899" },
      data: { name: "Data System", color: "#34d399" },
      developer: { name: "Developer Lab", color: "#3b82f6" },
      business: { name: "Business Operations", color: "#8b5cf6" },
      utility: { name: "Tiện ích Không gian", color: "#f8fafc" }
    };

    // Filter nodes
    const filteredNodes = nodes.filter(n => 
      n.title.toLowerCase().includes(filterQuery) || 
      n.desc.toLowerCase().includes(filterQuery)
    );

    if (filteredNodes.length === 0) {
      listBody.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem;">Không tìm thấy chức năng tương thích.</div>`;
      return;
    }

    // Group by sector
    const groups = {};
    Object.keys(categories).forEach(catId => {
      groups[catId] = [];
    });

    filteredNodes.forEach(node => {
      const catId = node.sector || node.type || "utility";
      if (groups[catId]) {
        groups[catId].push(node);
      } else {
        // Fallback to utility
        groups["utility"].push(node);
      }
    });

    let html = "";
    Object.keys(categories).forEach(catId => {
      const catGroup = groups[catId];
      if (catGroup && catGroup.length > 0) {
        const cat = categories[catId];
        const itemsHtml = catGroup.map(n => `
          <div class="node-list-item-row" onclick="window.SphereInteraction.focusNodeFromList('${n.id}')" style="--item-color:${cat.color}">
            <span style="font-size:0.85rem; font-weight:600;">${n.title}</span>
            <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Focus</span>
          </div>
        `).join("");

        html += `
          <div class="node-list-cat-group" style="--cat-color:${cat.color}">
            <div class="node-list-cat-title">${cat.name}</div>
            ${itemsHtml}
          </div>
        `;
      }
    });

    listBody.innerHTML = html;
  }

  function focusNodeFromList(nodeId) {
    closeNodesList();
    const nodes = window.SphereNodes.getFunctionalNodes();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      // Rotate camera focus
      focusNode(node);

      // Open detail panel
      setTimeout(() => {
        if (window.SpherePanels) {
          window.SpherePanels.openPanel(node);
        }
      }, 500);
    }
  }

  function dispose() {
    if (canvas) {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);
    }
    canvas = null;
    camera = null;
    sphereGroup = null;
    scene = null;
    hoveredSprite = null;
    activeSelectedNodeId = null;
  }

  // Expose
  window.SphereInteraction = {
    init,
    update,
    updateProjections,
    focusNode,
    focusCategory,
    openNodesList,
    closeNodesList,
    focusNodeFromList,
    resetSphereState,
    applyZoom,
    dispose
  };
})();
