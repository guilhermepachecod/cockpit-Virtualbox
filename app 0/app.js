function loadView(viewName) {
    fetch(`views/${viewName}.html`)
      .then(response => response.text())
      .then(html => {
        document.getElementById('app').innerHTML = html;
        initializeControllers(viewName);
      });
  }
  
  function initializeControllers(viewName) {
    if (viewName === 'storageView') {
      initializeStorageController();
    } else if (viewName === 'networkView') {
      initializeNetworkController();
    } else if (viewName === 'vmView') {
      initializeVMController();
    }
  }
  
  window.onload = function() {
    loadView('vmView');
  };
  
  document.getElementById('storageNav').addEventListener('click', function() {
    loadView('storageView');
  });
  
  document.getElementById('networkNav').addEventListener('click', function() {
    loadView('networkView');
  });
  
  document.getElementById('vmNav').addEventListener('click', function() {
    loadView('vmView');
  });
  