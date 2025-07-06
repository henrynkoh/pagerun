import { PagerDutyConnection } from '../src/lib/pagerduty-connection'

// Initialize the connection
const pagerduty = new PagerDutyConnection('YOUR_API_TOKEN')

async function basicExamples() {
  try {
    // Get all incidents
    console.log('Getting incidents...')
    const incidents = await pagerduty.get('incidents')
    console.log(`Found ${incidents.incidents?.length || 0} incidents`)

    // Get incidents with filters
    console.log('Getting triggered incidents...')
    const triggeredIncidents = await pagerduty.get('incidents', {
      queryParams: {
        statuses: ['triggered'],
        limit: 10
      }
    })
    console.log(`Found ${triggeredIncidents.incidents?.length || 0} triggered incidents`)

    // Get users
    console.log('Getting users...')
    const users = await pagerduty.get('users', {
      queryParams: { limit: 5 }
    })
    console.log(`Found ${users.users?.length || 0} users`)

    // Get services
    console.log('Getting services...')
    const services = await pagerduty.get('services')
    console.log(`Found ${services.services?.length || 0} services`)

    // Get a specific incident
    if (incidents.incidents && incidents.incidents.length > 0) {
      const incidentId = incidents.incidents[0].id
      console.log(`Getting incident ${incidentId}...`)
      const incident = await pagerduty.get(`incidents/${incidentId}`)
      console.log('Incident details:', incident.incident.title)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the examples
basicExamples() 