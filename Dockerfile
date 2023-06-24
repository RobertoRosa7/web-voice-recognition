FROM nginx:1.23.1
WORKDIR /usr/src/app
COPY .ansible/roles/install-nginx/config-files/conf.d/voice-web.conf /etc/nginx/conf.d/default.conf
COPY .ansible/roles/install-nginx/config-files/nginx.conf /etc/nginx/nginx.conf
COPY dist/voice-web /usr/share/nginx/html