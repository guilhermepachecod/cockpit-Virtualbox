function initializeVMController() {
  document.getElementById('startStopVmBtn').addEventListener('click', startStopVm);

  }
  
  function startVM(vmId) {
    cockpit.spawn(['VBoxManage', 'startvm', vmId, '--type', 'headless'])
      .then(output => {
        console.log("VM iniciada:", output);
        document.getElementById('vmList').innerHTML += `<div>VM Iniciada: ${output}</div>`;
      })
      .catch(error => console.error('Erro:', error));
  }
  