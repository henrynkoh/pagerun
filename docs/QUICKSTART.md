# Pagerun Quickstart Guide

Get up and running with Pagerun in minutes! This guide will walk you through setting up and using the PagerDuty API wrapper.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A PagerDuty account with API access
- A PagerDuty API token

## Step 1: Get Your PagerDuty API Token

1. Log in to your PagerDuty account
2. Go to **Configuration** → **API Access Keys**
3. Click **Create New API Key**
4. Give it a name (e.g., "Pagerun Development")
5. Copy the generated token (you'll only see it once!)

## Step 2: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/henrynkoh/pagerun.git
cd pagerun

# Install dependencies
npm install

# Start the development server
npm run dev -- -p 5000
```

## Step 3: Try the Demo UI

1. Open your browser to [http://localhost:5000](http://localhost:5000)
2. Enter your PagerDuty API token
3. Try these examples:

### Example 1: Get All Incidents
- **Method**: GET
- **Path**: `incidents`
- Click "Make Request"

### Example 2: Get Triggered Incidents
- **Method**: GET
- **Path**: `incidents`
- **Query Parameters**: `{"statuses": ["triggered"], "limit": 10}`
- Click "Make Request"

### Example 3: Get Users
- **Method**: GET
- **Path**: `users`
- **Query Parameters**: `{"limit": 5}`
- Click "Make Request"

## Step 4: Use in Your Code

### Basic Usage

```typescript
import { PagerDutyConnection } from '@/lib/pagerduty-connection'

// Initialize
const pagerduty = new PagerDutyConnection('YOUR_API_TOKEN')

// Get incidents
const incidents = await pagerduty.get('incidents')
console.log(`Found ${incidents.incidents?.length || 0} incidents`)

// Get filtered incidents
const triggeredIncidents = await pagerduty.get('incidents', {
  queryParams: {
    statuses: ['triggered'],
    limit: 10
  }
})
```

### Error Handling

```typescript
try {
  const incident = await pagerduty.get('incidents/INVALID_ID')
} catch (error) {
  if (error instanceof PagerDutyConnectionError) {
    console.log(`Error ${error.status}: ${error.message}`)
  }
}
```

## Step 5: Common Operations

### Get Incidents by Status
```typescript
const incidents = await pagerduty.get('incidents', {
  queryParams: {
    statuses: ['triggered', 'acknowledged'],
    limit: 50
  }
})
```

### Create an Incident
```typescript
const newIncident = await pagerduty.post('incidents', {
  body: {
    incident: {
      type: 'incident',
      title: 'Test incident from Pagerun',
      service: {
        id: 'YOUR_SERVICE_ID',
        type: 'service_reference'
      }
    }
  }
})
```

### Update an Incident
```typescript
const updatedIncident = await pagerduty.put('incidents/INCIDENT_ID', {
  body: {
    incident: {
      title: 'Updated incident title'
    }
  }
})
```

### Get Users
```typescript
const users = await pagerduty.get('users', {
  queryParams: { limit: 20 }
})
```

### Get Services
```typescript
const services = await pagerduty.get('services')
```

## Step 6: Advanced Configuration

### Custom Domain (Enterprise)
```typescript
const pagerduty = new PagerDutyConnection('YOUR_TOKEN', {
  url: 'https://your-domain.pagerduty.com'
})
```

### Custom Timeout
```typescript
const pagerduty = new PagerDutyConnection('YOUR_TOKEN', {
  timeout: 60000 // 60 seconds
})
```

### Custom Headers
```typescript
const incidents = await pagerduty.get('incidents', {
  headers: {
    'from': 'user@example.com'
  }
})
```

## Step 7: Next Steps

### Explore the Examples
Check out the example files in the `examples/` directory:
- `basic-usage.ts` - Simple examples
- `advanced-usage.ts` - Complex scenarios

### Read the Full Manual
For detailed documentation, see `docs/MANUAL.md`

### API Reference
- [PagerDuty REST API Documentation](https://developer.pagerduty.com/api-reference/)
- [Pagerun API Reference](docs/MANUAL.md#api-reference)

## Troubleshooting

### Common Issues

**"API token is required" error**
- Make sure you've entered your API token correctly
- Verify the token hasn't expired
- Check that the token has the necessary permissions

**"401 Unauthorized" error**
- Verify your API token is valid
- Check your PagerDuty account status
- Ensure the token has the required scopes

**"404 Not Found" error**
- Check the API path is correct
- Verify the resource exists in your PagerDuty account
- Ensure you have access to the resource

**Rate limiting**
- PagerDuty has rate limits (typically 900 requests per minute)
- Implement exponential backoff for retries
- Use pagination for large datasets

### Getting Help

1. **Check the demo UI** - Test your API calls interactively
2. **Review error messages** - They often contain helpful information
3. **Check PagerDuty status** - Visit [status.pagerduty.com](https://status.pagerduty.com)
4. **Open an issue** - Use GitHub issues for bugs or feature requests

## What's Next?

Now that you're up and running with Pagerun, you can:

- **Build integrations** - Create custom dashboards and tools
- **Automate workflows** - Set up incident management automation
- **Monitor systems** - Integrate with your monitoring stack
- **Create reports** - Generate custom reports and analytics

Happy coding with Pagerun! 🚀 