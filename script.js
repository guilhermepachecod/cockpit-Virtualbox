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
        console.error('Erro ao listar as máquinas virtuais:', error);
        var ul = document.getElementById('vmList');
        ul.innerHTML = '<li class="vm-item">Erro ao listar as máquinas virtuais: ' + error + '</li>';
    });
}


function ShowMachineClick(UUID) {
    listarMaquinasVirtuais(UUID);
    var items = document.querySelectorAll('.vm-item');
    items.forEach(function (element) {
        element.classList.remove('selected');
    });
    document.getElementById(UUID).classList.add('selected');
    // Executar comando VBoxManage showvminfo
    cockpit.spawn(['VBoxManage', 'showvminfo', UUID, "--machinereadable"]).done(function(data) {
        var vmList = data.split('\n\n');
        // Limpar a lista anterior
        var ul = document.getElementById('vmInfo');
        ul.innerHTML = '';
        var li = document.createElement('li');
        var buttonNew = document.createElement('button');
        var buttonAdd = document.createElement('button');
        var buttonSet = document.createElement('button');
        var buttonSto = document.createElement('button');
        var buttonFst = document.createElement('button');

        buttonNew.textContent = "New";
        buttonAdd.textContent = "Add";
        buttonSet.textContent = "Settings";
        buttonSto.textContent = "Start";
        buttonFst.textContent = "Force";

        buttonNew.setAttribute('class', 'action-buttons');
        buttonAdd.setAttribute('class', 'action-buttons');
        buttonSet.setAttribute('class', 'action-buttons');
        buttonSto.setAttribute('class', 'action-buttons');
        buttonFst.setAttribute('class', 'action-buttons');

        buttonNew.onclick = function() {
            adicionarButtonClique(UUID);
        };
        li.appendChild(buttonNew);
        li.appendChild(buttonAdd);
        li.appendChild(buttonSet);
        li.appendChild(buttonSto);
        li.appendChild(buttonFst);
        ul.appendChild(li);

        vmList.forEach(function(vm) {
            if(vm){
                //general
                var br = document.createElement('br');
                ul.appendChild(br);
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "General:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);
                var li = document.createElement('li');
                var NameElemento = document.createElement('span');
                NameElemento.textContent = "Name :            " + machineInfoVM(vm, 'name');
                li.appendChild(NameElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var GuestElemento = document.createElement('span');
                GuestElemento.textContent = "Guest OS :       " + machineInfoVM(vm, 'ostype');
                li.appendChild(GuestElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "CPU exec cap :      " + machineInfoVM(vm, 'cpuexecutioncap');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);
                //system
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "System:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Memory size :   " + machineInfoVM(vm, 'memory');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "State :         " + machineInfoVM(vm, 'VMState');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "State Time:         " + machineInfoVM(vm, 'VMStateChangeTime');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "VT-x VPID :     " + machineInfoVM(vm, 'vtxvpid');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Autostart Enabled : " + machineInfoVM(vm, 'autostart-enabled');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Autostart Delay : " + machineInfoVM(vm, 'autostart-delay');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "VRDE : " + machineInfoVM(vm, 'vrde');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "VRDE : " + machineInfoVM(vm, 'vrdeports');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);

                //Storage Controllers:
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "Storage:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "Storage Controllers :   " + machineInfoVM(vm, 'storagecontrollername0');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);

                //Network Controllers:
                var li = document.createElement('li');
                var GeneralElemento = document.createElement('span');
                var BoldElemento = document.createElement('strong');
                BoldElemento.textContent = "Networks:";
                GeneralElemento.appendChild(BoldElemento);
                li.appendChild(GeneralElemento);
                ul.appendChild(li);
                var br = document.createElement('br');
                ul.appendChild(br);
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 1 :   " + machineInfoVM(vm, 'nic1');
                li.appendChild(SystemeElemento);
                ul.appendChild(li);   
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 2 :   " + machineInfoVM(vm, 'nic2');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 3 :   " + machineInfoVM(vm, 'nic3');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 4 :   " + machineInfoVM(vm, 'nic4');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 5 :   " + machineInfoVM(vm, 'nic5');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 6 :   " + machineInfoVM(vm, 'nic6');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 7 :   " + machineInfoVM(vm, 'nic7');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 
                var li = document.createElement('li');
                var SystemeElemento = document.createElement('span');
                SystemeElemento.textContent = "NIC 8 :   " + machineInfoVM(vm, 'nic8');
                li.appendChild(SystemeElemento);
                ul.appendChild(li); 

                var estado = machineInfoVM(vm, 'VMState');
                startStopMachine(buttonSto, estado, UUID);
                settingsMachine(buttonSet, estado, UUID);
            };
        });
    }).fail(function(error) {
        // Exibir mensagem de erro se houver falha na execução do comando
        console.error('Erro ao listar as máquinas virtuais:', error);
        var ul = document.getElementById('vmList');
        ul.innerHTML = '<li class="vm-item">Erro ao listar as informações virtuais: ' + error + '</li>';
    });
}
function adicionarButtonClique(UUID) {
    alert(UUID);
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
        alert(UUID);
    };
    var buttonNetwork = document.createElement('button');
    buttonNetwork.textContent = "Network";
    buttonNetwork.setAttribute('class', 'action-buttons');
    buttonNetwork.onclick = function() {
        alert(UUID);
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

    var form = document.createElement('div');
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
                    }
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
function startStopMachine(buttonSto, estado, UUID){
    switch (estado) {
        case 'running':
            buttonSto.textContent = 'Stop';
            buttonSto.onclick = function() {
                cockpit.spawn(['VBoxManage', 'controlvm', UUID, 'acpipowerbutton']).done(function(data) {
                    ShowMachineClick(UUID);
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
