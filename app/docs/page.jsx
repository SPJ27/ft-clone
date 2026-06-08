const Page = () => {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/public/project',
      param: 'project_id',
      response: '{ data: { id, created_at, total_hours, project_name, project_desc, project_demo, project_repo, banner_url, devlogs } }',
    },
    {
      method: 'GET',
      path: '/api/public/user',
      param: 'user_id',
      response: '{ user: { id, created_at, name, hackclub_id, cookies, hours } }',
    },
  ]

  return (
    <div className="px-5 flex justify-center mt-15 w-full">
      <div className="max-w-2xl w-full flex flex-col gap-3 font-mono">
        <p className="text-xs uppercase tracking-widest text-[#7b4942] mb-1">Public API</p>
        {endpoints.map(({ method, path, param, response }) => (
          <div key={path} className="border-[hsl(22.59,34.14%,51.18%)] rounded-md p-2 sm:p-3 px-3 sm:px-5 bg-[#7b4942]">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <span className="text-xs font-medium bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                {method}
              </span>
              <code className="text-sm text-white">{path}</code>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex gap-3 text-sm">
                <span className="text-white w-24 shrink-0">Query param</span>
                <code className="text-white bg-white/5 px-1.5 py-0.5 rounded text-xs">{param}</code>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-white w-24 shrink-0">Response</span>
                <code className="text-white/60 text-xs leading-relaxed break-all">{response}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page