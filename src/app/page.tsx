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
  const [activeTab, setActiveTab] = useState<'demo' | 'docs' | 'marketing'>('demo')

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Pagerun</h1>
        <p className="text-xl text-gray-600 mb-8">
          PagerDuty API Wrapper & Demo
        </p>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'demo'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🚀 Live Demo
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'docs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Documentation
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'marketing'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📢 Marketing Materials
          </button>
        </div>

        {/* Demo Tab */}
        {activeTab === 'demo' && (
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
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📖 Complete Documentation</h2>
              <p className="text-gray-600 mb-6">
                Pagerun comes with comprehensive documentation to help you get started quickly and scale confidently.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">🚀 Quickstart Guide</h3>
                  <p className="text-gray-600 mb-3">
                    Get up and running with Pagerun in minutes with our step-by-step quickstart guide.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Key Topics:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Installation and setup</li>
                      <li>• Basic usage examples</li>
                      <li>• Common operations</li>
                      <li>• Troubleshooting tips</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">📚 Full Manual</h3>
                  <p className="text-gray-600 mb-3">
                    Comprehensive documentation covering all features, advanced usage, and best practices.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Coverage:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• API reference</li>
                      <li>• Error handling</li>
                      <li>• Configuration options</li>
                      <li>• Real-world examples</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Code Examples</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">Basic Usage</h5>
                    <pre className="text-xs bg-white p-2 rounded border">
{`const pagerduty = new PagerDutyConnection('YOUR_TOKEN')
const incidents = await pagerduty.get('incidents')`}
                    </pre>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">Advanced Features</h5>
                    <pre className="text-xs bg-white p-2 rounded border">
{`const incidents = await pagerduty.get('incidents', {
  queryParams: { statuses: ['triggered'] },
  headers: { from: 'user@example.com' }
})`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Marketing Materials Tab */}
        {activeTab === 'marketing' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📢 Marketing Materials</h2>
              <p className="text-gray-600 mb-6">
                Ready-to-use marketing content for promoting Pagerun across all major platforms.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Social Media */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">📱 Social Media</h3>
                  <p className="text-gray-600 mb-3">
                    Platform-specific content for Facebook, Instagram, Threads, LinkedIn, and Twitter.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Facebook Ad Copy
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Instagram Posts
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      LinkedIn Articles
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Twitter Threads
                    </div>
                  </div>
                </div>

                {/* Content Marketing */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">📝 Content Marketing</h3>
                  <p className="text-gray-600 mb-3">
                    Blog posts, press releases, and email newsletter templates.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Medium Blog Post
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Press Release
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Email Newsletter
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      YouTube Script
                    </div>
                  </div>
                </div>

                {/* Community */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">👥 Community</h3>
                  <p className="text-gray-600 mb-3">
                    Reddit posts, Hacker News submissions, and Product Hunt launches.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Reddit r/webdev
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Reddit r/typescript
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Hacker News
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Product Hunt
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Marketing Content */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">🎯 Sample Marketing Copy</h4>
                <div className="bg-white p-4 rounded border">
                  <h5 className="font-medium text-gray-800 mb-2">Facebook Ad Headline:</h5>
                  <p className="text-gray-700 italic mb-3">
                    "Transform Your PagerDuty Integration with Pagerun"
                  </p>
                  <h5 className="font-medium text-gray-800 mb-2">Key Benefits:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Zero-configuration setup</li>
                    <li>• Interactive demo interface</li>
                    <li>• Full TypeScript support</li>
                    <li>• Serverless API routes</li>
                    <li>• MIT licensed (completely free!)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">📋 Ready to Use</h4>
                <p className="text-yellow-800 text-sm">
                  All marketing materials are pre-written and ready to copy-paste. Just replace placeholder links 
                  with your actual URLs and customize personal details as needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Examples Section - Always Visible */}
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

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Pagerun - Making PagerDuty integration simple and developer-friendly
            </p>
            <p className="text-sm">
              MIT Licensed • Open Source • Built with Next.js & TypeScript
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 