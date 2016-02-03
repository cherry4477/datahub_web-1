FROM index.alauda.cn/asiainfoldp/baseimage-web-nodejs
#COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh

ENV TIME_ZONE=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone


##VOLUME /datahub/src/main/webapp/
#ADD ./webapp /datahub/src/main/webapp
RUN mkdir -p /datahub/raw/main/webapp
ADD ./webapp /datahub/raw/main/webapp
WORKDIR /datahub/raw/main/webapp
RUN fis3 release -d /datahub/src/main/webapp

#RUN mkdir -p /etc/nginx/sslkey

CMD ["/start.sh"]
#ENTRYPOINT ["/start.sh"]
