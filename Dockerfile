FROM nginx:1.19.10
COPY dist/ /usr/share/nginx/html
COPY nginx-vhost.conf /etc/nginx/conf.d/nginx-vhost.conf
