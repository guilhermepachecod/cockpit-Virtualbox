// Função para listar as máquinas virtuais do VirtualBox
function listarMaquinasVirtuais(lastUUID) {
    // Executar o comando 'vboxmanage showvminfo' usando a API do Cockpit
    cockpit.spawn(['vboxmanage', 'list', 'vms', '-l']).done(function(data) {
        var vmList = data.split('\n\n');

        // Limpar a lista anterior
        var ul = document.getElementById('vmList');
        ul.innerHTML = '';

        // Adicionar os nomes e status das máquinas virtuais à lista
        vmList.forEach(function(vm) {
            var li = document.createElement('li');
            li.classList.add('vm-item');
            // Extrair o nome da máquina virtual
            var nomeVM = extrairInfoVM(vm, 'Name');
            // Extrair o estado da máquina virtual
            var estadoVM = extrairInfoVM(vm, 'State');
            var resultado = dividirEstado(estadoVM);
            var UUID = extrairInfoVM(vm, 'UUID');
            if(lastUUID === UUID){li.classList.add('selected')};
            li.onclick = function() {
                ShowMachineClick(UUID);
            };
            li.id = UUID;
            // Verificar se as informações foram encontradas corretamente
            if (nomeVM !== 'Não encontrado' && estadoVM !== 'Não encontrado') {
                // Adicionar elemento para o nome e estado da máquina virtual
                var nomeNomeElemento = document.createElement('span');
                var nomeEstadoElemento = document.createElement('span');

                nomeNomeElemento.textContent = nomeVM;
                nomeEstadoElemento.textContent = resultado.estado;

                nomeNomeElemento.classList.add('vm-span');
                nomeEstadoElemento.classList.add('vm-span');
                
                adicionarClassState(resultado, li);
                // Adicionar elemento à lista
                li.appendChild(nomeNomeElemento);
                li.appendChild(nomeEstadoElemento);
                ul.appendChild(li);
            }
        });
    }).fail(function(error) {
        // Exibir mensagem de erro se houver falha na execução do comando
        console.error('Error listing virtual machines::', error);
        var ul = document.getElementById('vmList');
        ul.innerHTML = '<li class="vm-item">Error listing virtual machines:: ' + error + '</li>';
    });
}


function ShowMachineClick(UUID) {
    listarMaquinasVirtuais(UUID);
    var items = document.querySelectorAll('.vm-item');
    items.forEach(function (element) {
        element.classList.remove('selected');
    });
    // Executar comando VBoxManage showvminfo
    cockpit.spawn(['VBoxManage', 'showvminfo', UUID, "--machinereadable"]).done(function(data) {
        var vmList = data.split('\n\n');
        // Limpar a lista anterior
        var ul = document.getElementById('vmInfo');
        ul.innerHTML = '';
        var li = document.createElement('li');
        var buttonNew = document.createElement('button');
        var buttonAdd = document.createElement('button');
        var buttonRem = document.createElement('button');
        var buttonSet = document.createElement('button');
        var buttonSto = document.createElement('button');
        var buttonFst = document.createElement('button');

        buttonNew.textContent = "New";
        buttonAdd.textContent = "Add";
        buttonRem.textContent = "Remove";
        buttonSet.textContent = "Settings";
        buttonSto.textContent = "Start";
        buttonFst.textContent = "Force";

        buttonNew.setAttribute('class', 'action-buttons');
        buttonAdd.setAttribute('class', 'action-buttons');
        buttonRem.setAttribute('class', 'action-buttons');
        buttonSet.setAttribute('class', 'action-buttons');
        buttonSto.setAttribute('class', 'action-buttons');
        buttonFst.setAttribute('class', 'action-buttons');

        buttonRem.onclick = function() {
            removeVirtualMachine(UUID);
        };

        buttonNew.onclick = function() {
            newVirtualMachine(UUID);
        };

        buttonFst.onclick = function() {
            shutdownVM(UUID);
        };
        li.appendChild(buttonNew);
        li.appendChild(buttonAdd);
        li.appendChild(buttonRem);
        li.appendChild(buttonSet);
        li.appendChild(buttonSto);
        li.appendChild(buttonFst);
        ul.appendChild(li);
        var lidiv = document.createElement('div');
        lidiv.classList.add('div-form');
        var uldiv = document.createElement('ul');
        vmList.forEach(function(vm) {
            if(vm){
                //general
                var br = document.createElement('br');
                uldiv.appendChild(br);
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "General:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);
                var li = document.createElement('li');
                var NameElemento = document.createElement('span');
                NameElemento.textContent = "Name :            " + machineInfoVM(vm, 'name');
                li.appendChild(NameElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var GuestElemento = document.createElement('span');
                GuestElemento.textContent = "Guest OS :       " + machineInfoVM(vm, 'ostype');
                li.appendChild(GuestElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "CPU exec cap :      " + machineInfoVM(vm, 'cpuexecutioncap');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);
                //system
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "System:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Memory size :   " + machineInfoVM(vm, 'memory');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "State :         " + machineInfoVM(vm, 'VMState');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "State Time:         " + machineInfoVM(vm, 'VMStateChangeTime');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "VT-x VPID :     " + machineInfoVM(vm, 'vtxvpid');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Autostart Enabled : " + machineInfoVM(vm, 'autostart-enabled');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Autostart Delay : " + machineInfoVM(vm, 'autostart-delay');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "VRDE : " + machineInfoVM(vm, 'vrde');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "VRDE : " + machineInfoVM(vm, 'vrdeports');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);

                //Storage Controllers:
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "Storage:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Storage Controllers :   " + machineInfoVM(vm, 'storagecontrollername0');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);

                //Network Controllers:
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "Networks:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                uldiv.appendChild(li);
                var br = document.createElement('br');
                uldiv.appendChild(br);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 1 :   " + machineInfoVM(vm, 'nic1');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li);   
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 2 :   " + machineInfoVM(vm, 'nic2');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 3 :   " + machineInfoVM(vm, 'nic3');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 4 :   " + machineInfoVM(vm, 'nic4');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 5 :   " + machineInfoVM(vm, 'nic5');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 6 :   " + machineInfoVM(vm, 'nic6');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 7 :   " + machineInfoVM(vm, 'nic7');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 8 :   " + machineInfoVM(vm, 'nic8');
                li.appendChild(SystemeElemento);
                uldiv.appendChild(li); 

                var estado = machineInfoVM(vm, 'VMState');
                startStopMachine(buttonSto, estado, UUID);
                settingsMachine(buttonSet, estado, UUID);
            };
            lidiv.appendChild(uldiv);
            ul.appendChild(lidiv);
        });
    }).fail(function(error) {
        // Exibir mensagem de erro se houver falha na execução do comando
        var ul = document.getElementById('vmList');
        ul.innerHTML = '<li class="vm-item">Erro ao listar as informações virtuais: ' + error + '</li>';
    });
}

function shutdownVM(UUID) {
    var confirmPowerOff = confirm("Are you sure you want to power off the virtual machine? This action cannot be undone.");
    if (confirmPowerOff) {
        cockpit.spawn(['VBoxManage', 'controlvm', UUID, 'poweroff']).done(function(data) {
            listarMaquinasVirtuais(UUID);
        }).fail(function(error) {
            console.error("Erro ao desligar a VM:", error);
        });
    }
}

function removeVirtualMachine(UUID){
    var confirmRemoval = confirm("Are you sure you want to remove the virtual machine? This action cannot be undone.");
    if (confirmRemoval) {
        cockpit.spawn(['VBoxManage', 'unregistervm', UUID, "--delete"]).done(function(data) {
            listarMaquinasVirtuais(UUID);
        }).fail(function(error) {
            console.error("Erro ao criar VM:", error);
        });
    }
}

function newVirtualMachine(UUID) {
    var ul = document.getElementById('vmInfo');
    ul.innerHTML = '';

    var li = document.createElement('li');
    var buttonBack = document.createElement('button');
    buttonBack.textContent = "Back";
    buttonBack.setAttribute('class', 'action-buttons');
    buttonBack.onclick = function() {
        ShowMachineClick(UUID);
    };
    var buttonFinish = document.createElement('button');
    buttonFinish.textContent = "Finish";
    buttonFinish.setAttribute('class', 'action-buttons');
    buttonFinish.onclick = function() {
        finishCreation("createNewVBoxID");
    };
    
    var form = document.createElement('form');
    form.id = "createNewVBoxID";
    var br = document.createElement('br');
    form.appendChild(br);

    var CreateElemento = document.createElement('span');
    var BoldElemento = document.createElement('strong');
    BoldElemento.textContent = "Create Virtual Machine:";
    CreateElemento.appendChild(BoldElemento);
    form.appendChild(CreateElemento);

    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);

    var NameElemento = document.createElement('span');
    NameElemento.textContent = "Name :            ";
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'name';
    nameInput.value = 'VirtualBoxMachine';
    form.appendChild(NameElemento);
    form.appendChild(nameInput);
/*
    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);
    
    var FolderElemento = document.createElement('span');
    FolderElemento.textContent = "Folder :            ";
    var folderInput = document.createElement('input');
    folderInput.type = 'text';
    folderInput.id = 'folder';
    folderInput.value = '~/VirtualBox\ VMs/';
    //form.appendChild(FolderElemento);
    //form.appendChild(folderInput);

    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);

    var ISOElemento = document.createElement('span');
    ISOElemento.textContent = "ISO :            ";
    var isoInput = document.createElement('input');
    isoInput.type = 'text';
    isoInput.id = 'iso';
    isoInput.value = '~/Downloads/';
    form.appendChild(ISOElemento);
    form.appendChild(isoInput);

    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);
    */
    var typeElemento = document.createElement('span');
    typeElemento.textContent = "Version :            ";
    var typeSelect = document.createElement('select');
    typeSelect.id = 'version';
    cockpit.spawn(['VBoxManage', 'list', 'ostypes']).done(function(data) {
        var output = data.split('\n');
        output.forEach(function(line) {
            if (line.startsWith('ID:')) {
                osID = line.split(':')[1].trim();
            }
            if (line.startsWith('Description:')) {     
                var optionElement = document.createElement('option');                    
                osType = line.split(':')[1].trim();
                optionElement.value = osID;
                optionElement.textContent = osType;
                typeSelect.appendChild(optionElement);
            }
        });

    });

    form.appendChild(typeElemento);
    form.appendChild(typeSelect);

    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);

    var memoryElemento = document.createElement('span');
    memoryElemento.textContent = "Memory :            ";
    var memoryInput = document.createElement('input');
    memoryInput.type = 'text';
    memoryInput.id = 'memory';
    memoryInput.value = '1024';
    form.appendChild(memoryElemento);
    form.appendChild(memoryInput);

    var memoryElemento = document.createElement('span');
    var memorySelect = document.createElement('select');
    for($mem=1; $mem <= 16;$mem++){
        var optionElement = document.createElement('option'); 
        optionElement.text = $mem;
        optionElement.value = 1024 * $mem;
        memorySelect.appendChild(optionElement);
    }
    memorySelect.addEventListener("change", function(){
        selectedOption = memorySelect.options[memorySelect.selectedIndex];
        selectedValue = parseInt(selectedOption.value);
        memoryInput.value = selectedValue.toString();
    });
    form.appendChild(memoryElemento);
    form.appendChild(memorySelect);

    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);

    var cpusElemento = document.createElement('span');
    cpusElemento.textContent = "Cpus :            ";
    var cpusInput = document.createElement('input');
    cpusInput.type = 'text';
    cpusInput.id = 'cpu';
    cpusInput.value = '1';
    form.appendChild(cpusElemento);
    form.appendChild(cpusInput);


   //end
   
    li.append(buttonBack);
    li.append(buttonFinish);
    ul.appendChild(li);
    
    var li = document.createElement('li');
    var div = document.createElement('div');
    div.id = "CreateElemento";

    div.appendChild(form);
    li.appendChild(div);
    ul.appendChild(li);
}

function editDiscs(){

    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);
    //opt1 
    var diskLabel = document.createElement('label');
    var diskOption = document.createElement('input');
    diskOption.type = 'radio';
    diskOption.name = 'options';
    diskOption.id = 'option1';
    diskOption.addEventListener("change", function(){
        document.getElementById('group1').style.display="block";
        document.getElementById('group2').style.display="none";
    });
    diskOption.checked = true;
    diskLabel.appendChild(diskOption);
    diskLabel.appendChild(document.createTextNode("Create a Virtual Hard Disk Now"));
    form.appendChild(diskLabel);
    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);
    var br = document.createElement('br');
    form.appendChild(br);
    //conteudo grupo 1

    var groupElemento = document.createElement('div');
    groupElemento.id = 'group1';

    var diskElemento = document.createElement('span');
    diskElemento.textContent = "Hard Disk File Location and Size :            ";
    
    var diskInput = document.createElement('input');
    diskInput.type = 'text';
    diskOption.name = 'options';
    diskInput.value = 'NewVirtualDisk1';
    diskInput.id = "folderdisk";

    var disksizeInput = document.createElement('input');
    disksizeInput.type = 'text';
    diskOption.name = 'options';
    disksizeInput.value = '20480';
    disksizeInput.id = "sizedisk";

    groupElemento.appendChild(diskElemento);
    var br = document.createElement('br');
    groupElemento.appendChild(br);
    var br = document.createElement('br');
    groupElemento.appendChild(br);
    groupElemento.appendChild(diskInput);
    var br = document.createElement('br');
    groupElemento.appendChild(br);
    var br = document.createElement('br');
    groupElemento.appendChild(br);
    groupElemento.appendChild(disksizeInput);
    var br = document.createElement('br');
    groupElemento.appendChild(br);
    var br = document.createElement('br');
    groupElemento.appendChild(br);

    form.appendChild(groupElemento);
    ///opt2

    var diskLabel = document.createElement('label');
    var diskOption = document.createElement('input');
    diskOption.type = 'radio';
    diskOption.name = 'options';
    diskOption.id = 'option2';
    diskOption.addEventListener("change", function(){
        document.getElementById('group1').style.display="none";
        document.getElementById('group2').style.display="block";
    });
    diskLabel.appendChild(diskOption);
    diskLabel.appendChild(document.createTextNode("Use an Existing Virtual Hard Drive File"));
    form.appendChild(diskLabel);
    var br = document.createElement('br');
    form.appendChild(br);
    //conteudo grupo 2

    var groupElemento = document.createElement('div');
    groupElemento.id = 'group2';
    groupElemento.style.display="none";
    var hddSelect = document.createElement('select');
    hddSelect.name = 'options';
    hddSelect.id =  "diskuuid";
    
    cockpit.spawn(['VBoxManage', 'list', 'hdds']).done(function(data) {
        var output = data.split('\n');
        output.forEach(function(line) {
            if (line.startsWith('UUID:')) {
                hddID = line.split(':')[1].trim();
            }
            if (line.startsWith('Location:')) {      
                var optionElement = document.createElement('option');            
                optionElement.id = hddID;
                optionElement.value = hddID;
                lc = line.split(':')[1].trim();
                lcSrk = lc.replace(/\/[^\/]*\/[^\/]*\/[^\/]*/, '').replace(/^\s*\/\s*/, '').trim();
                var match = lcSrk.match(/\{([^}]+)\}/);
                if (match) {
                    var idValue = match[1].substring(0, 4) + '...';
                    lcSrk = lcSrk.replace(/\{[^}]+\}/, idValue); 
                }
                optionElement.textContent = lcSrk;
                hddSelect.appendChild(optionElement);
            }
            if (line.startsWith('Capacity:')) {                     
                capacity = line.split(':')[1].trim();
                document.getElementById(hddID).textContent = document.getElementById(hddID).textContent + " " + capacity;
            }
        });
    });
    
    groupElemento.appendChild(typeElemento);
    groupElemento.appendChild(hddSelect);


    form.appendChild(groupElemento);
    //opt3
    var diskLabel = document.createElement('label');
    var diskOption = document.createElement('input');
    diskOption.type = 'radio';
    diskOption.name = 'options';
    diskOption.id = 'option3';
    diskOption.addEventListener("change", function(){
        document.getElementById('group1').style.display="none";
        document.getElementById('group2').style.display="none";
    });
    diskLabel.appendChild(diskOption);
    diskLabel.appendChild(document.createTextNode("Do Not Add a Virtual Hard Drive"));
    form.appendChild(diskLabel);

}

function finishCreation(createNewVBoxID){
    var form = document.getElementById(createNewVBoxID);
    var name = document.getElementById("name");
    //var folder = document.getElementById("folder");
    //var iso = document.getElementById("iso");
    var version = document.getElementById("version");
    var memory = document.getElementById("memory");
    var cpu = document.getElementById("cpu");
    var folderdisk = document.getElementById("folderdisk");
    var sizedisk = document.getElementById("sizedisk");
    var diskuuid = document.getElementById("diskuuid");

    var command = [
        'VBoxManage',
        'createvm',
        '--name', name.value,
        '--ostype', version.value,
        '--register'
    ];
    cockpit.spawn(command).done(function(data) {
        let newUUID = null;
        var output = data.split('\n');
        output.forEach(function(line) {
            if (line.startsWith('UUID:')) {
                newUUID = line.split(':')[1].trim();                
            }
        });
        var command = [
            'VBoxManage',
            'modifyvm',
            newUUID,
            '--memory', memory.value,
            '--cpus', cpu.value,
            '--vrde', 'on'
        ];
        cockpit.spawn(command).done(function(data) {
            console.log(data);
        }).fail(function(error) {
            console.error("Erro ao modifyvm VM:", error);
        });
        ShowMachineClick(newUUID);
    }).fail(function(error) {
        console.error("Erro ao createvm VM:", error);
    });
    //createVirtualDisk(name.value, sizedisk.value, folderdisk.value);
    //addStorageController(newUUID, 'on')
    
}

function createVirtualDisk(name ,sizedisk, folderdisk){
        
    var command = [
        'VBoxManage',
        'createmedium',
        'disk',
        '--filename', '/home/maverick/VirtualBox\ VMs/' + name + '/' + folderdisk + '.vdi',
        '--size', sizedisk
    ];
    cockpit.spawn(command).done(function(data) {
        var uuidMatch = data.match(/UUID:\s*([a-f0-9\-]+)/);
        if (uuidMatch && uuidMatch[1]) {
            var diskID = uuidMatch[1].trim();
            return diskID;
        } 
    }).fail(function(error) {
        console.error("Erro ao criar DISCO:", error);
    });
}

function addStorageController(UUID, state =  'off'){
    var command = [
        'VBoxManage',
        'storagectl',
        UUID,
        '--name', 'SATA',
        '--add', 'sata',
        '--bootable', 'on',
    ];
    console.log(command);
    cockpit.spawn([command]).done(function(data) {
        console.log(data);
    }).fail(function(error) {
        console.error("Erro ao criar storagectl:", error);
    });
}
function attachDisk(UUID, diskFilePath){
    var command = [
        '--storagectl', 'SATA',
        '--port', '1',
        '--device', '0',
        '--type', 'hdd',
        '--medium', diskFilePath
    ];
    cockpit.spawn(['VBoxManage', 'storageattach', UUID, command]).done(function(data) {
        var output = data.split('\n');
        output.forEach(function(line) {
            console.log(line);
            if (line.startsWith('UUID:')) {
                hddID = line.split(':')[1].trim();                
            }
        });
    }).fail(function(error) {
        console.error("Erro ao criar VM:", error);
    });
}


function settingsMachine(button, estado, UUID){
    if(estado == 'poweroff' ){
        button.disabled = false;
        button.onclick = function() {
            showSettings(UUID);
        };
    }else{
        button.disabled = true;
    }
}

function showSettings(UUID){
    var ul = document.getElementById('vmInfo');
    ul.innerHTML = '';

    var li = document.createElement('li');
    var buttonBack = document.createElement('button');
    buttonBack.textContent = "Back";
    buttonBack.setAttribute('class', 'action-buttons');
    buttonBack.onclick = function() {
        ShowMachineClick(UUID);
    };
    var buttonGeneral = document.createElement('button');
    buttonGeneral.textContent = "General";
    buttonGeneral.setAttribute('class', 'action-buttons');
    buttonGeneral.onclick = function() {
        showGeneral(UUID);
    };
    var buttonSystem = document.createElement('button');
    buttonSystem.textContent = "System";
    buttonSystem.setAttribute('class', 'action-buttons');
    buttonSystem.onclick = function() {
        showSystem(UUID);
    };
    var buttonStorage = document.createElement('button');
    buttonStorage.textContent = "Storage";
    buttonStorage.setAttribute('class', 'action-buttons');
    buttonStorage.onclick = function() {
        showStorage(UUID);
    };
    var buttonNetwork = document.createElement('button');
    buttonNetwork.textContent = "Network";
    buttonNetwork.setAttribute('class', 'action-buttons');
    buttonNetwork.onclick = function() {
        showNetworks(UUID);
    };
    var buttonUSB = document.createElement('button');
    buttonUSB.textContent = "USB";
    buttonUSB.setAttribute('class', 'action-buttons');
    buttonUSB.onclick = function() {
        alert(UUID);
    };
    var buttonFolders = document.createElement('button');
    buttonFolders.textContent = "Folders";
    buttonFolders.setAttribute('class', 'action-buttons');
    buttonFolders.onclick = function() {
        alert(UUID);
    };
    li.append(buttonBack);
    li.append(buttonGeneral);
    li.append(buttonSystem);
    li.append(buttonStorage);
    li.append(buttonNetwork);
    li.append(buttonUSB);
    li.append(buttonFolders);

    ul.appendChild(li);

    var li = document.createElement('li');
    var div = document.createElement('div');
    div.id = "settingsInfo";
    li.appendChild(div);
    ul.appendChild(li);
}

function showGeneral(UUID){
    var div = document.getElementById('settingsInfo');
    div.innerHTML = '';

    var form = document.createElement('form');
    cockpit.spawn(['VBoxManage', 'showvminfo', UUID, "--machinereadable"]).done(function(data) {
        var vmList = data.split('\n\n');
        vmList.forEach(function(vm) {
            if(vm){

                //general
                var br = document.createElement('br');
                form.appendChild(br);

                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "General:";
                GeneralElemento.appendChild(BoldElemento);
                form.appendChild(GeneralElemento);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);


                var NameElemento = document.createElement('span');
                NameElemento.textContent = "Name :            ";
                var nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = machineInfoVM(vm, 'name');
                form.appendChild(NameElemento);
                form.appendChild(nameInput);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);
                actualostype = machineInfoVM(vm, 'type');
                var typeElemento = document.createElement('span');
                typeElemento.textContent = "Version :            ";
                var typeSelect = document.createElement('select');
                cockpit.spawn(['VBoxManage', 'list', 'ostypes']).done(function(data) {
                    var output = data.split('\n');
                    output.forEach(function(line) {
                        if (line.startsWith('ID:')) {
                            osID = line.split(':')[1].trim();
                        }
                        if (line.startsWith('Description:')) {     
                            var optionElement = document.createElement('option');                    
                            osType = line.split(':')[1].trim();
                            if (osType === machineInfoVM(vm, 'type')) {
                                optionElement.selected = true;
                            }
                            optionElement.value = osID;
                            optionElement.textContent = osType;
                            typeSelect.appendChild(optionElement);
                        }
                    });

                });
                
                form.appendChild(typeElemento);
                form.appendChild(typeSelect);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);
                var SnapshotElemento = document.createElement('span');
                SnapshotElemento.textContent = "Snapshot Folder :            ";
                var snapshotInput = document.createElement('input');
                snapshotInput.type = 'text';
                snapshotInput.value = machineInfoVM(vm, 'SnapFldr');
                form.appendChild(SnapshotElemento);
                form.appendChild(snapshotInput);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);

                var buttonCancel = document.createElement('button');
                buttonCancel.textContent = "Cancel";
                buttonCancel.onclick = function() {
                    showGeneral(UUID);
                    alert('Changes canceled!');
                };

                var buttonSave = document.createElement('button');
                buttonSave.textContent = "OK";
                buttonSave.onclick = function() {
                    showGeneral(UUID);
                    alert('General settings saved successfully!');
                };
                form.appendChild(buttonCancel);
                form.appendChild(buttonSave);
            }
        });
    }).fail(function(error) {
        // Exibir mensagem de erro se houver falha na execução do comando
        var ul = document.getElementById('vmList');
        ul.innerHTML = '<li class="vm-item">Erro ao listar as informações virtuais: ' + error + '</li>';
    });
    div.appendChild(form);
}
function showSystem(UUID){
    var div = document.getElementById('settingsInfo');
    div.innerHTML = '';

    var form = document.createElement('form');
    cockpit.spawn(['VBoxManage', 'showvminfo', UUID, "--machinereadable"]).done(function(data) {
        var vmList = data.split('\n\n');
        vmList.forEach(function(vm) {
            if(vm){

                //system
                var br = document.createElement('br');
                form.appendChild(br);

                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "System:";
                GeneralElemento.appendChild(BoldElemento);
                form.appendChild(GeneralElemento);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);

                var cpusElemento = document.createElement('span');
                cpusElemento.textContent = "Cpus :            ";
                var cpusInput = document.createElement('input');
                cpusInput.type = 'text';
                cpusInput.value = machineInfoVM(vm, 'cpus');
                form.appendChild(cpusElemento);
                form.appendChild(cpusInput);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);

                var memoryElemento = document.createElement('span');
                memoryElemento.textContent = "Memory :            ";
                var memoryInput = document.createElement('input');
                memoryInput.type = 'text';
                memoryInput.value = machineInfoVM(vm, 'memory');
                form.appendChild(memoryElemento);
                form.appendChild(memoryInput);

                var memoryElemento = document.createElement('span');
                var memorySelect = document.createElement('select');
                for($mem=1; $mem <= 16;$mem++){
                    var optionElement = document.createElement('option'); 
                    optionElement.text = $mem;
                    optionElement.value = 1024 * $mem;
                    if($mem ==  machineInfoVM(vm, 'memory') / 1024){
                        optionElement.selected = true;
                    }
                    memorySelect.appendChild(optionElement);
                }
                memorySelect.addEventListener("change", function(){
                    selectedOption = memorySelect.options[memorySelect.selectedIndex];
                    selectedValue = parseInt(selectedOption.value);
                    memoryInput.value = selectedValue.toString();
                });
                form.appendChild(memoryElemento);
                form.appendChild(memorySelect);

                var br = document.createElement('br');
                form.appendChild(br);
                var br = document.createElement('br');
                form.appendChild(br);

                var buttonCancel = document.createElement('button');
                buttonCancel.textContent = "Cancel";
                buttonCancel.onclick = function() {
                    showSystem(UUID);
                    alert('Changes canceled!');
                };

                var buttonSave = document.createElement('button');
                buttonSave.textContent = "OK";
                buttonSave.onclick = function() {
                    var changed = false;
                    var options = ["modifyvm", UUID];
                    if(memoryInput.value !== machineInfoVM(vm, 'memory')){
                        changed = true;
                        options.push("--memory", memoryInput.value);
                    }
                    if(cpusInput.value !== machineInfoVM(vm, 'cpus')){
                        changed = true;
                        options.push("--cpus", cpusInput.value);
                    }
                    if(changed){
                        var result = confirm("Do you want to proceed?");
                        if (result) {
                            cockpit.spawn(['VBoxManage'].concat(options)).done(function(data) {
                                showSystem(UUID);
                            }).fail(function(err) {
                                showSystem(UUID);
                            });
                        } else {
                            showSystem(UUID);
                        }
                    }else{
                        showSystem(UUID);
                    }    var div = document.getElementById('settingsInfo');
                    div.innerHTML = ''; // Limpa o conteúdo anterior
                
                    // Cria um formulário
                    var form = document.createElement('form');
                
                    // Cria um campo de entrada para o comando
                    var input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = 'Digite seu comando aqui';
                    input.id = 'commandInput'; // ID para acessar o campo mais tarde
                    form.appendChild(input);
                
                    // Cria um botão para executar o comando
                    var button = document.createElement('button');
                    button.type = 'button'; // Tipo 'button' para evitar o envio do formulário
                    button.textContent = 'Executar Comando';
                    
                    // Adiciona um evento de clique ao botão
                    button.addEventListener('click', function() {
                        var command = input.value; // Obtém o comando do campo de entrada
                        if (command) {
                            // Executa o comando usando cockpit.spawn
                            cockpit.spawn(['bash', '-c', command]).then(function(output) {
                                console.log('Saída do comando:', output); // Exibe a saída no console
                            }).catch(function(error) {
                                console.error('Erro ao executar o comando:', error); // Exibe erro no console
                            });
                        } else {
                            console.warn('Por favor, digite um comando.'); // Aviso se o campo estiver vazio
                        }
                    });
                
                    form.appendChild(button);
                
                    // Cria um botão para abrir o gerenciador de arquivos
                    var dirButton = document.createElement('button');
                    dirButton.type = 'button'; // Tipo 'button' para evitar o envio do formulário
                    dirButton.textContent = 'Navegar Diretórios';
                
                    // Adiciona um evento de clique ao botão do diretório
                    dirButton.addEventListener('click', function() {
                        navigateDirectories('/'); // Inicia a navegação a partir da raiz
                    });
                
                    form.appendChild(dirButton);
                    div.appendChild(form); // Adiciona o formulário à div
                };
                form.appendChild(buttonCancel);
                form.appendChild(buttonSave);
            }
        });
    }).fail(function(error) {
        // Exibir mensagem de erro se houver falha na execução do comando
        var ul = document.getElementById('vmList');
        ul.innerHTML = '<li class="vm-item">Erro ao listar as informações virtuais: ' + error + '</li>';
    });
    div.appendChild(form);
}
function addController(vmId) {
    var detailsContainer = document.querySelector('.details-container');
    detailsContainer.innerHTML = ''; // Limpa o conteúdo anterior

    // Criação do formulário
    var form = document.createElement('form');
    form.className = 'add-controller-form';

    // Campo para o nome do controlador
    var nameLabel = document.createElement('label');
    nameLabel.textContent = 'Nome do Controlador:';
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'controllerName';
    nameInput.required = true; // Torna o campo obrigatório
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(document.createElement('br'));

    // Campo para selecionar o tipo de controlador
    var typeLabel = document.createElement('label');
    typeLabel.textContent = 'Tipo de Controlador:';
    var typeSelect = document.createElement('select');
    typeSelect.id = 'controllerType';
    
    // Adicionando opções ao select
    var types = ['sata', 'ide', 'scsi', 'usb', 'pci'];
    types.forEach(function(type) {
        var option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitaliza a primeira letra
        typeSelect.appendChild(option);
    });
    
    form.appendChild(typeLabel);
    form.appendChild(typeSelect);
    form.appendChild(document.createElement('br'));

    // Campo para selecionar se é bootável
    var bootableLabel = document.createElement('label');
    bootableLabel.textContent = 'Bootável:';
    var bootableSelect = document.createElement('select');
    bootableSelect.id = 'bootableOption';
    
    // Adicionando opções ao select
    var bootableOptions = ['on', 'off'];
    bootableOptions.forEach(function(option) {
        var bootOption = document.createElement('option');
        bootOption.value = option;
        bootOption.textContent = option.charAt(0).toUpperCase() + option.slice(1); // Capitaliza a primeira letra
        bootableSelect.appendChild(bootOption);
    });
    
    form.appendChild(bootableLabel);
    form.appendChild(bootableSelect);
    form.appendChild(document.createElement('br'));

    // Botão para salvar
    var saveButton = document.createElement('button');
    saveButton.type = 'button'; // Não envia o formulário
    saveButton.textContent = 'Salvar';
    saveButton.onclick = function() {
        var controllerName = nameInput.value;
        var controllerType = typeSelect.value;
        var bootable = bootableSelect.value;

        // Comando a ser executado
        var command = `VBoxManage storagectl ${vmId} --name ${controllerName} --add ${controllerType} --bootable ${bootable}`;
        console.log("Comando a ser executado:", command);
        
        // Executa o comando usando cockpit.spawn
        cockpit.spawn(command.split(' ')).done(function() {
            alert("Controlador adicionado com sucesso: " + controllerName);
            showStorage(vmId);
            // Aqui você pode adicionar lógica para atualizar a interface, se necessário
        }).fail(function(error) {
            alert("Erro ao adicionar controlador: " + error);
            console.error("Erro:", error);
        });
    };
    
    form.appendChild(saveButton);
    detailsContainer.appendChild(form);
}

function removeController(vmId, controllerName) {
    // Confirmação antes de remover
    if (confirm("Tem certeza que deseja remover o controlador: " + controllerName + "?")) {
        // Comando a ser executado
        var command = `VBoxManage storagectl ${vmId} --name ${controllerName} --remove`;
        console.log("Comando a ser executado:", command);
        
        // Tente dividir o comando de forma mais robusta
        var commandArray = command.split(/\s+/);
        console.log("Array de comando:", commandArray);
        
        cockpit.spawn(commandArray).done(function(data) {
            alert("Controlador removido com sucesso: " + controllerName);
            showStorage(vmId); // Atualiza a exibição após a remoção
        }).fail(function(error) {
            alert("Erro ao remover controlador: " + error.message);
            console.error("Erro:", error);
            console.error("Saída do comando:", error.data); // Captura a saída do comando
        });
    }
}



function showStorage(UUID) {
    var div = document.getElementById('settingsInfo');
    div.innerHTML = ''; // Limpa o conteúdo anterior

    // Criação de um contêiner flexível
    var container = document.createElement('div');
    container.className = 'main-container';

    // Contêiner para os controladores
    var storageContainer = document.createElement('div');
    storageContainer.className = 'storage-container';

    // Contêiner para os detalhes
    var detailsContainer = document.createElement('div');
    detailsContainer.className = 'details-container';

    // Adiciona os contêineres ao contêiner principal
    container.appendChild(storageContainer);
    container.appendChild(detailsContainer);
    div.appendChild(container);

    var CreateElemento = document.createElement('span');
    var BoldElemento = document.createElement('strong');
    BoldElemento.textContent = "Storage:";
    CreateElemento.appendChild(BoldElemento);
    storageContainer.appendChild(CreateElemento);

    var br = document.createElement('br');
    storageContainer.appendChild(br);
    var br = document.createElement('br');
    storageContainer.appendChild(br);

    cockpit.spawn(['VBoxManage', 'showvminfo', UUID, '--machinereadable']).done(function(data) {
        var output = data.split('\n');
        var currentController = null;

        output.forEach(function(line) {
            if (line.startsWith('storagecontrollername')) {
                if (currentController) {
                    storageContainer.appendChild(currentController);
                }
                var storagecontrollername = line.split('=')[1].trim();
                currentController = document.createElement('div');
                currentController.className = 'storage-controller';
                currentController.innerHTML = "<strong>Controller: " + storagecontrollername + "</strong><br>";

                // Botões para adicionar e remover discos
                var addButton = document.createElement('button');
                addButton.textContent = '+';
                addButton.onclick = function() {
                    // Lógica para adicionar um novo disco
                    addDisk(UUID, storagecontrollername);
                    alert("Adicionar novo disco ao controlador: " + storagecontrollername);
                };
                currentController.appendChild(addButton);

                var removeButton = document.createElement('button');
                removeButton.textContent = '-';
                removeButton.onclick = function() {
                    removeController(UUID, storagecontrollername);
                };
                currentController.appendChild(removeButton);
            } else if (line.startsWith('\"IDE-') || line.startsWith('\"SATA-')) {
                if (line.endsWith('.iso\"') || line.endsWith('.vdi\"')) {
                    var fileItem = document.createElement('div');
                    fileItem.className = 'storage-item';
                    var fileName = line.split('/').pop(); // Nome do arquivo
                    var filePath = line.split('=')[1].trim().replace(/\"/g, ''); // Caminho completo do arquivo

                    fileItem.textContent = fileName;

                    // Adiciona evento de clique para mostrar detalhes do item
                    fileItem.onclick = function() {
                        detailsContainer.innerHTML = "<strong>Detalhes do Item:</strong><br>" +
                            "Nome: " + fileName + "<br>" +
                            "Caminho: <input type='text' id='diskPath' value='" + filePath + "' style='width: 100%;'/>" +
                            "<br><button id='saveButton'>Salvar</button>";

                        // Se for um arquivo .vdi, exibir tamanho
                        if (fileName.endsWith('.vdi')) {
                            // Aqui você pode adicionar lógica para obter o tamanho do disco
                            var currentSize = "10GB"; // Exemplo de tamanho atual
                            var virtualSize = "20GB"; // Exemplo de tamanho virtual
                            detailsContainer.innerHTML += "<br>Tamanho Atual: " + currentSize + "<br>Tamanho Virtual: " + virtualSize;
                        }

                        // Adiciona evento ao botão "Salvar"
                        document.getElementById('saveButton').onclick = function() {
                            var newPath = document.getElementById('diskPath').value;
                            // Aqui você pode adicionar a lógica para salvar o novo caminho
                            console.log("Novo caminho salvo:", newPath);
                            alert("Caminho salvo: " + newPath); // Exemplo de feedback
                        };
                    };

                    currentController.appendChild(fileItem);
                } else if (line.endsWith('none\"')) {
                    // Se não houver disco, você pode adicionar uma mensagem ou simplesmente ignorar
                }
            }
        });

        if (currentController) {
            storageContainer.appendChild(currentController);
        }

        // Sempre exibe o botão para adicionar um controlador
        var addControllerButton = document.createElement('button');
        addControllerButton.textContent = 'Add Controler';
        addControllerButton.onclick = function() {
            addController(UUID); // Chama a função com o UUID quando o botão é clicado
        };
        storageContainer.appendChild(addControllerButton);

            });
}

function addDisk(UUID, storageControllerName) {
    var detailsContainer = document.querySelector('.details-container');
    detailsContainer.innerHTML = ''; // Limpa o conteúdo anterior

    // Criação do formulário
    var form = document.createElement('form');
    form.className = 'add-disk-form';

    // Campo para o caminho do disco
    var diskLabel = document.createElement('label');
    diskLabel.textContent = 'Caminho do Disco (.iso ou .vdi):';
    var diskInput = document.createElement('input');
    diskInput.type = 'text';
    diskInput.id = 'diskPath';
    diskInput.required = true; // Torna o campo obrigatório
    form.appendChild(diskLabel);
    form.appendChild(diskInput);
    form.appendChild(document.createElement('br'));
    // Campo para selecionar a porta
    var portLabel = document.createElement('label');
    portLabel.textContent = 'Porta:';
    var portSelect = document.createElement('select');
    portSelect.id = 'diskPort';
    
    // Adicionando opções ao select (exemplo de 0 a 3)
    for (var i = 0; i < 4; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i; // Porta como número
        portSelect.appendChild(option);
    }
    
    form.appendChild(portLabel);
    form.appendChild(portSelect);
    form.appendChild(document.createElement('br'));

    // Campo para selecionar o dispositivo
    var deviceLabel = document.createElement('label');
    deviceLabel.textContent = 'Dispositivo:';
    var deviceSelect = document.createElement('select');
    deviceSelect.id = 'diskDevice';
    
    // Adicionando opções ao select
    var devices = ['0', '1']; // Exemplo de dispositivos
    devices.forEach(function(device) {
        var option = document.createElement('option');
        option.value = device;
        option.textContent = device; // Dispositivo como número
        deviceSelect.appendChild(option);
    });
    
    form.appendChild(deviceLabel);
    form.appendChild(deviceSelect);
    form.appendChild(document.createElement('br'));
    // Campo para selecionar o tipo de disco
    var typeLabel = document.createElement('label');
    typeLabel.textContent = 'Tipo de Disco:';
    var typeSelect = document.createElement('select');
    typeSelect.id = 'diskType';
    
    // Adicionando opções ao select
    var types = ['dvddrive', 'hdd'];
    types.forEach(function(type) {
        var option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitaliza a primeira letra
        typeSelect.appendChild(option);
    });
    
    form.appendChild(typeLabel);
    form.appendChild(typeSelect);
    form.appendChild(document.createElement('br'));

    // Campo para o tamanho do disco (apenas para HDD)
    var sizeLabel = document.createElement('label');
    sizeLabel.textContent = 'Tamanho do Disco (MB):';
    var sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.id = 'diskSize';
    sizeInput.required = true; // Torna o campo obrigatório
    form.appendChild(sizeLabel);
    form.appendChild(sizeInput);
    form.appendChild(document.createElement('br'));
    // Botão para salvar
    var saveButton = document.createElement('button');
    saveButton.type = 'button'; // Não envia o formulário
    saveButton.textContent = 'Salvar';
    saveButton.onclick = function() {
        var diskPath = diskInput.value;
        var diskPort = portSelect.value;
        var diskDevice = deviceSelect.value;
        var diskType = typeSelect.value;
        var diskSize = sizeInput.value; // Tamanho do disco

        if (diskType === 'dvddrive') {
            // Comando para dvddrive
            var command = `VBoxManage storageattach ${UUID} --storagectl ${storageControllerName} --port ${diskPort} --device ${diskDevice} --type dvddrive --medium ${diskPath}`;
            console.log("Comando a ser executado:", command);
            
            // Executa o comando
            // Executa o comando usando cockpit.spawn
            cockpit.spawn(command.split(' ')).done(function() {
                alert("Disco adicionado com sucesso: " + diskPath);
                showStorage(UUID);
            }).fail(function(error) {
                alert("Erro ao adicionar disco: " + error.message);
                console.error("Erro:", error);
                console.error("Saída do comando:", error.data); // Captura a saída do comando
            });
        } else if (diskType === 'hdd') {
            // Comando para criar o disco HDD
            var createCommand = `VBoxManage createmedium disk --filename "${diskPath}" --size ${diskSize}`;
            console.log("Comando para criar disco HDD:", createCommand);
            
            // Executa o comando para criar o disco
            cockpit.spawn(createCommand.split(' ')).done(function() {
                // Comando para anexar o disco HDD
                var attachCommand = `VBoxManage storageattach ${UUID} --storagectl ${storageControllerName} --port ${diskPort} --device ${diskDevice} --type hdd --medium "${diskPath}"`;
                console.log("Comando a ser executado:", attachCommand);
                
                // Executa o comando para anexar o disco
                cockpit.spawn(attachCommand.split(' ')).done(function() {
                    alert("Disco HDD adicionado com sucesso: " + diskPath);
                    showStorage(UUID);
                }).fail(function(error) {
                    alert("Erro ao anexar disco HDD: " + error.message);
                    console.error("Erro:", error);
                    console.error("Saída do comando:", error.data); // Captura a saída do comando
                });
            }).fail(function(error) {
                alert("Erro ao criar disco HDD: " + error.message);
                console.error("Erro:", error);
                console.error("Saída do comando:", error.data); // Captura a saída do comando
            });
        }
    };
    
    form.appendChild(saveButton);
    detailsContainer.appendChild(form);
}


function showNetworks(){
    var div = document.getElementById('settingsInfo');
    div.innerHTML = ''; // Limpa o conteúdo anterior

    // Cria um formulário
    var form = document.createElement('form');

    // Cria um campo de entrada para o comando
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Digite seu comando aqui';
    input.id = 'commandInput'; // ID para acessar o campo mais tarde
    form.appendChild(input);

    // Cria um botão para executar o comando
    var button = document.createElement('button');
    button.type = 'button'; // Tipo 'button' para evitar o envio do formulário
    button.textContent = 'Executar Comando';
    
    // Adiciona um evento de clique ao botão
    button.addEventListener('click', function() {
        var command = input.value; // Obtém o comando do campo de entrada
        if (command) {
            // Executa o comando usando cockpit.spawn
            cockpit.spawn(['bash', '-c', command]).then(function(output) {
                console.log('Saída do comando:', output); // Exibe a saída no console
            }).catch(function(error) {
                console.error('Erro ao executar o comando:', error); // Exibe erro no console
            });
        } else {
            console.warn('Por favor, digite um comando.'); // Aviso se o campo estiver vazio
        }
    });

    form.appendChild(button);

    // Cria um botão para abrir o gerenciador de arquivos
    var dirButton = document.createElement('button');
    dirButton.type = 'button'; // Tipo 'button' para evitar o envio do formulário
    dirButton.textContent = 'Navegar Diretórios';

    // Adiciona um evento de clique ao botão do diretório
    dirButton.addEventListener('click', function() {
        navigateDirectories('/'); // Inicia a navegação a partir da raiz
    });

    form.appendChild(dirButton);
    div.appendChild(form); // Adiciona o formulário à div
}


// Função para navegar pelos diretórios
function navigateDirectories(path) {
    // Executa o comando para listar os diretórios e arquivos
    cockpit.spawn(['bash', '-c', `ls -l "${path}"`]).then(function(output) {
        var div = document.getElementById('settingsInfo');
        div.innerHTML = ''; // Limpa o conteúdo anterior

        // Exibe a lista de arquivos e diretórios
        var files = output.split('\n');
        var list = document.createElement('ul');

        files.forEach(function(file) {
            if (file) {
                var listItem = document.createElement('li');
                listItem.textContent = file;

                // Adiciona um evento de clique para navegar para diretórios
                listItem.addEventListener('click', function() {
                    var parts = file.split(/\s+/);
                    var dirName = parts[parts.length - 1]; // Obtém o nome do diretório
                    navigateDirectories(`${path}/${dirName}`); // Navega para o diretório selecionado
                });

                list.appendChild(listItem);
            }
        });

        // Adiciona um botão para voltar ao diretório anterior
        var backButton = document.createElement('button');
        backButton.textContent = 'Voltar';
        backButton.addEventListener('click', function() {
            var parentPath = path.split('/').slice(0, -1).join('/') || '/';
            navigateDirectories(parentPath); // Volta ao diretório pai
        });

        div.appendChild(backButton);
        div.appendChild(list); // Adiciona a lista de arquivos e diretórios à div
    }).catch(function(error) {
        console.error('Erro ao listar diretórios:', error); // Exibe erro no console
    });
}
function startStopMachine(buttonSto, estado, UUID){
    switch (estado) {
        case 'running':
            buttonSto.textContent = 'Stop';
            buttonSto.onclick = function() {
                cockpit.spawn(['VBoxManage', 'controlvm', UUID, 'acpipowerbutton']).done(function(data) {
                    console.log(UUID);
                    console.log(data);
                    //ShowMachineClick(UUID);
                }).fail(function(err) {
                    ShowMachineClick(UUID);
                });
            };
            break;
        case 'poweroff':
            buttonSto.textContent = 'Start';
            buttonSto.onclick = function() {
                cockpit.spawn(['VBoxManage', 'startvm', UUID, '--type', 'headless']).done(function(data) {
                    ShowMachineClick(UUID);
                }).fail(function(err) {
                    ShowMachineClick(UUID);
                });
            };
            break;
        case 'saved':
            buttonSto.textContent = 'Return';
            break;
        default:
            buttonSto.textContent = 'Start';
            break;
    }
}

// Função para extrair informações de uma máquina virtual específica
function extrairInfoVM(info, chave) {
    var regex = new RegExp(chave + ':\\s*(.+?)\\s*(?:\n|$)', 'i');
    var match = info.match(regex);
    return match ? match[1] : 'Não encontrado';
}

function machineInfoVM(info, chave) {
    var regex = new RegExp(chave + '=\\s*"?([^"\n]+)"?', 'i');
    var match = info.match(regex);
    return match ? match[1] : 'Não encontrado';
}

function adicionarClassState(resultado, li) {
    // Verifica se o estado é "running"
    if (resultado.estado === "running") {
        // Adiciona a classe ao <li>
        li.classList.add('vm-item-running');
    }else{
        li.classList.remove('vm-item-running');
    }
}

function dividirEstado(s) {
    var index = s.indexOf('(since)');
    var estado = "";

    if (index !== -1) {
        estado = s.substring(0, index).trim(); // Obtém o estado removendo os espaços em branco no início e no final
    } else {
        estado = s.trim(); // Se "(since)" não for encontrado, assume que o estado é toda a string
    }

    // Remove qualquer outro texto que possa estar no estado, deixando apenas o estado em si
    estado = estado.split(' ')[0];

    return { estado: estado };
}
// Chamar a função ao carregar a página
window.onload = listarMaquinasVirtuais;
