FROM registry-proxy.engineering.redhat.com/rh-osbs/rhacm2-yarn-builder:v2.3.0_14-1.20210810163126 AS builder
ARG TARGET_BRANCH=master

RUN dnf install -y git
RUN git clone https://github.com/SanjalKatiyar/dfr-console.git
WORKDIR /dfr-console
RUN git fetch origin ${TARGET_BRANCH} && git checkout origin/${TARGET_BRANCH}

RUN yarn install --prod=false
RUN yarn build
RUN mv ./dist ../app

FROM registry.access.redhat.com/ubi8/nginx-118
ADD default.conf "${NGINX_CONFIGURATION_PATH}"
COPY --from=builder /app .
CMD /usr/libexec/s2i/run

LABEL maintainer="Sanjal Katiyar <skatiyar@redhat.com>"
LABEL name="dfr-console"
LABEL version=""
LABEL description="Data Federation Console container"
LABEL summary="Provides the latest console for Data Federation."
LABEL io.k8s.display-name="DFR Console"
LABEL io.openshift.tags="dfr"
