const generateAvatar = (req, res) => {
    const { nombre } = req.params;
    
    // Obtener la primera letra del nombre
    const firstLetter = nombre.charAt(0).toUpperCase();
    
    // Generar un color aleatorio pero consistente basado en el nombre
    const getColorFromName = (name) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Convertir el hash a un color hexadecimal
      const color = '#' + ((hash & 0x00FFFFFF).toString(16).padStart(6, '0'));
      return color;
    };
    
    const bgColor = getColorFromName(nombre);
    
    // Calcular el color de texto contrastante (blanco o negro)
    const getContrastColor = (hexColor) => {
      // Convertir hex a RGB
      const r = parseInt(hexColor.substr(1, 2), 16);
      const g = parseInt(hexColor.substr(3, 2), 16);
      const b = parseInt(hexColor.substr(5, 2), 16);
      
      // Calcular la luminosidad percibida
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Usar blanco para fondos oscuros y negro para fondos claros
      return luminance > 0.5 ? '#000000' : '#ffffff';
    };
    
    const textColor = getContrastColor(bgColor);
    
    // Generar la imagen SVG
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="${bgColor}" />
        <text x="100" y="100" font-family="Arial" font-size="100" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="central">
          ${firstLetter}
        </text>
      </svg>
    `;
    
    // Establecer el tipo de contenido y enviar la respuesta
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgContent);
  };
  
  module.exports = { generateAvatar };