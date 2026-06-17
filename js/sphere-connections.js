/* ==========================================================================
   SOFTZONE 3D TECHNOLOGY SPHERE - CONNECTIONS NET
   ========================================================================== */

(function() {
  let lineMesh = null;
  let connectionsList = []; // Array of { a: node, b: node }
  let colorsArray = null;

  function init(sphereGroup) {
    connectionsList = [];

    const nodes = window.SphereNodes ? window.SphereNodes.getFunctionalNodes() : [];
    if (nodes.length < 2) return;

    // 1. Calculate Euclid distances and connect nearby neighbors
    const maxLinks = 3;
    const connectedPairs = new Set(); // avoid duplicated keys like "A-B" and "B-A"

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
          connectionsList.push({
            a: node,
            b: n.node
          });
        }
      });
    });

    // 2. Build BufferGeometry
    const count = connectionsList.length;
    const positions = new Float32Array(count * 2 * 3);
    colorsArray = new Float32Array(count * 2 * 3);

    connectionsList.forEach((conn, index) => {
      // Write positions
      positions[index * 6] = conn.a.position3D.x;
      positions[index * 6 + 1] = conn.a.position3D.y;
      positions[index * 6 + 2] = conn.a.position3D.z;

      positions[index * 6 + 3] = conn.b.position3D.x;
      positions[index * 6 + 4] = conn.b.position3D.y;
      positions[index * 6 + 5] = conn.b.position3D.z;

      // Draw initial default colors
      setDefaultColor(index);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    // 3. Line segments using vertex colors for high-performance updates
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    lineMesh = new THREE.LineSegments(geometry, material);
    sphereGroup.add(lineMesh);
  }

  function setDefaultColor(index) {
    const conn = connectionsList[index];
    const colorA = new THREE.Color(conn.a.color || "#22d3ee");
    const colorB = new THREE.Color(conn.b.color || "#22d3ee");

    // Dim the defaults for background structure feel
    colorsArray[index * 6] = colorA.r * 0.25;
    colorsArray[index * 6 + 1] = colorA.g * 0.25;
    colorsArray[index * 6 + 2] = colorA.b * 0.25;

    colorsArray[index * 6 + 3] = colorB.r * 0.25;
    colorsArray[index * 6 + 4] = colorB.g * 0.25;
    colorsArray[index * 6 + 5] = colorB.b * 0.25;
  }

  function highlight(nodeId) {
    if (!lineMesh || !colorsArray) return;

    const geometry = lineMesh.geometry;
    const colorAttr = geometry.getAttribute("color");

    if (!nodeId) {
      // Reset all to default colors
      connectionsList.forEach((conn, index) => {
        setDefaultColor(index);
      });
    } else {
      // Highlight lines connected to active selected/hovered node, dim others
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

          colorsArray[index * 6] = colorA.r * 0.05;
          colorsArray[index * 6 + 1] = colorA.g * 0.05;
          colorsArray[index * 6 + 2] = colorA.b * 0.05;

          colorsArray[index * 6 + 3] = colorB.r * 0.05;
          colorsArray[index * 6 + 4] = colorB.g * 0.05;
          colorsArray[index * 6 + 5] = colorB.b * 0.05;
        }
      });
    }

    colorAttr.needsUpdate = true;
  }

  function setPerformanceMode(mode) {
    if (!lineMesh) return;
    if (mode === "lite") {
      lineMesh.visible = false;
    } else {
      lineMesh.visible = true;
      lineMesh.material.opacity = mode === "full" ? 0.5 : 0.35;
    }
  }

  function dispose() {
    lineMesh = null;
    connectionsList = [];
    colorsArray = null;
  }

  // Expose
  window.SphereConnections = {
    init,
    highlight,
    setPerformanceMode,
    dispose
  };
})();
