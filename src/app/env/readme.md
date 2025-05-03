# Archivo `env` - Gestión de Entornos

Este archivo tiene como objetivo proporcionar información sobre la configuración de los entornos en la aplicación Angular.

## ¿Qué son los archivos `env`?

En Angular, los archivos de entorno (`environment.ts` y `environment.prod.ts`) se utilizan para definir variables específicas según el entorno en el que se ejecuta la aplicación. Esto permite manejar configuraciones diferentes para desarrollo, pruebas y producción.

## Archivos disponibles

1. **`environment.ts`**  
    Este archivo contiene las configuraciones para el entorno de desarrollo.  
    Ejemplo:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000/api',
    };
    ```

2. **`environment.prod.ts`**  
    Este archivo contiene las configuraciones para el entorno de producción.  
    Ejemplo:
    ```typescript
    export const environment = {
      production: true,
      apiUrl: 'https://api.miapp.com',
    };
    ```

## ¿Cómo se utilizan?

Angular selecciona automáticamente el archivo de entorno adecuado según el comando de compilación:

- Para desarrollo:  
  ```bash
  ng serve
  ```
  Usa `environment.ts`.

- Para producción:  
  ```bash
  ng build --prod
  ```
  Usa `environment.prod.ts`.

## Agregar nuevas variables

Para agregar nuevas variables, edita ambos archivos de entorno y define las mismas claves con valores específicos para cada entorno.  
Ejemplo:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  featureFlag: true,
};
```

## Buenas prácticas

- No incluyas información sensible como contraseñas o claves API directamente en los archivos de entorno.
- Usa servicios de gestión de secretos para manejar información confidencial.

## Referencias

Consulta la [documentación oficial de Angular](https://angular.io/guide/build) para más detalles sobre la configuración de entornos.