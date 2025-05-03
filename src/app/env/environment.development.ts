/**
 * Configuración del entorno para el ambiente de desarrollo.
 * 
 * @property {boolean} production - Indica si la aplicación está en modo producción.
 *                                  Se establece en `false` para desarrollo.
 * @property {string} supabaseUrl - La URL de la instancia de Supabase utilizada para los servicios backend.
 * @property {string} supabaseKey - La clave API para acceder a la instancia de Supabase.
 *                                  Esta clave debe mantenerse segura y no exponerse en producción.
 */
export const environment = {
    production: false,
    supabaseUrl: 'https://tstpedxohgaopfyialvw.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdHBlZHhvaGdhb3BmeWlhbHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjU1NzUsImV4cCI6MjA2MTg0MTU3NX0.Oy0gR3ILhkGp-kY_jWJDbeblnFt9DB8z_xQN3wwMBbs'
};

