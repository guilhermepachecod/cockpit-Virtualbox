document.addEventListener("DOMContentLoaded", () => {
  loadVMList();
});

function loadVMList() {
  // Aqui você pode carregar a lista de VMs dinamicamente
  const vmList = [
    { id: 1, name: "VM 1", status: "poweredOn" },
    { id: 2, name: "VM 2", status: "poweredOff" },
  ];

  const vmListElement = document.getElementById('vmList');
  vmListElement.innerHTML = vmList.map(vm => `
    <div class="vmItem" data-id="${vm.id}">
      <span class="vmName">${vm.name}</span>
      <span class="vmStatus ${vm.status === 'poweredOn' ? 'green' : 'red'}"></span>
    </div>
  `).join('');

  document.querySelectorAll('.vmItem').forEach(item => {
    item.addEventListener('click', event => {
      const vmId = event.currentTarget.getAttribute('data-id');
      loadVMDetails(vmId);
    });
  });
}

function loadVMDetails(vmId) {
  // Aqui você pode carregar os detalhes da VM com base no vmId
  const vmDetails = {
    1: { name: "VM 1", cpu: 2, memory: "4GB" },
    2: { name: "VM 2", cpu: 4, memory: "8GB" }
  };

  const vmDetailElement = document.getElementById('vmDetails');
  const vmData = vmDetails[vmId];
  vmDetailElement.innerHTML = `
    <h2>${vmData.name}</h2>
    <p>CPU: ${vmData.cpu}</p>
    <p>Memory: ${vmData.memory}</p>
  `;
}
