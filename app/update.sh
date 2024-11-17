#!/bin/bash
# Título: Meu Script em Shell
# Descrição: instalar o myplugin no cockpit.

cd /usr/share/cockpit/
sudo mkdir virtualbox
cd virtualbox
sudo rm index.html
sudo wget http://10.0.0.12/web/cockpit/virtualbox/index.html
sudo rm manifest.json
sudo wget http://10.0.0.12/web/cockpit/virtualbox/manifest.json
sudo rm script.js
sudo wget http://10.0.0.12/web/cockpit/virtualbox/script.js
sudo rm styles.css
sudo wget http://10.0.0.12/web/cockpit/virtualbox/styles.css
sudo systemctl restart cockpit
