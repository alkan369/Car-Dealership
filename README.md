# Car-Dealership

The branch consists of a simple CI/CD for a hello world
web server node js project.

## Version Control System

The version control system that has been used
is Git with repository in Github.

---

## Branching Strategy

The branching strategy that has been used is:
feature/implement-**(issue)**.
The final implementation of the whole CI/CD workflow(with all
feature branches merged)
will be in branch **feature/implement-ci/cd**.

---

## The Content Of The Workflow

* Git-Leaks Check
* Style Check
  * Code Style Check
  * Editor Config Check
  * Markdown Files Check
* Security Check
  * Code Check With SNYK
  * Code Check With SonarCloud
* Image Build
  <!-- * Compile TS Code To JS
  * Run Unit Tests
  * Build Docker Image
  * Push To DockerHub
  * And Upload -->
* Deploy To AWS EC2

---

## Brief Explanation Of The Workflow

### Git Leaks Check

Uses the integrated github action(Gitleaks) to check
for any hardcoded secrets in the git repository.

### Style Check

The Style Check consists of 3 jobs(Code Style Check,
Editor Config Check and Markdown Files Check).

#### Code Style Check

The Code Style Check uses eslint(included in package.json)
and checks .ts files with option to fix the found issues.

#### Editor Config Check

The Editor Config Check uses the integrated github action(editorconfig-checker)
to validate all text files
based on the rules set in the .editorconfig file.

#### Markdown Files Check

The Markdown Files Check uses markdownlint-cli to check all .md files.

### Security Check

The Security Check consists of 2 jobs(SNYK check and SonarCloud check).

#### SNYK Check

The SNYK Check uses the integrated github action(SNYK action),
it authenticates with the SNYK_TOKEN secret
for the SNYK profile and checks the code
for any high severity issues.

#### SonarCloud Check

The SonarCloud Check uses the integrated github action(SonarCloud action),
it uses the GITHUB_TOKEN, the SONARCLOUD_TOKEN
SONARCLOUD_ORG_KEY, SONARCLOUD_PROJECT_KEY and
checks the code for issues and code smells and reports it
to the sonarcloud project with key SONARCLOUD_PROJECT_KEY.

### Build Image

The Build Image job compiles the .ts code, runs the unit tests.
After that it logs in DockerHub, builds docker image from the DockerFile,
runs Trivy Vulnerability Scanner for any issues
with the docker image(Trivy scanner is integrated in github actions),
after successful scan the docker image is pushed in DockerHub.
At last the docker image name is uploaded as artifact with retention-days:1.

### Deploy To AWS EC2

The Deployment job downloads the docker image name artifact and saves
it to an env variable.
Then through SSH(SSH is integrated in github actions) connects
to the AWS EC2 instance, stops all the running docker containers,
removes those docker containers and deletes all the images.
Then it pull the latest docker image and starts a new container.

### Deploy to Minikube via ArgoCD

ArgoCD has been installed in local minicube, which tracks
github.com/alkan369/argocd-app-config/tree/main
where configuration for deployment and for ArgoCD is stored.
When the version of the image is changed and the change is committed
to the repository, ArgoCD automatically syncs the deployment with it.
