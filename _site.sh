rm -rf _build_site/*
gulp buildSite --env=production --type=site
echo "--> Generando ZIP"
cd _build_site/
zip  -qq ../_deploy_server/site.zip -r .
cd ..
echo "--> Copiando ZIP al servidor"
sshpass -p "Ricard0Espech3" scp _deploy_server/site.zip dh_v94ykp@vps53033.dreamhostps.com:site.zip
echo "--> Generando Deploy"
sshpass -p "Ricard0Espech3" ssh dh_v94ykp@vps53033.dreamhostps.com "rm -rf invesafe.com/*;unzip -qq site.zip -d invesafe.com/;rm site.zip;cd invesafe.com;find . -type f -exec chmod 644 {} + ;find . -type d -exec chmod 755 {} +"
head -n 4 _build_site/content/assets/js/version.js
