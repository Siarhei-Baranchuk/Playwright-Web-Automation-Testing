FROM mcr.microsoft.com/playwright:v1.56.1-noble

RUN mkdir /Playwright-Web-Automation-Testing
WORKDIR /Playwright-Web-Automation-Testing
COPY . /Playwright-Web-Automation-Testing

RUN npm install --force
RUN npx playwright install