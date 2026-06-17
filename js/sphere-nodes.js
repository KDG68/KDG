/* ==========================================================================
   SOFTZONE 3D TECHNOLOGY SPHERE - NODE GENERATOR
   ========================================================================== */

(function() {
  const R = 80; // Radius of the 3D Sphere
  let functionalNodes = [];
  let nodeSprites = [];
  let coreMesh = null;
  let coreWireframe = null;
  let pointsObj = null;

  function init(sphereGroup, scene) {
    functionalNodes = [];
    nodeSprites = [];

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    
    // 1. Get raw nodes data
    const rawObjects = window.UniverseData ? window.UniverseData.objects : [];
    const coreData = rawObjects.find(o => o.id === "sz-core");
    const surfaceNodes = rawObjects.filter(o => o.id !== "sz-core");

    // Filter nodes for mobile to show only Core, Sectors, and Utilities (12 nodes)
    let filteredSurfaceNodes = surfaceNodes;
    if (isMobile) {
      filteredSurfaceNodes = surfaceNodes.filter(o => o.type !== "satellite");
    }

    // Sort nodes by sector/type to group them latitudinally
    filteredSurfaceNodes.sort((a, b) => {
      const catA = a.sector || a.type;
      const catB = b.sector || b.type;
      return catA.localeCompare(catB);
    });

    // 2. Fibonacci sphere distribution
    const count = filteredSurfaceNodes.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY * R;
      const z = Math.sin(theta) * radiusAtY * R;

      const node = filteredSurfaceNodes[i];
      node.position3D = new THREE.Vector3(x, y * R, z);
      functionalNodes.push(node);

      // Create sprite mesh
      createNodeSprite(node, sphereGroup);
    }

    // 3. Create SoftZone Core at (0, 0, 0)
    if (coreData) {
      createCore(coreData, sphereGroup);
    }

    // 4. Create minor network points (constellation particles)
    const netPointsCount = isMobile ? 40 : 120;
    createNetworkPoints(netPointsCount, sphereGroup);
  }

  function createNodeSprite(node, sphereGroup) {
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

    // Attach custom data for raycast detection
    sprite.userData = {
      id: node.id,
      node: node,
      isFunctional: true
    };

    nodeSprites.push(sprite);
    sphereGroup.add(sprite);

    // Render texture (async SVG loader)
    updateNodeTexture(node, canvas, texture, false, false);
  }

  function updateNodeTexture(node, canvas, texture, isHovered, isBack) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = node.color || "#22d3ee";
    const title = node.title || "";

    // 1. Draw backing circle
    ctx.beginPath();
    ctx.arc(64, 48, 28, 0, Math.PI * 2);
    ctx.fillStyle = isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(10, 15, 30, 0.82)";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHovered ? 4 : 2;
    ctx.stroke();

    if (isHovered) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }

    // 2. Load SVG icon in center
    const rawSvg = node.icon || "";
    if (rawSvg) {
      const strokeColor = encodeURIComponent(isHovered ? "#ffffff" : color);
      const cleanedSvg = rawSvg
        .replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`)
        .replace(/stroke-width="[^"]*"/g, 'stroke-width="2.5"');

      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">${cleanedSvg}</svg>`;
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
      img.onload = () => {
        ctx.drawImage(img, 64 - 16, 48 - 16, 32, 32);
        texture.needsUpdate = true;
      };
    }

    // 3. Draw text label
    ctx.font = isHovered ? "bold 13px Inter, sans-serif" : "600 11px Inter, sans-serif";
    ctx.fillStyle = isBack ? "rgba(255, 255, 255, 0.35)" : (isHovered ? "#ffffff" : "#b6c0d2");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 4;
    ctx.fillText(title, 64, 96);
    ctx.shadowBlur = 0;

    texture.needsUpdate = true;
  }

  function createCore(coreData, sphereGroup) {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);

    // Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(12, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.85
    });
    coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
    
    // Attach details for click handling
    coreMesh.userData = {
      id: coreData.id,
      node: coreData,
      isCore: true
    };
    coreGroup.add(coreMesh);

    // Outer rotating wireframe structure
    const wireGeo = new THREE.IcosahedronGeometry(20, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    coreWireframe = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(coreWireframe);

    // Label for Core
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("KDG CORE", 64, 24);

    const texture = new THREE.CanvasTexture(canvas);
    const labelSpriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const labelSprite = new THREE.Sprite(labelSpriteMat);
    labelSprite.position.set(0, -26, 0);
    labelSprite.scale.set(20, 7.5, 1);
    coreGroup.add(labelSprite);

    sphereGroup.add(coreGroup);
  }

  function createNetworkPoints(count, sphereGroup) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i + Math.random() * 0.15; // small random shift

      // Distributed in 3D space between 0.85R and 0.98R
      const r = R * (0.85 + Math.random() * 0.13);
      positions[i * 3] = Math.cos(theta) * radiusAtY * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext("2d");
    pCtx.beginPath();
    pCtx.arc(8, 8, 4, 0, Math.PI * 2);
    pCtx.fillStyle = "rgba(34, 211, 238, 0.4)";
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

  function update() {
    // Spin core wireframe
    if (coreWireframe) {
      coreWireframe.rotation.y += 0.008;
      coreWireframe.rotation.x += 0.004;
    }
  }

  function setPerformanceMode(mode) {
    if (!pointsObj) return;
    if (mode === "lite") {
      pointsObj.visible = false;
    } else {
      pointsObj.visible = true;
      pointsObj.material.size = mode === "full" ? 5 : 4;
    }
  }

  function dispose() {
    functionalNodes = [];
    nodeSprites = [];
    coreMesh = null;
    coreWireframe = null;
    pointsObj = null;
  }

  // Expose
  window.SphereNodes = {
    init,
    update,
    updateNodeTexture,
    setPerformanceMode,
    getFunctionalNodes: () => functionalNodes,
    getNodeSprites: () => nodeSprites,
    getCoreMesh: () => coreMesh,
    dispose
  };
})();
