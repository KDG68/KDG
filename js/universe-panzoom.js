/* ==========================================================================
   SOFTZONE TECH UNIVERSE - ZOOM & PAN ENGINE
   ========================================================================== */

(function() {
  let viewport, world;
  let scale = 0.8;
  let panX = 0;
  let panY = 0;

  // Drag states
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;

  // Touch states
  let activePointers = {};
  let startDist = 0;
  let startScale = 0;

  function init() {
    viewport = document.getElementById("universe-viewport");
    world = document.getElementById("universe-world");

    if (!viewport || !world) return;

    // Center viewport on load
    centerWorld();

    setupListeners();
  }

  function setupListeners() {
    // Pointer Events (Unified Mouse & Touch)
    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", handlePointerUp);
    viewport.addEventListener("pointercancel", handlePointerUp);

    // Mouse Wheel Zoom (with Ctrl key or when hovering canvas)
    viewport.addEventListener("wheel", handleWheel, { passive: false });
  }

  // ==========================================================================
  // VIEWPORT PAN CONTROLS
  // ==========================================================================
  function handlePointerDown(e) {
    // Accessibility check: Ignore if clicking on buttons or links
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input")) {
      return;
    }

    // Register pointer
    activePointers[e.pointerId] = e;
    const pointerList = Object.values(activePointers);

    // Stop transit animations
    world.style.transition = "";

    if (pointerList.length === 1) {
      // Single touch / Mouse drag init
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPanX = panX;
      startPanY = panY;
      viewport.setPointerCapture(e.pointerId);
    } else if (pointerList.length === 2) {
      // Pinch to Zoom init
      isDragging = false;
      startDist = getDistance(pointerList[0], pointerList[1]);
      startScale = scale;
      
      // Pivot center of pinch
      startX = (pointerList[0].clientX + pointerList[1].clientX) / 2;
      startY = (pointerList[0].clientY + pointerList[1].clientY) / 2;
      startPanX = panX;
      startPanY = panY;
    }
  }

  function handlePointerMove(e) {
    if (!activePointers[e.pointerId]) return;
    activePointers[e.pointerId] = e;
    
    const pointerList = Object.values(activePointers);

    if (isDragging && pointerList.length === 1) {
      // Drag Pan
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      panX = startPanX + dx;
      panY = startPanY + dy;
      
      clampAndApply();
    } else if (pointerList.length === 2) {
      // Pinch Zoom & Pan gộp
      const currentDist = getDistance(pointerList[0], pointerList[1]);
      const factor = currentDist / startDist;
      
      const newScale = Math.min(Math.max(startScale * factor, 0.55), 1.75);
      
      // Zoom centered on pinch pivot
      const rect = viewport.getBoundingClientRect();
      const pivotX = startX - rect.left;
      const pivotY = startY - rect.top;
      
      const worldX = (pivotX - startPanX) / startScale;
      const worldY = (pivotY - startPanY) / startScale;
      
      scale = newScale;
      panX = pivotX - worldX * scale;
      panY = pivotY - worldY * scale;

      clampAndApply();
    }
  }

  function handlePointerUp(e) {
    if (activePointers[e.pointerId]) {
      viewport.releasePointerCapture(e.pointerId);
      delete activePointers[e.pointerId];
    }
    
    if (Object.keys(activePointers).length < 2) {
      startDist = 0;
    }
    
    if (Object.keys(activePointers).length === 0) {
      isDragging = false;
    }
  }

  // ==========================================================================
  // VIEWPORT WHEEL ZOOM CONTROLS
  // ==========================================================================
  function handleWheel(e) {
    e.preventDefault(); // Prevent browser standard scroll

    // Determine zoom factor
    const zoomFactor = 0.08;
    const dir = e.deltaY < 0 ? 1 : -1;
    const newScale = Math.min(Math.max(scale + dir * zoomFactor, 0.55), 1.75);

    // Zoom centered on cursor position
    const rect = viewport.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Coordinates inside virtual 2000px world
    const worldX = (cursorX - panX) / scale;
    const worldY = (cursorY - panY) / scale;

    scale = newScale;
    panX = cursorX - worldX * scale;
    panY = cursorY - worldY * scale;

    clampAndApply();
  }

  // ==========================================================================
  // CAMERA OPERATIONS & TRANSITIONS
  // ==========================================================================
  function focusOn(x, y, zoomLevel = 1.0) {
    const vRect = viewport.getBoundingClientRect();
    
    scale = zoomLevel;
    panX = vRect.width / 2 - x * scale;
    panY = vRect.height / 2 - y * scale;

    // Apply smooth CSS transition temporarily
    world.style.transition = "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)";
    
    clampAndApply();

    // Redraw viewport box on minimap
    if (window.UniverseUI && typeof window.UniverseUI.updateMinimap === "function") {
      window.UniverseUI.updateMinimap(panX, panY, scale, vRect.width, vRect.height);
    }

    // Clear transition after finish
    setTimeout(() => {
      if (world) world.style.transition = "";
    }, 700);
  }

  function centerWorld() {
    focusOn(1000, 1000, 0.75); // Centered at Core (1000,1000)
  }

  function zoomIn() {
    const rect = viewport.getBoundingClientRect();
    const centerViewportX = rect.width / 2;
    const centerViewportY = rect.height / 2;
    const worldX = (centerViewportX - panX) / scale;
    const worldY = (centerViewportY - panY) / scale;

    scale = Math.min(scale + 0.15, 1.75);
    panX = centerViewportX - worldX * scale;
    panY = centerViewportY - worldY * scale;

    world.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    clampAndApply();
    setTimeout(() => { if (world) world.style.transition = ""; }, 300);
  }

  function zoomOut() {
    const rect = viewport.getBoundingClientRect();
    const centerViewportX = rect.width / 2;
    const centerViewportY = rect.height / 2;
    const worldX = (centerViewportX - panX) / scale;
    const worldY = (centerViewportY - panY) / scale;

    scale = Math.max(scale - 0.15, 0.55);
    panX = centerViewportX - worldX * scale;
    panY = centerViewportY - worldY * scale;

    world.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    clampAndApply();
    setTimeout(() => { if (world) world.style.transition = ""; }, 300);
  }

  // ==========================================================================
  // APPLY TRANSFORMS & BOUNDARY CLAMPING
  // ==========================================================================
  function clampAndApply() {
    const vRect = viewport.getBoundingClientRect();

    // Restrict pan boundaries so world cannot be completely panned off-screen
    // Center must stay within viewport margins
    const marginX = vRect.width * 0.4;
    const marginY = vRect.height * 0.4;

    const minPanX = -2000 * scale + marginX;
    const maxPanX = vRect.width - marginX;
    const minPanY = -2000 * scale + marginY;
    const maxPanY = vRect.height - marginY;

    panX = Math.min(Math.max(panX, minPanX), maxPanX);
    panY = Math.min(Math.max(panY, minPanY), maxPanY);

    // Apply translation matrix
    world.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;

    // Update minimap indicator box
    if (window.UniverseUI && typeof window.UniverseUI.updateMinimap === "function") {
      window.UniverseUI.updateMinimap(panX, panY, scale, vRect.width, vRect.height);
    }
  }

  // Helpers
  function getDistance(p1, p2) {
    const dx = p1.clientX - p2.clientX;
    const dy = p1.clientY - p2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Expose methods
  window.UniversePanZoom = {
    init,
    focusOn,
    centerWorld,
    zoomIn,
    zoomOut,
    getTransform: () => ({ panX, panY, scale })
  };
})();
