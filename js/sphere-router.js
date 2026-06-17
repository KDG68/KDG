/* ==========================================================================
   SOFTZONE 3D TECHNOLOGY SPHERE - ROUTER CONTROLLER
   ========================================================================== */

(function() {
  let initialized = false;

  function init() {
    if (initialized) return;

    window.addEventListener("hashchange", handleRoute);
    initialized = true;

    // Handle initial deep link route on page load
    setTimeout(() => {
      handleRoute();
    }, 800);
  }

  function handleRoute() {
    const rawHash = window.location.hash || "#/";
    const [path] = rawHash.split("?");

    if (path.startsWith("#/universe/")) {
      const nodeId = path.replace("#/universe/", "");
      if (!nodeId) return;

      const rawObjects = window.UniverseData ? window.UniverseData.objects : [];
      const node = rawObjects.find(o => o.id === nodeId);

      if (node) {
        // Rotate sphere to center on node
        if (window.SphereInteraction && typeof window.SphereInteraction.focusNode === "function") {
          window.SphereInteraction.focusNode(node);
        }

        // Open details panel
        if (window.SpherePanels && typeof window.SpherePanels.openPanel === "function") {
          window.SpherePanels.openPanel(node);
        }
      }
    } else if (path === "#/universe" || path === "#/") {
      // If we are navigating back to universe root, close active panel
      const detailPanel = document.getElementById("sphere-detail-panel");
      if (detailPanel && detailPanel.classList.contains("is-open")) {
        if (window.SpherePanels && typeof window.SpherePanels.closePanel === "function") {
          window.SpherePanels.closePanel();
        }
      }
    }
  }

  function dispose() {
    if (!initialized) return;
    window.removeEventListener("hashchange", handleRoute);
    initialized = false;
  }

  // Expose
  window.SphereRouter = {
    init,
    handleRoute,
    dispose
  };
})();
