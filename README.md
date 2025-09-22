# Auditor Form CDN

A CDN-ready auditor application form that can be embedded into any website with dynamic API configuration.

## Features

- 🚀 **CDN Ready**: Build once, embed anywhere
- 🔧 **Dynamic Configuration**: Pass API endpoints and headers at runtime
- 🎨 **Customizable**: Theme colors and styling options
- 📱 **Responsive**: Works on all devices
- 🔒 **Secure**: Optional ReCAPTCHA integration
- 📝 **Form Validation**: Built-in form validation with Zod
- 🌐 **Multi-level Dropdowns**: Country/State/City selection
- 📁 **File Upload**: Resume/document upload support
- 🏗️ **Hierarchical Selection**: Programs and schemes selection

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for CDN distribution
npm run build:cdn
```

## CDN Usage

### 1. Include the Script

```html
<script src="https://cdn.yourdomain.com/auditor-form.umd.js"></script>
```

### 2. Create Container

```html
<div id="auditor-form-container"></div>
```

### 3. Initialize Form

```javascript
window.initAuditorForm('auditor-form-container', {
    // Required: API Configuration
    apiUrl: 'https://your-api.com/api',
    apiHeaders: {
        'Authorization': 'Bearer your-token',
        'x-api-key': 'your-api-key',
        'x-custom-header': 'custom-value'
    },
    
    // Optional: ReCAPTCHA
    recaptchaSiteKey: 'your-recaptcha-site-key',
    
    // Optional: Theme customization
    theme: {
        primaryColor: '#059669',
        backgroundColor: '#f0fdf7',
        borderRadius: '0.5rem'
    },
    
    // Optional: Event callbacks
    onSubmit: function(formData) {
        console.log('Form submitted:', formData);
    },
    
    onSuccess: function(response) {
        console.log('Success:', response);
    },
    
    onError: function(error) {
        console.error('Error:', error);
    }
});
```

## Configuration Options

### API Configuration
- `apiUrl`: Base URL for your API
- `apiHeaders`: Object with custom headers (authorization, API keys, etc.)

### Theme Configuration
- `theme.primaryColor`: Primary color for buttons and accents
- `theme.backgroundColor`: Background color for the form
- `theme.borderRadius`: Border radius for form elements

### Callbacks
- `onSubmit(formData)`: Called when form is submitted (before API call)
- `onSuccess(response)`: Called when submission is successful
- `onError(error)`: Called when submission fails

### Security
- `recaptchaSiteKey`: Google ReCAPTCHA site key (optional)

## API Endpoints Required

Your API should provide these endpoints:

```
GET /global/country/ - List of countries
GET /global/state/?country={id} - States by country
GET /global/city/?state={id} - Cities by state
GET /global/programme/ - List of programmes
GET /global/scheme/?programme={id} - Schemes by programme
POST /company/auditor/create/ - Submit form data
```

## Form Data Structure

The form submits data in `multipart/form-data` format with these fields:

```javascript
{
  full_name: "John Doe",
  email: "john@example.com",
  phone_number: "+1234567890",
  company: "Company Name",
  country_id: "1",
  state_id: "1",
  city_id: "1",
  address: "Address",
  pincode: "12345",
  message: "Remarks",
  programmes: ["1", "2"], // Array of programme IDs
  schemes: ["1", "2", "3"], // Array of scheme IDs
  resume: File // File object
}
```

## Styling

The form uses Tailwind CSS classes and can be customized via the theme configuration. All styles are included in the CDN bundle.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)
- Mobile browsers

## Examples

See `public/cdn-example.html` for a complete usage example.