#!/bin/bash
# Título: Meu Script em Shell
# Descrição: instalar o myplugin no cockpit.

rsync -avz /usr/share/cockpit/virtualbox user@servidor_remoto:/caminho/para/pasta/destino/
sudo systemctl restart cockpit
