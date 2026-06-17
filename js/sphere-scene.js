/* ==========================================================================
   SOFTZONE 3D TECHNOLOGY SPHERE - SCENE SETUP
   ========================================================================== */

(function() {
  let scene, camera, renderer;
  let container, canvas;
  let sphereGroup;
  let performanceMode = "balanced";
  let isMobile = false;
  let animationFrameId = null;
  let resizeObserver = null;

  function init() {
    container = document.getElementById("technology-sphere-viewport");
    canvas = document.getElementById("technology-sphere-canvas");

    if (!container || !canvas) return;

    isMobile = window.matchMedia("(max-width: 1023px)").matches;

    // 1. Setup Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030711, 0.0015);

    // 2. Setup Camera
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 320 : 250;

    // 3. Setup WebGLRenderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.6));

    // 4. Setup Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 2, 400);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 1.5, 400);
    pointLight2.position.set(-100, -100, -100);
    scene.add(pointLight2);

    // 5. Create Sphere Group
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Initialize sub-modules
    if (window.SphereNodes) window.SphereNodes.init(sphereGroup, scene);
    if (window.SphereConnections) window.SphereConnections.init(sphereGroup);
    if (window.SphereInteraction) window.SphereInteraction.init(canvas, camera, sphereGroup, scene);
    if (window.SpherePanels) window.SpherePanels.init();
    if (window.SphereRouter) window.SphereRouter.init();

    // 6. Bind events
    window.addEventListener("resize", handleResize);

    // ResizeObserver for smooth resizing when side-panel opens/closes
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    }

    // Start render loop
    startRenderLoop();
  }

  function handleResize() {
    if (!container || !camera || !renderer) return;

    isMobile = window.matchMedia("(max-width: 1023px)").matches;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Preserve current interaction zoom level instead of resetting it
    if (window.SphereInteraction && typeof window.SphereInteraction.applyZoom === "function") {
      window.SphereInteraction.applyZoom();
    } else {
      camera.position.z = isMobile ? 320 : 250;
    }
  }

  function startRenderLoop() {
    if (animationFrameId) return;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      
      // Update interactions (drag, auto-rotation, hover)
      if (window.SphereInteraction && typeof window.SphereInteraction.update === "function") {
        window.SphereInteraction.update();
      }

      renderer.render(scene, camera);
    };

    render();
    console.log("[INFO] Three.js Render Loop Started.");
  }

  function stopRenderLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      console.log("[INFO] Three.js Render Loop Stopped.");
    }
  }

  function setPerformanceMode(mode) {
    performanceMode = mode;
    console.log(`[INFO] Performance Mode set to: ${mode}`);

    // Notify modules
    if (window.SphereNodes && typeof window.SphereNodes.setPerformanceMode === "function") {
      window.SphereNodes.setPerformanceMode(mode);
    }
    if (window.SphereConnections && typeof window.SphereConnections.setPerformanceMode === "function") {
      window.SphereConnections.setPerformanceMode(mode);
    }

    const stage = document.getElementById("technology-sphere-stage");
    if (stage) {
      stage.className = `technology-sphere-stage perf-${mode}`;
    }
  }

  function dispose() {
    stopRenderLoop();
    window.removeEventListener("resize", handleResize);

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    if (window.SphereInteraction && typeof window.SphereInteraction.dispose === "function") {
      window.SphereInteraction.dispose();
    }

    if (window.SphereConnections && typeof window.SphereConnections.dispose === "function") {
      window.SphereConnections.dispose();
    }

    if (window.SphereNodes && typeof window.SphereNodes.dispose === "function") {
      window.SphereNodes.dispose();
    }

    if (window.SphereRouter && typeof window.SphereRouter.dispose === "function") {
      window.SphereRouter.dispose();
    }

    if (renderer) {
      renderer.dispose();
    }
    
    scene = null;
    camera = null;
    renderer = null;
    container = null;
    canvas = null;
    sphereGroup = null;
  }

  // Expose to window
  window.SphereScene = {
    init,
    startRenderLoop,
    stopRenderLoop,
    setPerformanceMode,
    getRenderer: () => renderer,
    getScene: () => scene,
    getCamera: () => camera,
    getSphereGroup: () => sphereGroup,
    dispose
  };
})();
