import { NextRequest, NextResponse } from 'next/server'
import { PagerDutyConnection, PagerDutyConnectionError } from '@/lib/pagerduty-connection'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const method = searchParams.get('method')
    const path = searchParams.get('path')

    if (!token) {
      return NextResponse.json(
        { error: 'API token is required' },
        { status: 400 }
      )
    }

    if (!method || !path) {
      return NextResponse.json(
        { error: 'Method and path are required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const pagerduty = new PagerDutyConnection(token)

    let result
    switch (method.toUpperCase()) {
      case 'GET':
        result = await pagerduty.get(path, body)
        break
      case 'POST':
        result = await pagerduty.post(path, body)
        break
      case 'PUT':
        result = await pagerduty.put(path, body)
        break
      case 'DELETE':
        result = await pagerduty.delete(path, body)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid HTTP method' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof PagerDutyConnectionError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }

    console.error('PagerDuty API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 