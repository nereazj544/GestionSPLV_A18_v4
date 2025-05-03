/**
 * @fileoverview Configuración del entorno para la aplicación Angular.
 * Contiene las variables necesarias para la conexión con Supabase.
 */

/**
 * @constant {Object} environment
 * @property {boolean} production - Indica si la aplicación está en modo de producción.
 * @property {string} supabaseUrl - URL de la instancia de Supabase utilizada por la aplicación.
 * @property {string} supabaseKey - Clave de acceso para la instancia de Supabase.
 */
export const environment = {
    production: true,
    supabaseUrl: 'https://tstpedxohgaopfyialvw.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdHBlZHhvaGdhb3BmeWlhbHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjU1NzUsImV4cCI6MjA2MTg0MTU3NX0.Oy0gR3ILhkGp-kY_jWJDbeblnFt9DB8z_xQN3wwMBbs'
};
