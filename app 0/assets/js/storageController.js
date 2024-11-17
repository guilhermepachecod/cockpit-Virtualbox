function initializeStorageController() {
    document.getElementById('addStorageBtn').addEventListener('click', () => {
      const vmId = 'your-vm-id'; // Substituir pelo ID da VM
      addStorageController(vmId);
    });
  }
  
  function addStorageController(vmId) {
    cockpit.spawn(['VBoxManage', 'storagectl', vmId, '--name', 'MyController', '--add', 'sata'])
      .then(output => {
        console.log("Controlador adicionado:", output);
        document.getElementById('storageList').innerHTML += `<div>Controlador adicionado: ${output}</div>`;
      })
      .catch(error => console.error('Erro:', error));
  }
  