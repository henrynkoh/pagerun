'use client'

import { useState } from 'react'

export default function Home() {
  const [apiToken, setApiToken] = useState('')
  const [method, setMethod] = useState('GET')
  const [path, setPath] = useState('incidents')
  const [queryParams, setQueryParams] = useState('')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeRequest = async () => {
    if (!apiToken) {
      setError('API token is required')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const url = `/api/pagerduty?token=${encodeURIComponent(apiToken)}&method=${method}&path=${encodeURIComponent(path)}`
      
      const requestBody: any = {}
      if (queryParams) {
        try {
          requestBody.queryParams = JSON.parse(queryParams)
        } catch (e) {
          setError('Invalid query params JSON')
          setLoading(false)
          return
        }
      }
      if (headers) {
        try {
          requestBody.headers = JSON.parse(headers)
        } catch (e) {
          setError('Invalid headers JSON')
          setLoading(false)
          return
        }
      }
      if (body) {
        try {
          requestBody.body = JSON.parse(body)
        } catch (e) {
          setError('Invalid body JSON')
          setLoading(false)
          return
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Request failed')
      } else {
        setResponse(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Pagerun</h1>
        <p className="text-xl text-gray-600 mb-8">
          PagerDuty API Wrapper & Demo
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                PagerDuty API Token *
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter your PagerDuty API token"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  HTTP Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  API Path
                </label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="e.g., incidents, users, services"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Query Parameters (JSON)
              </label>
              <textarea
                value={queryParams}
                onChange={(e) => setQueryParams(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-20"
                placeholder='{"statuses": ["triggered"], "limit": 10}'
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Headers (JSON)
              </label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-20"
                placeholder='{"from": "user@example.com"}'
              />
            </div>

            {method !== 'GET' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Request Body (JSON)
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md h-32"
                  placeholder='{"incident": {"type": "incident", "title": "Test incident"}}'
                />
              </div>
            )}

            <button
              onClick={makeRequest}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Making Request...' : 'Make Request'}
            </button>
          </div>

          {/* Response Display */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Response</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            )}

            {response && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-gray-800 font-medium mb-2">Success</h3>
                <pre className="text-sm text-gray-700 overflow-auto max-h-96">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}

            {!response && !error && !loading && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center text-gray-500">
                Enter your API token and parameters, then click "Make Request" to see the response here.
              </div>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Get Incidents</h3>
              <p className="text-sm text-gray-600 mb-2">Path: incidents</p>
              <p className="text-sm text-gray-600">Query: {'{"statuses": ["triggered"]}'}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Get Users</h3>
              <p className="text-sm text-gray-600 mb-2">Path: users</p>
              <p className="text-sm text-gray-600">Query: {'{"limit": 10}'}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Get Services</h3>
              <p className="text-sm text-gray-600 mb-2">Path: services</p>
              <p className="text-sm text-gray-600">Query: {'{"limit": 20}'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 