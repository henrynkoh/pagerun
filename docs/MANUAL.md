# Pagerun Manual

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [Configuration](#configuration)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)
10. [Examples](#examples)

## Overview

Pagerun is a comprehensive Next.js and TypeScript wrapper for the PagerDuty REST API. It provides a clean, developer-friendly interface for integrating PagerDuty into your applications with robust error handling, TypeScript support, and a live demo UI.

### Key Features
- **Simple REST API wrapper**: Unified interface for all HTTP methods
- **TypeScript support**: Full type safety and IntelliSense
- **Error handling**: Custom error classes with detailed information
- **Flexible configuration**: Custom domains, timeouts, and headers
- **Demo UI**: Interactive web interface for testing API calls
- **Serverless ready**: Works with Next.js API routes

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PagerDuty API token

### Setup
```bash
# Clone the repository
git clone https://github.com/henrynkoh/pagerun.git
cd pagerun

# Install dependencies
npm install

# Start development server
npm run dev -- -p 5000
```

### Environment Variables
Create a `.env.local` file:
```env
PAGERDUTY_TOKEN=your-api-token-here
PAGERDUTY_ACCOUNT=your-account-subdomain
NEXT_PUBLIC_APP_URL=http://localhost:5000
```

## Basic Usage

### Initialization
```typescript
import { PagerDutyConnection } from '@/lib/pagerduty-connection'

const pagerduty = new PagerDutyConnection('YOUR_API_TOKEN')
```

### Making Requests
```typescript
// GET request
const incidents = await pagerduty.get('incidents')

// GET with query parameters
const filteredIncidents = await pagerduty.get('incidents', {
  queryParams: {
    statuses: ['triggered'],
    limit: 10
  }
})

// POST request
const newIncident = await pagerduty.post('incidents', {
  body: {
    incident: {
      type: 'incident',
      title: 'Test incident'
    }
  }
})

// PUT request
const updatedIncident = await pagerduty.put('incidents/INCIDENT_ID', {
  body: {
    incident: {
      title: 'Updated title'
    }
  }
})

// DELETE request
await pagerduty.delete('incidents/INCIDENT_ID')
```

## Advanced Features

### Custom Configuration
```typescript
const pagerduty = new PagerDutyConnection('YOUR_TOKEN', {
  url: 'https://custom.domain.com', // Custom domain
  timeout: 60000 // 60 seconds
})
```

### Custom Headers
```typescript
const incidents = await pagerduty.get('incidents', {
  headers: {
    'from': 'user@example.com',
    'Accept': 'application/vnd.pagerduty+json;version=2'
  }
})
```

### Pagination
```typescript
let allIncidents: any[] = []
let offset = 0
const limit = 10

while (true) {
  const page = await pagerduty.get('incidents', {
    queryParams: { limit, offset }
  })
  
  const incidents = page.incidents || []
  allIncidents.push(...incidents)
  
  if (incidents.length < limit) break
  offset += limit
}
```

### Convenience Methods
```typescript
// These methods provide shortcuts for common operations
await pagerduty.getIncidents()
await pagerduty.getUsers()
await pagerduty.getServices()
await pagerduty.getSchedules()
await pagerduty.getEscalationPolicies()
```

## Configuration

### PagerDutyConnectionOptions
```typescript
interface PagerDutyConnectionOptions {
  url?: string        // Custom API URL (default: https://api.pagerduty.com)
  timeout?: number    // Request timeout in milliseconds (default: 30000)
}
```

### RequestOptions
```typescript
interface RequestOptions {
  queryParams?: Record<string, any>  // URL query parameters
  headers?: Record<string, string>   // Custom headers
  body?: any                         // Request body (for POST/PUT)
}
```

## Error Handling

### Custom Error Class
```typescript
class PagerDutyConnectionError extends Error {
  constructor(
    public status: number,    // HTTP status code
    message: string,          // Error message
    public response?: any     // Full response object
  )
}
```

### Error Handling Examples
```typescript
try {
  const incident = await pagerduty.get('incidents/INVALID_ID')
} catch (error) {
  if (error instanceof PagerDutyConnectionError) {
    console.log(`Error ${error.status}: ${error.message}`)
    console.log('Response:', error.response)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### Common Error Scenarios
- **401 Unauthorized**: Invalid or expired API token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: PagerDuty server error

## Best Practices

### Security
- Never commit API tokens to version control
- Use environment variables for sensitive data
- Implement proper token rotation
- Use least-privilege access

### Performance
- Implement caching for frequently accessed data
- Use pagination for large datasets
- Handle rate limits gracefully
- Set appropriate timeouts

### Error Handling
- Always wrap API calls in try-catch blocks
- Log errors with sufficient context
- Implement retry logic for transient failures
- Provide user-friendly error messages

### Code Organization
- Create service classes for different PagerDuty resources
- Use TypeScript interfaces for type safety
- Implement proper separation of concerns
- Write unit tests for critical functionality

## API Reference

### Constructor
```typescript
new PagerDutyConnection(token: string, options?: PagerDutyConnectionOptions)
```

### Methods
```typescript
// Core HTTP methods
get(path: string, options?: RequestOptions): Promise<any>
post(path: string, options?: RequestOptions): Promise<any>
put(path: string, options?: RequestOptions): Promise<any>
delete(path: string, options?: RequestOptions): Promise<any>

// Convenience methods
getIncidents(options?: RequestOptions): Promise<any>
getUsers(options?: RequestOptions): Promise<any>
getServices(options?: RequestOptions): Promise<any>
getSchedules(options?: RequestOptions): Promise<any>
getEscalationPolicies(options?: RequestOptions): Promise<any>
```

### PagerDuty API Endpoints
Common endpoints you can use:
- `incidents` - Incident management
- `users` - User management
- `services` - Service management
- `schedules` - Schedule management
- `escalation_policies` - Escalation policy management
- `teams` - Team management
- `vendors` - Vendor management

## Troubleshooting

### Common Issues

**"Cannot find module" errors**
- Ensure all dependencies are installed: `npm install`
- Check TypeScript configuration in `tsconfig.json`
- Verify import paths are correct

**API authentication errors**
- Verify your API token is valid
- Check token permissions in PagerDuty
- Ensure token hasn't expired

**Rate limiting**
- Implement exponential backoff
- Use pagination for large requests
- Monitor API usage limits

**Network errors**
- Check internet connectivity
- Verify firewall settings
- Test with curl or Postman

### Debug Mode
Enable debug logging:
```typescript
// Add to your code for debugging
console.log('Request config:', config)
console.log('Response:', response)
```

### Getting Help
- Check the [PagerDuty API documentation](https://developer.pagerduty.com/api-reference/)
- Review error messages and status codes
- Test API calls in the demo UI
- Open an issue on GitHub

## Examples

### Complete Application Example
```typescript
import { PagerDutyConnection, PagerDutyConnectionError } from '@/lib/pagerduty-connection'

class PagerDutyService {
  private pagerduty: PagerDutyConnection

  constructor(token: string) {
    this.pagerduty = new PagerDutyConnection(token)
  }

  async getActiveIncidents() {
    try {
      return await this.pagerduty.get('incidents', {
        queryParams: {
          statuses: ['triggered', 'acknowledged'],
          limit: 100
        }
      })
    } catch (error) {
      if (error instanceof PagerDutyConnectionError) {
        console.error(`Failed to get incidents: ${error.message}`)
      }
      throw error
    }
  }

  async createIncident(title: string, serviceId: string) {
    try {
      return await this.pagerduty.post('incidents', {
        body: {
          incident: {
            type: 'incident',
            title,
            service: {
              id: serviceId,
              type: 'service_reference'
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof PagerDutyConnectionError) {
        console.error(`Failed to create incident: ${error.message}`)
      }
      throw error
    }
  }
}

// Usage
const service = new PagerDutyService('YOUR_TOKEN')
const incidents = await service.getActiveIncidents()
```

### Next.js API Route Example
```typescript
// pages/api/incidents.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PagerDutyConnection, PagerDutyConnectionError } from '@/lib/pagerduty-connection'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, status } = req.query

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'API token required' })
  }

  try {
    const pagerduty = new PagerDutyConnection(token)
    
    const queryParams: any = { limit: 100 }
    if (status) {
      queryParams.statuses = Array.isArray(status) ? status : [status]
    }

    const incidents = await pagerduty.get('incidents', { queryParams })
    res.status(200).json(incidents)
  } catch (error) {
    if (error instanceof PagerDutyConnectionError) {
      res.status(error.status).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
```

This manual provides comprehensive guidance for using Pagerun effectively. For additional help, refer to the examples in the `examples/` directory and the interactive demo UI. 