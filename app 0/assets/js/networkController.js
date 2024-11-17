function initializeNetworkController() {
    document.getElementById('addNetworkBtn').addEventListener('click', () => {
      const vmId = 'your-vm-id'; // Substituir pelo ID da VM
      addNetwork(vmId);
    });
  }
  
  function addNetwork(vmId) {
    cockpit.spawn(['VBoxManage', 'modifyvm', vmId, '--nic1', 'nat'])
      .then(output => {
        console.log("Rede adicionada:", output);
        document.getElementById('networkList').innerHTML += `<div>Rede adicionada: ${output}</div>`;
      })
      .catch(error => console.error('Erro:', error));
  }
  