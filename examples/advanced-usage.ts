import { PagerDutyConnection, PagerDutyConnectionError } from '../src/lib/pagerduty-connection'

// Initialize with custom options
const pagerduty = new PagerDutyConnection('YOUR_API_TOKEN', {
  timeout: 60000, // 60 seconds
  url: 'https://api.pagerduty.com' // default, can be custom domain
})

async function advancedExamples() {
  try {
    // Error handling example
    console.log('Testing error handling...')
    try {
      await pagerduty.get('incidents/INVALID_ID')
    } catch (error) {
      if (error instanceof PagerDutyConnectionError) {
        console.log(`Error ${error.status}: ${error.message}`)
      }
    }

    // Using custom headers
    console.log('Getting incidents with custom headers...')
    const incidentsWithHeaders = await pagerduty.get('incidents', {
      headers: {
        'from': 'user@example.com',
        'Accept': 'application/vnd.pagerduty+json;version=2'
      },
      queryParams: {
        limit: 5,
        offset: 0
      }
    })
    console.log(`Found ${incidentsWithHeaders.incidents?.length || 0} incidents`)

    // Pagination example
    console.log('Demonstrating pagination...')
    let allIncidents: any[] = []
    let offset = 0
    const limit = 10

    while (true) {
      const page = await pagerduty.get('incidents', {
        queryParams: {
          limit,
          offset
        }
      })

      const incidents = page.incidents || []
      allIncidents.push(...incidents)

      if (incidents.length < limit) {
        break // No more pages
      }

      offset += limit
      console.log(`Fetched page with ${incidents.length} incidents, total: ${allIncidents.length}`)
    }

    console.log(`Total incidents fetched: ${allIncidents.length}`)

    // Creating an incident (POST example)
    console.log('Creating a test incident...')
    const newIncident = await pagerduty.post('incidents', {
      body: {
        incident: {
          type: 'incident',
          title: 'Test incident from Pagerun',
          service: {
            id: 'YOUR_SERVICE_ID', // Replace with actual service ID
            type: 'service_reference'
          }
        }
      }
    })
    console.log('Created incident:', newIncident.incident.id)

    // Updating an incident (PUT example)
    console.log('Updating the incident...')
    const updatedIncident = await pagerduty.put(`incidents/${newIncident.incident.id}`, {
      body: {
        incident: {
          title: 'Updated test incident from Pagerun'
        }
      }
    })
    console.log('Updated incident title:', updatedIncident.incident.title)

    // Resolving the incident
    console.log('Resolving the incident...')
    const resolvedIncident = await pagerduty.put(`incidents/${newIncident.incident.id}`, {
      body: {
        incident: {
          status: 'resolved'
        }
      }
    })
    console.log('Incident status:', resolvedIncident.incident.status)

  } catch (error) {
    if (error instanceof PagerDutyConnectionError) {
      console.error(`PagerDuty API Error ${error.status}:`, error.message)
      console.error('Response:', error.response)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

// Run the advanced examples
advancedExamples() 