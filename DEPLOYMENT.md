# CDN Deployment Guide

## Building for CDN

1. **Build the CDN version:**
   ```bash
   npm run build:cdn
   ```

2. **Files generated:**
   - `dist/auditor-form.umd.js` - The main CDN file
   - `dist/style.css` - Styles (embedded in JS)

## Hosting Options

### Option 1: Upload to Your CDN
1. Upload `dist/auditor-form.umd.js` to your CDN
2. Use the CDN URL in your websites

### Option 2: GitHub Pages (Free)
1. Push your built files to a GitHub repository
2. Enable GitHub Pages
3. Access via: `https://yourusername.github.io/yourrepo/dist/auditor-form.umd.js`

### Option 3: Netlify/Vercel (Free)
1. Deploy the `dist` folder to Netlify or Vercel
2. Get your CDN URL

### Option 4: AWS S3 + CloudFront
1. Upload to S3 bucket
2. Configure CloudFront distribution
3. Use CloudFront URL

## Usage on Any Website

Once hosted, use it on any website:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Form container -->
    <div id="my-auditor-form"></div>
    
    <!-- Load the CDN script -->
    <script src="https://your-cdn-url.com/auditor-form.umd.js"></script>
    
    <!-- Initialize with your configuration -->
    <script>
        window.initAuditorForm('my-auditor-form', {
            apiUrl: 'https://your-api.com/api',
            apiHeaders: {
                'x-access-api-key': 'your-key',
                'x-public-api-key': 'your-public-key',
                'Authorization': 'Bearer your-token'
            },
            recaptchaSiteKey: 'your-recaptcha-key'
        });
    </script>
</body>
</html>
```

## Configuration Options

### Required
- `apiUrl`: Your API base URL
- `apiHeaders`: Object with all your custom headers

### Optional
- `recaptchaSiteKey`: Google ReCAPTCHA site key
- `theme`: Customize colors and styling
- `onSubmit`: Callback when form is submitted
- `onSuccess`: Callback on successful submission
- `onError`: Callback on error

## Example Headers Configuration

```javascript
apiHeaders: {
    'x-access-api-key': 'your-access-key',
    'x-public-api-key': 'your-public-key',
    'Authorization': 'Bearer your-jwt-token',
    'x-custom-header': 'custom-value',
    'x-tenant-id': 'tenant-123'
}
```

The form will automatically include these headers in all API requests.