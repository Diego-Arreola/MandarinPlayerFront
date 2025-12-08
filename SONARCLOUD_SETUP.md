# Configuración de SonarCloud

## Paso a paso para configurar SonarCloud con GitHub Actions

### 1. Registrarse en SonarCloud
- Ve a: https://sonarcloud.io
- Haz clic en "Sign up" y selecciona "Sign up with GitHub"
- Autoriza a SonarCloud

### 2. Crear proyecto en SonarCloud
- En SonarCloud, haz clic en "+" → "Create new project"
- Selecciona el repositorio: `MandarinPlayerFront`
- Selecciona plan: "Free"
- Recibirás un `SONAR_TOKEN`

### 3. Agregar token a GitHub
1. Ve a: https://github.com/Diego-Arreola/MandarinPlayerFront/settings/secrets/actions
2. Haz clic en "New repository secret"
3. Nombre: `SONAR_TOKEN`
4. Valor: El token de SonarCloud (mantenlo secreto)
5. Haz clic en "Add secret"

### 4. Configuración completada
- Los archivos ya están listos:
  - `.github/workflows/sonarcloud.yml` → Workflow de GitHub Actions
  - `sonar-project.properties` → Configuración de SonarCloud

### 5. Cómo funciona
Cada vez que hagas:
- **Push a main o develop** → Se ejecuta análisis automático
- **Pull request a main o develop** → Se ejecuta análisis automático

El workflow automáticamente:
1. Instala dependencias
2. Ejecuta tests con coverage
3. Sube resultados a SonarCloud

### 6. Ver resultados
- Ve a: https://sonarcloud.io/project/overview?id=Diego-Arreola_MandarinPlayerFront
- Verás métricas de cobertura, bugs, code smells, etc.

## Cambios realizados

- Creado: `.github/workflows/sonarcloud.yml`
- Actualizado: `sonar-project.properties`

## Notas

- El SONAR_TOKEN debe mantenerse secreto en GitHub
- SonarCloud es gratis para repositorios públicos
- El análisis se ejecuta automáticamente con cada push/PR
